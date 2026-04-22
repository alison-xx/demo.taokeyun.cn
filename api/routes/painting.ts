import { Router, type Request, type Response } from 'express';
import { authMiddleware } from './auth.js';
import pool from '../db.js';
import axios from 'axios';

const router = Router();

router.use(authMiddleware);

router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { prompt, size = '1024x1024', style = '' } = req.body;

    if (!prompt) {
      res.json({ code: 400, message: 'Missing prompt' });
      return;
    }

    // 1. Get API Key
    const [keyRows]: any = await pool.query("SELECT config_value FROM system_configs WHERE config_key = 'siliconflow_api_key'");
    let apiKey = keyRows.length > 0 ? keyRows[0].config_value : '';
    if (!apiKey) apiKey = process.env.SILICONFLOW_API_KEY;

    if (!apiKey) {
      res.json({ code: 500, message: 'Painting API Key not configured' });
      return;
    }

    const startTime = Date.now();
    const finalPrompt = style ? `${prompt}, ${style}` : prompt;

    // 2. Call SiliconFlow API
    const response = await axios.post(
      'https://api.siliconflow.cn/v1/images/generations',
      {
        model: 'stable-diffusion-xl-base-1.0',
        prompt: finalPrompt,
        image_size: size,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const imageUrl = response.data.images[0].url;
    const generationTime = Date.now() - startTime;

    // 3. Save to DB
    await pool.query(
      'INSERT INTO paintings (user_id, prompt, style, size, image_url, generation_time_ms, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, prompt, style, size, imageUrl, generationTime]
    );

    res.json({
      code: 200,
      data: {
        image_url: imageUrl,
        generation_time: generationTime
      }
    });

  } catch (error: any) {
    console.error('Generate painting error:', error.response?.data || error.message);
    res.json({ code: 500, message: 'Painting generation failed' });
  }
});

export default router;