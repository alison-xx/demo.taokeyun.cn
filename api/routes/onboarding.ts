import { Router, type Request, type Response } from 'express';
import pool from '../db.js';
import { authMiddleware } from './auth.js';

const router = Router();

const GUIDE_STEPS = [
  {
    step: 1,
    title: '选择你的 AI 员工',
    description: '从上方列表中选择一位专属 AI 员工，每个员工都有不同的专业领域和能力',
    target: '[data-guide="agent-list"]',
  },
  {
    step: 2,
    title: '开始对话',
    description: '在下方输入框输入你的问题或需求，AI 员工会即时为你解答',
    target: '[data-guide="chat-input"]',
  },
  {
    step: 3,
    title: '收藏你喜欢的内容',
    description: '点击消息右侧的收藏按钮，方便日后回顾',
    target: '[data-guide="chat-actions"]',
  },
  {
    step: 4,
    title: '探索更多 AI 员工',
    description: '不同的 AI 员工擅长不同领域，点击顶部「选择AI员工」自由切换',
    target: '[data-guide="agent-selector"]',
  },
];

router.get('/status', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const [rows]: any = await pool.query('SELECT onboarded FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      res.json({ code: 404, message: 'User not found' });
      return;
    }
    res.json({ code: 200, data: { onboarded: !!rows[0].onboarded } });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

router.get('/guide-steps', authMiddleware, (_req: Request, res: Response) => {
  res.json({ code: 200, data: GUIDE_STEPS });
});

router.post('/answers', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { industry, use_case, language, style } = req.body;

    await pool.query(
      `INSERT INTO onboarding_answers (user_id, industry, use_case, language, style)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE industry = VALUES(industry), use_case = VALUES(use_case),
       language = VALUES(language), style = VALUES(style)`,
      [userId, industry || null, use_case || null, language || null, style || null]
    );

    res.json({ code: 200, message: 'Answers saved' });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

router.post('/complete', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    await pool.query('UPDATE users SET onboarded = 1 WHERE id = ?', [userId]);
    res.json({ code: 200, message: 'Onboarding completed' });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

export default router;
