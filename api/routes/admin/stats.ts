import { Router, type Request, type Response } from 'express';
import pool from '../../db.js';
import { adminAuthMiddleware, requirePermission } from '../../middleware/adminAuth.js';

const router = Router();
router.use(adminAuthMiddleware);

router.get('/overview', requirePermission('stats:view'), async (_req: Request, res: Response): Promise<void> => {
  try {
    const [[userCount]]: any = await pool.query('SELECT COUNT(*) AS c FROM users');
    const [[sessionCount]]: any = await pool.query('SELECT COUNT(*) AS c FROM chat_sessions');
    const [[messageCount]]: any = await pool.query('SELECT COUNT(*) AS c FROM messages');
    const [[todayUser]]: any = await pool.query('SELECT COUNT(*) AS c FROM users WHERE DATE(created_at) = CURDATE()');
    const [[todayChat]]: any = await pool.query('SELECT COUNT(*) AS c FROM chat_sessions WHERE DATE(created_at) = CURDATE()');
    res.json({ code: 200, data: {
      total_users: userCount.c,
      total_sessions: sessionCount.c,
      total_messages: messageCount.c,
      today_users: todayUser.c,
      today_chats: todayChat.c,
    }});
  } catch { res.json({ code: 500, message: 'Server error' }); }
});

router.get('/trends', requirePermission('stats:view'), async (req: Request, res: Response): Promise<void> => {
  try {
    const days = Math.min(90, Number(req.query.days) || 30);
    const [daily]: any = await pool.query(`
      SELECT
        DATE(u.created_at) AS date,
        COUNT(DISTINCT u.id) AS new_users,
        COUNT(DISTINCT cs.id) AS new_sessions,
        COUNT(m.id) AS messages
      FROM users u
      LEFT JOIN chat_sessions cs ON DATE(cs.created_at) = DATE(u.created_at)
      LEFT JOIN messages m ON DATE(m.created_at) = DATE(u.created_at)
      WHERE u.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(u.created_at)
      ORDER BY date ASC`, [days]);
    res.json({ code: 200, data: daily });
  } catch { res.json({ code: 500, message: 'Server error' }); }
});

router.get('/agents', requirePermission('stats:view'), async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(`
      SELECT a.id, a.name, a.icon, COUNT(DISTINCT cs.id) AS sessions, COUNT(m.id) AS messages
      FROM ai_agents a
      LEFT JOIN chat_sessions cs ON cs.employee_id = a.id
      LEFT JOIN messages m ON m.session_id = cs.id
      GROUP BY a.id
      ORDER BY messages DESC
      LIMIT 20`);
    res.json({ code: 200, data: rows });
  } catch { res.json({ code: 500, message: 'Server error' }); }
});

router.get('/realtime', requirePermission('stats:realtime'), async (_req: Request, res: Response): Promise<void> => {
  try {
    const [[activeUsers]]: any = await pool.query(
      'SELECT COUNT(DISTINCT user_id) AS c FROM refresh_tokens WHERE revoked = 0 AND expires_at > NOW()'
    );
    const [[todayMsg]]: any = await pool.query(
      'SELECT COUNT(*) AS c FROM messages WHERE DATE(created_at) = CURDATE()'
    );
    res.json({ code: 200, data: { online_users: activeUsers.c, today_messages: todayMsg.c } });
  } catch { res.json({ code: 500, message: 'Server error' }); }
});

export default router;
