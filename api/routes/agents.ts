import { Router, type Request, type Response } from 'express';
import pool from '../db.js';
import { authMiddleware } from './auth.js';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      `SELECT id, name, icon, dept, description, tags, skills, model, temperature, top_p, price_range
       FROM ai_agents WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC`
    );
    res.json({ code: 200, data: rows });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

router.get('/recommended', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const [answers]: any = await pool.query(
      'SELECT industry, use_case, language, style FROM onboarding_answers WHERE user_id = ?',
      [userId]
    );

    const [allAgents]: any = await pool.query(
      `SELECT id, name, icon, dept, description, tags, skills, model, temperature, top_p, price_range
       FROM ai_agents WHERE is_active = 1 ORDER BY is_recommended DESC, sort_order ASC LIMIT 20`
    );

    if (allAgents.length === 0) {
      res.json({ code: 200, data: [] });
      return;
    }

    const userPrefs = answers.length > 0 ? answers[0] : {};
    const scored = allAgents.map((agent: any) => {
      let score = agent.is_recommended ? 3 : 0;
      const tags: string[] = agent.tags || [];

      if (userPrefs.industry && tags.some((t: string) => t.includes(userPrefs.industry))) score += 2;
      if (userPrefs.use_case && tags.some((t: string) => t.includes(userPrefs.use_case))) score += 1;
      if (userPrefs.language && tags.some((t: string) => t.includes(userPrefs.language))) score += 1;

      const reasons: string[] = [];
      if (agent.is_recommended) reasons.push('编辑推荐');
      if (userPrefs.industry && tags.some((t: string) => t.includes(userPrefs.industry))) reasons.push(`匹配${userPrefs.industry}行业`);
      if (!reasons.length) reasons.push('热门选择');

      return { ...agent, score, reasons };
    });

    scored.sort((a: any, b: any) => b.score - a.score);

    if (userId) {
      for (const agent of scored.slice(0, 3)) {
        await pool.query(
          'INSERT INTO recommendation_feedback (user_id, agent_id, action) VALUES (?, ?, ?)',
          [userId, agent.id, 'shown']
        );
      }
    }

    res.json({ code: 200, data: scored.slice(0, 3) });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      `SELECT id, name, icon, dept, description, tags, skills, model, max_tokens, temperature, top_p, price_range
       FROM ai_agents WHERE id = ? AND is_active = 1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      res.json({ code: 404, message: 'Agent not found' });
      return;
    }
    res.json({ code: 200, data: rows[0] });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

router.post('/recommendation/feedback', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { agent_id: agentId, action, score, session_id: sessionId } = req.body;

    if (!agentId || !action) {
      res.json({ code: 400, message: 'agent_id and action are required' });
      return;
    }

    await pool.query(
      'INSERT INTO recommendation_feedback (user_id, agent_id, action, score, session_id) VALUES (?, ?, ?, ?, ?)',
      [userId, agentId, action, score ?? null, sessionId ?? null]
    );

    res.json({ code: 200, message: 'Feedback recorded' });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

export default router;
