import { Router, type Request, type Response } from 'express';
import pool from '../../db.js';
import { adminAuthMiddleware, requirePermission, logOperation } from '../../middleware/adminAuth.js';

const router = Router();
router.use(adminAuthMiddleware);

router.get('/logs', requirePermission('audit:view'), async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(10, Number(req.query.pageSize) || 20));
    const offset = (page - 1) * pageSize;
    const action = req.query.action;
    let where = 'WHERE 1=1'; const params: any[] = [];
    if (action) { where += ' AND action LIKE ?'; params.push(`%${action}%`); }
    const [rows]: any = await pool.query(
      `SELECT * FROM admin_operation_logs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, pageSize, offset]
    );
    const [[{ total }]]: any = await pool.query(`SELECT COUNT(*) AS total FROM admin_operation_logs ${where}`, params);
    res.json({ code: 200, data: { list: rows, total, page, pageSize } });
  } catch { res.json({ code: 500, message: 'Server error' }); }
});

router.get('/announcements', requirePermission('announcement:manage'), async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, title, type, is_popup, is_active, published_at, created_at FROM announcements ORDER BY created_at DESC'
    );
    res.json({ code: 200, data: rows });
  } catch { res.json({ code: 500, message: 'Server error' }); }
});

router.post('/announcements', requirePermission('announcement:manage'), async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = (req as any).admin;
    const { title, content_md, content_html, type, is_popup, is_active } = req.body;
    if (!title) { res.json({ code: 400, message: 'title is required' }); return; }
    await pool.query(
      `INSERT INTO announcements (title, content_md, content_html, type, is_popup, is_active, published_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?, IF(?, NOW(), NULL), ?)`,
      [title, content_md || '', content_html || '', type || 'notice', is_popup ? 1 : 0, is_active ? 1 : 0, is_active, admin.id]
    );
    await logOperation(req, admin, 'announcement:create', 'announcements', String(Date.now()), null, req.body);
    res.json({ code: 200, message: 'Announcement created' });
  } catch { res.json({ code: 500, message: 'Server error' }); }
});

router.put('/announcements/:id', requirePermission('announcement:manage'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content_md, content_html, type, is_popup, is_active } = req.body;
    const updates: string[] = []; const vals: any[] = [];
    if (title !== undefined) { updates.push('title = ?'); vals.push(title); }
    if (content_md !== undefined) { updates.push('content_md = ?'); vals.push(content_md); }
    if (content_html !== undefined) { updates.push('content_html = ?'); vals.push(content_html); }
    if (type !== undefined) { updates.push('type = ?'); vals.push(type); }
    if (is_popup !== undefined) { updates.push('is_popup = ?'); vals.push(is_popup ? 1 : 0); }
    if (is_active !== undefined) { updates.push('is_active = ?'); vals.push(is_active ? 1 : 0); }
    if (!updates.length) { res.json({ code: 400, message: 'No fields to update' }); return; }
    vals.push(req.params.id);
    await pool.query(`UPDATE announcements SET ${updates.join(', ')} WHERE id = ?`, vals);
    res.json({ code: 200, message: 'Announcement updated' });
  } catch { res.json({ code: 500, message: 'Server error' }); }
});

router.get('/sensitive-words', requirePermission('sensitive:manage'), async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query('SELECT id, word, level, replace_to, is_active, created_at FROM sensitive_words ORDER BY created_at DESC');
    res.json({ code: 200, data: rows });
  } catch { res.json({ code: 500, message: 'Server error' }); }
});

router.post('/sensitive-words', requirePermission('sensitive:manage'), async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = (req as any).admin;
    const { word, level, replace_to } = req.body;
    if (!word) { res.json({ code: 400, message: 'word is required' }); return; }
    await pool.query('INSERT INTO sensitive_words (word, level, replace_to, created_by) VALUES (?, ?, ?, ?)', [word, level || 'normal', replace_to || '*', admin.id]);
    await logOperation(req, admin, 'sensitive:add', 'sensitive_words', word, null, req.body);
    res.json({ code: 200, message: 'Sensitive word added' });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') { res.json({ code: 400, message: 'Word already exists' }); return; }
    res.json({ code: 500, message: 'Server error' });
  }
});

router.delete('/sensitive-words/:id', requirePermission('sensitive:manage'), async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = (req as any).admin;
    await pool.query('DELETE FROM sensitive_words WHERE id = ?', [req.params.id]);
    await logOperation(req, admin, 'sensitive:delete', 'sensitive_words', req.params.id, null, null);
    res.json({ code: 200, message: 'Sensitive word deleted' });
  } catch { res.json({ code: 500, message: 'Server error' }); }
});

router.post('/sensitive-words/rebuild-cache', requirePermission('sensitive:manage'), async (_req: Request, res: Response): Promise<void> => {
  res.json({ code: 200, message: 'Sensitive word cache rebuilt (Redis update simulated)' });
});

router.get('/moderation/queue', requirePermission('moderation:view'), async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status || 'pending';
    const [rows]: any = await pool.query(
      `SELECT q.*, u.email AS user_email, cs.title AS session_title
       FROM content_moderation_queue q
       JOIN users u ON u.id = q.user_id
       LEFT JOIN chat_sessions cs ON cs.id = q.session_id
       WHERE q.status = ?
       ORDER BY q.created_at DESC LIMIT 50`, [status]
    );
    res.json({ code: 200, data: rows });
  } catch { res.json({ code: 500, message: 'Server error' }); }
});

router.post('/moderation/batch', requirePermission('moderation:action'), async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = (req as any).admin;
    const { ids, action } = req.body;
    if (!ids || !Array.isArray(ids) || !action) { res.json({ code: 400, message: 'ids and action are required' }); return; }
    if (!['approved', 'rejected', 'ignored'].includes(action)) { res.json({ code: 400, message: 'Invalid action' }); return; }
    await pool.query(
      `UPDATE content_moderation_queue SET status = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id IN (${ids.map(() => '?').join(',')})`,
      [action, admin.id, ...ids]
    );
    await logOperation(req, admin, `moderation:${action}`, 'content_moderation_queue', ids.join(','), null, { action, count: ids.length });
    res.json({ code: 200, message: `Batch ${action} done` });
  } catch { res.json({ code: 500, message: 'Server error' }); }
});

export default router;
