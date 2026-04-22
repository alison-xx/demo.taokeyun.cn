import { Router, type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import pool from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-only-insecure-secret-do-not-use-in-prod' : undefined);
const RESET_CODE_TTL_MINUTES = 10;
const RESET_CODE_RESEND_SECONDS = 60;

if (!JWT_SECRET) {
  throw new Error('[Auth] JWT_SECRET environment variable is required. Please configure it before starting the server.');
}

const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '';
};

const getMailConfig = async () => {
  const [rows]: any = await pool.query(
    `SELECT config_key, config_value
     FROM system_configs
     WHERE config_key IN ('smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from')`
  );

  const configs = new Map<string, string>();
  for (const row of rows) {
    configs.set(row.config_key, String(row.config_value || '').trim());
  }

  const host = configs.get('smtp_host') || process.env.SMTP_HOST || '';
  const port = Number(configs.get('smtp_port') || process.env.SMTP_PORT || 465);
  const user = configs.get('smtp_user') || process.env.SMTP_USER || '';
  const pass = configs.get('smtp_pass') || process.env.SMTP_PASS || '';
  const from = configs.get('smtp_from') || process.env.SMTP_FROM || user;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return { host, port, user, pass, from };
};

const sendResetPasswordEmail = async (email: string, code: string) => {
  const mailConfig = await getMailConfig();
  if (!mailConfig) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }

  const transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.port === 465,
    auth: {
      user: mailConfig.user,
      pass: mailConfig.pass,
    },
  });

  await transporter.sendMail({
    from: mailConfig.from,
    to: email,
    subject: '灵策智算 - 找回密码验证码',
    html: `
      <div style="font-family:Arial,'PingFang SC','Microsoft YaHei',sans-serif;padding:24px;background:#0f1117;color:#ffffff">
        <div style="max-width:560px;margin:0 auto;background:#171923;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden">
          <div style="padding:24px 24px 12px;background:linear-gradient(135deg,#FB7299,#7B5EA7,#00A1D6)">
            <div style="font-size:22px;font-weight:700;">灵策智算</div>
            <div style="margin-top:8px;font-size:14px;opacity:0.9;">找回密码验证码</div>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 16px;color:#b8b8c0;">您正在进行密码重置操作，本次验证码为：</p>
            <div style="font-size:32px;font-weight:700;letter-spacing:8px;color:#ffffff;margin:12px 0 20px;">${code}</div>
            <p style="margin:0 0 12px;color:#b8b8c0;">验证码 ${RESET_CODE_TTL_MINUTES} 分钟内有效，仅可使用一次。</p>
            <p style="margin:0;color:#6e6e7a;">如果不是您本人操作，请忽略此邮件。</p>
          </div>
        </div>
      </div>
    `,
  });
};

// auth middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ code: 401, message: 'Unauthorized' });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ code: 401, message: 'Invalid token' });
  }
};

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, nickname } = req.body;
    if (!email || !password) {
      res.json({ code: 400, message: 'Email and password are required' });
      return;
    }

    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
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

    const user = { id: result.insertId, email, username: displayName, avatar_url: '' };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      code: 200,
      message: 'Registration successful',
      data: { token, user }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.json({ code: 400, message: 'Email and password are required' });
      return;
    }

    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
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
      username: userRecord.nickname,
      avatar_url: userRecord.avatar,
      role: userRecord.role,
    };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      code: 200,
      message: 'Login successful',
      data: { token, user }
    });
  } catch (error) {
    console.error('Login error:', error);
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
      `SELECT id, created_at
       FROM verification_codes
       WHERE email = ? AND type = 'reset_password'
       ORDER BY id DESC
       LIMIT 1`,
      [email]
    );

    if (recentRows.length > 0) {
      const createdAt = new Date(recentRows[0].created_at).getTime();
      const seconds = Math.floor((Date.now() - createdAt) / 1000);
      if (seconds < RESET_CODE_RESEND_SECONDS) {
        res.json({ code: 429, message: `Please wait ${RESET_CODE_RESEND_SECONDS - seconds}s before requesting again` });
        return;
      }
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + RESET_CODE_TTL_MINUTES * 60 * 1000);
    const ip = getClientIp(req);

    await pool.query(
      `UPDATE verification_codes
       SET used = 1
       WHERE email = ? AND type = 'reset_password' AND used = 0`,
      [email]
    );

    await pool.query(
      `INSERT INTO verification_codes (email, code, type, used, ip, expires_at)
       VALUES (?, ?, 'reset_password', 0, ?, ?)`,
      [email, code, ip, expiresAt]
    );

    await sendResetPasswordEmail(email, code);

    res.json({ code: 200, message: 'Verification code sent' });
  } catch (error: any) {
    console.error('Send reset code error:', error);
    if (error?.message === 'SMTP_NOT_CONFIGURED') {
      res.json({ code: 503, message: 'SMTP service is not configured yet' });
      return;
    }
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

    const [userRows]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (userRows.length === 0) {
      res.json({ code: 400, message: 'User not found' });
      return;
    }

    const [codeRows]: any = await pool.query(
      `SELECT id, expires_at
       FROM verification_codes
       WHERE email = ? AND code = ? AND type = 'reset_password' AND used = 0
       ORDER BY id DESC
       LIMIT 1`,
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

    res.json({ code: 200, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.get('/profile', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const [rows]: any = await pool.query(
      'SELECT id, nickname AS username, email, avatar AS avatar_url, role FROM users WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ code: 404, message: 'User not found' });
      return;
    }
    res.json({ code: 200, data: rows[0] });
  } catch (error) {
    res.json({ code: 500, message: 'Server error' });
  }
});

export default router;
