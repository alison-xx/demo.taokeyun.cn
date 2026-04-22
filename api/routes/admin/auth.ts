import { Router, type Request, type Response } from 'express';
import { adminAuthMiddleware } from '../../middleware/adminAuth.js';
import { adminLogin } from '../../middleware/adminAuth.js';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) { res.json({ code: 400, message: 'Username and password are required' }); return; }
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const ua = req.headers['user-agent'] || '';
  const result = await adminLogin(username, password, String(ip).split(',')[0].trim(), ua);
  res.json(result);
});

router.get('/me', adminAuthMiddleware, async (req: Request, res: Response): Promise<void> => {
  const admin = (req as any).admin;
  res.json({ code: 200, data: { id: admin.id, username: admin.username, email: admin.email, role: admin.role } });
});

export default router;
