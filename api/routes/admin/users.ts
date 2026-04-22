import { Router, type Request, type Response } from 'express';
import pool from '../../db.js';
import { adminAuthMiddleware, requirePermission, logOperation, type AdminUser } from '../../middleware/adminAuth.js';

const router = Router();
router.use(adminAuthMiddleware);

router.get('/users', requirePermission('user:view'), async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(10, Number(req.query.pageSize) || 20));
    const offset = (page - 1) * pageSize;
    const keyword = String(req.query.keyword || '').trim();
    const status = req.query.status;

    let where = 'WHERE 1=1';
    const params: any[] = [];
    if (keyword) { where += ' AND (u.email LIKE ? OR u.nickname LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
    if (status !== undefined && status !== '' && status !== null) { where += ' AND u.status = ?'; params.push(Number(status)); }

    const [rows]: any = await pool.query(
      `SELECT u.id, u.nickname, u.email, u.role, u.status, u.onboarded, u.created_at, u.last_login_at,
              q.chat_limit, q.used_chats, q.paint_limit, q.used_paints, q.quota_reset_at
       FROM users u
       LEFT JOIN user_quotas q ON q.user_id = u.id
       ${where}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const [[{ total }]]: any = await pool.query(
      `SELECT COUNT(*) AS total FROM users u ${where}`, params
    );

    res.json({ code: 200, data: { list: rows, total, page, pageSize } });
  } catch (err) {
    console.error(err);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.put('/users/:id', requirePermission('user:edit', 'user:quota'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const admin = (req as any).admin as AdminUser;
    const { status, role, chat_limit, paint_limit } = req.body;

    const [before]: any = await pool.query('SELECT status, role FROM users WHERE id = ?', [userId]);
    if (!before.length) { res.json({ code: 404, message: 'User not found' }); return; }

    const updates: string[] = []; const vals: any[] = [];
    if (status !== undefined) { updates.push('status = ?'); vals.push(status); }
    if (role !== undefined) { updates.push('role = ?'); vals.push(role); }
    if (!updates.length) { res.json({ code: 400, message: 'No fields to update' }); return; }
    vals.push(userId);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, vals);

    if (chat_limit !== undefined || paint_limit !== undefined) {
      const [qBefore]: any = await pool.query('SELECT chat_limit, paint_limit FROM user_quotas WHERE user_id = ?', [userId]);
      const qUpdates: string[] = []; const qVals: any[] = [];
      if (chat_limit !== undefined) { qUpdates.push('chat_limit = ?'); qVals.push(chat_limit); }
      if (paint_limit !== undefined) { qUpdates.push('paint_limit = ?'); qVals.push(paint_limit); }
      if (qUpdates.length) { qVals.push(userId); await pool.query(`UPDATE user_quotas SET ${qUpdates.join(', ')} WHERE user_id = ?`, qVals); }
    }

    await logOperation(req, admin, `user:edit:${Object.keys(req.body).join(',')}`, 'users', userId, before[0], req.body);
    res.json({ code: 200, message: 'User updated' });
  } catch (err) {
    console.error(err);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.delete('/users/:id', requirePermission('user:delete'), async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = (req as any).admin as AdminUser;
    const userId = req.params.id;
    const [before]: any = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (!before.length) { res.json({ code: 404, message: 'User not found' }); return; }
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    await logOperation(req, admin, 'user:delete', 'users', userId, before[0], null);
    res.json({ code: 200, message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.get('/users/:id/logs', requirePermission('audit:view'), async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(10, Number(req.query.pageSize) || 20));
    const offset = (page - 1) * pageSize;
    const [rows]: any = await pool.query(
      `SELECT * FROM admin_operation_logs WHERE target_type = 'users' AND target_id = ?
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [req.params.id, pageSize, offset]
    );
    res.json({ code: 200, data: rows });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

export default router;
