import { type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-only-insecure-secret-do-not-use-in-prod' : '');
const JWT_ADMIN_TTL = process.env.JWT_ADMIN_TTL || '8h';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ code: 401, message: 'Unauthorized: missing admin token' });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    (req as any).admin = {
      id: decoded.sub,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      permissions: (decoded.permissions as string[]) || [],
    };
    next();
  } catch {
    res.status(401).json({ code: 401, message: 'Invalid or expired admin token' });
  }
};

export const requirePermission = (...codes: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const admin = (req as any).admin as AdminUser | undefined;
    if (!admin) {
      res.status(401).json({ code: 401, message: 'Unauthorized' });
      return;
    }
    if (admin.role === 'super_admin') { next(); return; }
    const hasAll = codes.every(code => admin.permissions.includes(code));
    if (!hasAll) {
      res.status(403).json({ code: 403, message: `Forbidden: requires [${codes.join(', ')}]` });
      return;
    }
    next();
  };
};

export const logOperation = async (
  req: Request,
  admin: AdminUser,
  action: string,
  targetType?: string,
  targetId?: string,
  beforeValue?: unknown,
  afterValue?: unknown
) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    await pool.query(
      `INSERT INTO admin_operation_logs (admin_id, admin_name, action, target_type, target_id, before_value, after_value, ip, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        admin.id,
        admin.username,
        action,
        targetType || null,
        targetId || null,
        beforeValue ? JSON.stringify(beforeValue) : null,
        afterValue ? JSON.stringify(afterValue) : null,
        typeof ip === 'string' ? ip.split(',')[0].trim() : ip,
        req.headers['user-agent'] || null,
      ]
    );
  } catch (err) {
    console.error('[AdminLog] Failed to write operation log:', err);
  }
};

export const adminLogin = async (username: string, password: string, ip: string, userAgent: string) => {
  const [rows]: any = await pool.query(
    `SELECT au.id, au.username, au.password_hash, au.email, au.status, r.name AS role
     FROM admin_users au
     JOIN admin_roles r ON r.id = au.role_id
     WHERE au.username = ?`,
    [username]
  );

  if (!rows.length) return { code: 400, message: 'User not found' };
  if (!rows[0].status) return { code: 403, message: 'Account disabled' };

  const match = await bcrypt.compare(password, rows[0].password_hash);
  if (!match) return { code: 400, message: 'Invalid password' };

  const [permRows]: any = await pool.query(
    `SELECT p.code FROM admin_permissions p
     JOIN admin_role_permissions rp ON rp.perm_id = p.id
     WHERE rp.role_id = ?`,
    [rows[0].id]
  );
  const permissions = permRows.map((r: any) => r.code);

  await pool.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [rows[0].id]);

  const token = jwt.sign(
    { sub: rows[0].id, username: rows[0].username, email: rows[0].email, role: rows[0].role, permissions },
    JWT_SECRET,
    { expiresIn: JWT_ADMIN_TTL } as jwt.SignOptions
  );

  return {
    code: 200,
    data: { token, admin: { id: rows[0].id, username: rows[0].username, email: rows[0].email, role: rows[0].role } },
  };
};
