import { Router, type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../db.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-only-insecure-secret-do-not-use-in-prod' : undefined);
const JWT_ACCESS_TTL = process.env.JWT_ACCESS_TTL || '15m';
const JWT_REFRESH_TTL_DAYS = 7;

if (!JWT_SECRET) {
  throw new Error('[Auth] JWT_SECRET environment variable is required. Please configure it before starting the server.');
}

const RESET_CODE_TTL_MINUTES = 10;
const RESET_CODE_RESEND_SECONDS = 60;

const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '';
};

const getDeviceInfo = (req: Request): string => {
  const ua = req.headers['user-agent'] || 'unknown';
  return ua.substring(0, 255);
};

const signAccessToken = (user: Record<string, unknown>): string => {
  return jwt.sign(
    { sub: user.id, email: user.email, username: user.username, role: user.role },
    JWT_SECRET!,
    { expiresIn: JWT_ACCESS_TTL } as jwt.SignOptions
  );
};

const generateRefreshToken = (): string => {
  return crypto.randomBytes(48).toString('hex');
};

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ code: 401, message: 'Unauthorized: missing token' });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as jwt.JwtPayload & { sub?: number; id?: number };
    (req as any).user = {
      id: decoded.sub || decoded.id,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
    };
    next();
  } catch {
    res.status(401).json({ code: 401, message: 'Invalid or expired token' });
  }
};

router.post('/register/email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, nickname } = req.body;
    if (!email || !password) {
      res.json({ code: 400, message: 'Email and password are required' });
      return;
    }
    if (password.length < 6) {
      res.json({ code: 400, message: 'Password must be at least 6 characters' });
      return;
    }

    const [rows]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      res.json({ code: 400, message: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const displayName = nickname || email.split('@')[0];

    const [result]: any = await pool.query(
      'INSERT INTO users (nickname, email, password_hash) VALUES (?, ?, ?)',
      [displayName, email, passwordHash]
    );

    const userId = result.insertId;

    await pool.query(
      'INSERT INTO user_identities (user_id, identity_type, identity_value, verified) VALUES (?, ?, ?, 1)',
      [userId, 'email', email]
    );

    await pool.query(
      'INSERT INTO user_quotas (user_id, quota_reset_at) VALUES (?, DATE_ADD(NOW(), INTERVAL 1 MONTH))',
      [userId]
    );

    const user = { id: userId, email, username: displayName, role: 'user' };
    const accessToken = signAccessToken(user);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, device_info, ip, token_hash, expires_at) VALUES (?, ?, ?, ?, ?)',
      [userId, getDeviceInfo(req), getClientIp(req), hashToken(refreshToken), expiresAt]
    );

    res.json({
      code: 200,
      message: 'Registration successful',
      data: { accessToken, refreshToken, user }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.post('/login/email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.json({ code: 400, message: 'Email and password are required' });
      return;
    }

    const [rows]: any = await pool.query(
      'SELECT id, nickname AS username, email, password_hash, avatar AS avatar_url, role FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      res.json({ code: 400, message: 'User not found' });
      return;
    }

    const userRecord = rows[0];
    const isMatch = await bcrypt.compare(password, userRecord.password_hash);
    if (!isMatch) {
      res.json({ code: 400, message: 'Invalid password' });
      return;
    }

    const user = {
      id: userRecord.id,
      email: userRecord.email,
      username: userRecord.username,
      avatar_url: userRecord.avatar_url,
      role: userRecord.role,
    };

    const accessToken = signAccessToken(user);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);

    await pool.query(
      'UPDATE users SET last_login_at = NOW(), last_login_ip = ? WHERE id = ?',
      [getClientIp(req), userRecord.id]
    );

    await pool.query(
      'INSERT INTO refresh_tokens (user_id, device_info, ip, token_hash, expires_at) VALUES (?, ?, ?, ?, ?)',
      [userRecord.id, getDeviceInfo(req), getClientIp(req), hashToken(refreshToken), expiresAt]
    );

    res.json({
      code: 200,
      message: 'Login successful',
      data: { accessToken, refreshToken, user }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.json({ code: 400, message: 'refreshToken is required' });
    return;
  }

  const tokenHash = hashToken(refreshToken);
  const [rows]: any = await pool.query(
    `SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked,
            u.nickname AS username, u.email, u.avatar AS avatar_url, u.role
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = ? AND rt.revoked = 0`,
    [tokenHash]
  );

  if (rows.length === 0) {
    res.json({ code: 401, message: 'Invalid refresh token' });
    return;
  }

  const record = rows[0];
  if (new Date(record.expires_at).getTime() < Date.now()) {
    res.json({ code: 401, message: 'Refresh token expired, please login again' });
    return;
  }

  const user = {
    id: record.user_id,
    email: record.email,
    username: record.username,
    avatar_url: record.avatar_url,
    role: record.role,
  };

  const newAccessToken = signAccessToken(user);
  const newRefreshToken = generateRefreshToken();
  const newExpiresAt = new Date(Date.now() + JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);

  await pool.query('UPDATE refresh_tokens SET revoked = 1 WHERE id = ?', [record.id]);
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, device_info, ip, token_hash, expires_at) VALUES (?, ?, ?, ?, ?)',
    [record.user_id, getDeviceInfo(req), getClientIp(req), hashToken(newRefreshToken), newExpiresAt]
  );

  res.json({
    code: 200,
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken, user }
  });
});

router.post('/logout', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  try {
    if (refreshToken) {
      await pool.query('UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ? AND user_id = ?', [hashToken(refreshToken), (req as any).user.id]);
    } else {
      await pool.query('UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?', [(req as any).user.id]);
    }
    res.json({ code: 200, message: 'Logged out' });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

router.post('/logout-all', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query('UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?', [(req as any).user.id]);
    res.json({ code: 200, message: 'Logged out from all devices' });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

router.get('/sessions', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const [rows]: any = await pool.query(
      `SELECT id, device_info, ip, created_at, expires_at
       FROM refresh_tokens
       WHERE user_id = ? AND revoked = 0 AND expires_at > NOW()
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json({ code: 200, data: rows });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

router.delete('/sessions/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const [result]: any = await pool.query(
      'UPDATE refresh_tokens SET revoked = 1 WHERE id = ? AND user_id = ?',
      [req.params.id, (req as any).user.id]
    );
    if (result.affectedRows === 0) {
      res.json({ code: 404, message: 'Session not found' });
      return;
    }
    res.json({ code: 200, message: 'Session revoked' });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

router.post('/guest/migrate', async (req: Request, res: Response): Promise<void> => {
  const { migrationToken, guestSessionId } = req.body;
  if (!migrationToken || !guestSessionId) {
    res.json({ code: 400, message: 'migrationToken and guestSessionId are required' });
    return;
  }

  try {
    const [rows]: any = await pool.query(
      'SELECT user_id, expires_at, used FROM guest_migration_tokens WHERE token = ?',
      [migrationToken]
    );
    if (rows.length === 0) {
      res.json({ code: 404, message: 'Invalid migration token' });
      return;
    }
    const record = rows[0];
    if (record.used) {
      res.json({ code: 400, message: 'Migration token already used' });
      return;
    }
    if (new Date(record.expires_at).getTime() < Date.now()) {
      res.json({ code: 400, message: 'Migration token expired' });
      return;
    }

    await pool.query('UPDATE chat_sessions SET user_id = ? WHERE session_id = ? AND user_id = 0', [record.user_id, guestSessionId]);
    await pool.query('UPDATE messages SET user_id = ? WHERE session_id = ? AND user_id = 0', [record.user_id, guestSessionId]);
    await pool.query('UPDATE guest_migration_tokens SET used = 1 WHERE id = ?', [record.id]);

    res.json({ code: 200, message: 'Guest data migrated successfully' });
  } catch (error) {
    console.error('Guest migration error:', error);
    res.json({ code: 500, message: 'Migration failed' });
  }
});

router.get('/profile', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const [rows]: any = await pool.query(
      'SELECT id, nickname AS username, email, avatar AS avatar_url, role, onboarded, last_login_at FROM users WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ code: 404, message: 'User not found' });
      return;
    }
    const [quotaRows]: any = await pool.query(
      'SELECT chat_limit, used_chats, paint_limit, used_paints, quota_reset_at FROM user_quotas WHERE user_id = ?',
      [userId]
    );
    res.json({ code: 200, data: { ...rows[0], quota: quotaRows[0] || null } });
  } catch (error) {
    console.error('Profile error:', error);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.put('/profile', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { nickname, avatar } = req.body;
    const updates: string[] = [];
    const values: any[] = [];
    if (nickname !== undefined) { updates.push('nickname = ?'); values.push(nickname); }
    if (avatar !== undefined) { updates.push('avatar = ?'); values.push(avatar); }
    if (updates.length === 0) {
      res.json({ code: 400, message: 'No fields to update' });
      return;
    }
    values.push(userId);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ code: 200, message: 'Profile updated' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.post('/password-reset/send-code', async (req: Request, res: Response): Promise<void> => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email) {
      res.json({ code: 400, message: 'Email is required' });
      return;
    }

    const [userRows]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (userRows.length === 0) {
      res.json({ code: 200, message: 'If the account exists, a verification code has been sent' });
      return;
    }

    const [recentRows]: any = await pool.query(
      `SELECT id, created_at FROM verification_codes
       WHERE email = ? AND type = 'reset_password' ORDER BY id DESC LIMIT 1`,
      [email]
    );

    if (recentRows.length > 0) {
      const seconds = Math.floor((Date.now() - new Date(recentRows[0].created_at).getTime()) / 1000);
      if (seconds < RESET_CODE_RESEND_SECONDS) {
        res.json({ code: 429, message: `Please wait ${RESET_CODE_RESEND_SECONDS - seconds}s before requesting again` });
        return;
      }
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + RESET_CODE_TTL_MINUTES * 60 * 1000);
    const ip = getClientIp(req);

    await pool.query(
      `UPDATE verification_codes SET used = 1 WHERE email = ? AND type = 'reset_password' AND used = 0`,
      [email]
    );
    await pool.query(
      `INSERT INTO verification_codes (email, code, type, used, ip, expires_at)
       VALUES (?, ?, 'reset_password', 0, ?, ?)`,
      [email, code, ip, expiresAt]
    );

    const [keyRows]: any = await pool.query("SELECT config_value FROM system_configs WHERE config_key = 'smtp_host'");
    const hasSmtp = keyRows.length > 0 && keyRows[0].config_value;
    if (hasSmtp) {
      const [smtpRows]: any = await pool.query(
        `SELECT config_value FROM system_configs WHERE config_key IN ('smtp_host','smtp_port','smtp_user','smtp_pass','smtp_from')`
      );
      const configs: Record<string, string> = {};
      for (const r of smtpRows) configs[r.config_key] = String(r.config_value || '').trim();
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          host: configs['smtp_host'], port: Number(configs['smtp_port'] || 465),
          secure: Number(configs['smtp_port'] || 465) === 465,
          auth: { user: configs['smtp_user'], pass: configs['smtp_pass'] },
        });
        await transporter.sendMail({
          from: configs['smtp_from'] || configs['smtp_user'],
          to: email,
          subject: '灵策智算 - 找回密码验证码',
          html: `<div style="font-family:Arial;padding:24px;background:#0f1117;color:#fff">
            <h2>灵策智算</h2><p>您的验证码：<strong style="font-size:24px;letter-spacing:4px">${code}</strong></p>
            <p>${RESET_CODE_TTL_MINUTES}分钟内有效，仅可使用一次。</p></div>`,
        });
      } catch (mailErr) {
        console.error('SMTP send error:', mailErr);
      }
    }

    res.json({ code: 200, message: 'Verification code sent' });
  } catch (error: any) {
    console.error('Send reset code error:', error);
    res.json({ code: 500, message: 'Failed to send verification code' });
  }
});

router.post('/password-reset/confirm', async (req: Request, res: Response): Promise<void> => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const code = String(req.body?.code || '').trim();
    const password = String(req.body?.password || '');

    if (!email || !code || !password) {
      res.json({ code: 400, message: 'Email, code and password are required' });
      return;
    }
    if (password.length < 6) {
      res.json({ code: 400, message: 'Password must be at least 6 characters' });
      return;
    }

    const [codeRows]: any = await pool.query(
      `SELECT id, expires_at, attempts FROM verification_codes
       WHERE email = ? AND code = ? AND type = 'reset_password' AND used = 0
       ORDER BY id DESC LIMIT 1`,
      [email, code]
    );

    if (codeRows.length === 0) {
      res.json({ code: 400, message: 'Invalid verification code' });
      return;
    }

    if (new Date(codeRows[0].expires_at).getTime() < Date.now()) {
      res.json({ code: 400, message: 'Verification code expired' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [passwordHash, email]);
    await pool.query('UPDATE verification_codes SET used = 1 WHERE id = ?', [codeRows[0].id]);
    await pool.query('UPDATE refresh_tokens SET revoked = 1 WHERE user_id = (SELECT id FROM users WHERE email = ?)', [email]);

    res.json({ code: 200, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.json({ code: 500, message: 'Server error' });
  }
});

export default router;
