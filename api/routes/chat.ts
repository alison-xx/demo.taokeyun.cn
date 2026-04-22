import { Router, type Request, type Response } from 'express';
import { authMiddleware } from './auth.js';
import pool from '../db.js';
import axios from 'axios';

const router = Router();

// Middleware to ensure user is authenticated
router.use(authMiddleware);

/**
 * Get all sessions for the current user
 */
router.get('/sessions', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(50, Math.max(10, Number(req.query.page_size) || 20));
    const offset = (page - 1) * pageSize;

    const [rows]: any = await pool.query(
      'SELECT id, employee_id, employee_name, title, collaboration_mode, selected_employees, message_count, updated_at FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?',
      [userId, pageSize, offset]
    );

    const [countRows]: any = await pool.query('SELECT COUNT(*) as total FROM chat_sessions WHERE user_id = ?', [userId]);
    const total = countRows[0].total;

    res.json({
      code: 200,
      data: {
        list: rows,
        total,
        page,
        pageSize
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ code: 500, message: 'Server error' });
  }
});

/**
 * Create a new session
 */
router.post('/session/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { employee_id, employee_name, collaboration_mode, selected_employees } = req.body;

    const [result]: any = await pool.query(
      'INSERT INTO chat_sessions (user_id, employee_id, employee_name, collaboration_mode, selected_employees, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [
        userId, 
        employee_id || '', 
        employee_name || '', 
        collaboration_mode ? 1 : 0, 
        selected_employees ? JSON.stringify(selected_employees) : null
      ]
    );

    res.json({
      code: 200,
      message: 'Session created',
      data: { session_id: result.insertId }
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ code: 500, message: 'Server error' });
  }
});

/**
 * Get messages for a specific session
 */
router.get('/messages', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const sessionId = Number(req.query.session_id);

    if (!sessionId) {
      res.json({ code: 400, message: 'Missing session_id' });
      return;
    }

    // Verify session belongs to user
    const [sessionRows]: any = await pool.query('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?', [sessionId, userId]);
    if (sessionRows.length === 0) {
      res.json({ code: 404, message: 'Session not found' });
      return;
    }

    const [messages]: any = await pool.query('SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC', [sessionId]);

    res.json({
      code: 200,
      data: {
        session: sessionRows[0],
        messages
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ code: 500, message: 'Server error' });
  }
});

/**
 * Delete a session
 */
router.post('/session/delete', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { session_id } = req.body;

    if (!session_id) {
      res.json({ code: 400, message: 'Missing session_id' });
      return;
    }

    const [result]: any = await pool.query('DELETE FROM chat_sessions WHERE id = ? AND user_id = ?', [session_id, userId]);
    
    if (result.affectedRows > 0) {
      res.json({ code: 200, message: 'Session deleted' });
    } else {
      res.json({ code: 404, message: 'Session not found or no permission' });
    }
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ code: 500, message: 'Server error' });
  }
});

/**
 * Stream send message (SSE)
 */
router.post('/stream', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;
  const { session_id, content, model = 'deepseek' } = req.body;

  if (!session_id || !content) {
    res.status(400).json({ error: 'Missing session_id or content' });
    return;
  }

  // Setup SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // For Nginx
  res.flushHeaders();

  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // 1. Verify session
    const [sessionRows]: any = await pool.query('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?', [session_id, userId]);
    if (sessionRows.length === 0) {
      sendEvent({ error: 'Session not found', done: true });
      res.end();
      return;
    }
    const session = sessionRows[0];

    // 2. Save user message
    await pool.query(
      'INSERT INTO messages (session_id, role, content, created_at) VALUES (?, ?, ?, NOW())',
      [session_id, 'user', content]
    );

    // Update title if empty
    if (!session.title) {
      const title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
      await pool.query('UPDATE chat_sessions SET title = ? WHERE id = ?', [title, session_id]);
    }
    await pool.query('UPDATE chat_sessions SET message_count = message_count + 1, updated_at = NOW() WHERE id = ?', [session_id]);

    // Handle AI Painter
    if (session.employee_id === 'ai-painter') {
      const [sfKeyRows]: any = await pool.query("SELECT config_value FROM system_configs WHERE config_key = 'siliconflow_api_key'");
      let sfApiKey = sfKeyRows.length > 0 ? sfKeyRows[0].config_value : '';
      if (!sfApiKey) sfApiKey = process.env.SILICONFLOW_API_KEY;

      if (!sfApiKey) {
        sendEvent({ error: 'Painting API Key not configured.', done: true });
        res.end();
        return;
      }

      sendEvent({ token: '正在为您绘制中，请稍候...' });

      try {
        const response = await axios.post(
          'https://api.siliconflow.cn/v1/images/generations',
          {
            model: 'stable-diffusion-xl-base-1.0',
            prompt: content,
            image_size: '1024x1024',
          },
          {
            headers: {
              'Authorization': `Bearer ${sfApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const imageUrl = response.data.images[0].url;
        const markdownImage = `\n\n![生成的图片](${imageUrl})\n\n`;

        await pool.query(
          'INSERT INTO messages (session_id, role, content, model_used, created_at) VALUES (?, ?, ?, ?, NOW())',
          [session_id, 'assistant', markdownImage, 'stable-diffusion-xl']
        );

        sendEvent({ token: markdownImage });
        sendEvent({ done: true });
      } catch (err: any) {
        console.error('Painting error:', err.response?.data || err.message);
        sendEvent({ error: '绘图失败，请稍后重试', done: true });
      }
      res.end();
      return;
    }

    // 3. Get API Key (Simplified for now, using system config)
    const [keyRows]: any = await pool.query('SELECT config_value FROM system_configs WHERE config_key = ?', [`${model}_api_key`]);
    let apiKey = keyRows.length > 0 ? keyRows[0].config_value : '';
    
    // Fallback to env if db config is empty
    if (!apiKey) {
       if (model === 'deepseek') apiKey = process.env.DEEPSEEK_API_KEY;
       if (model === 'minimax') apiKey = process.env.MINIMAX_API_KEY;
    }

    if (!apiKey) {
      sendEvent({ error: `API Key for ${model} is not configured.`, done: true });
      res.end();
      return;
    }

    const apiUrl = model === 'deepseek' 
      ? 'https://api.deepseek.com/v1/chat/completions'
      : 'https://api.minimax.chat/v1/text/chatcompletion_v2';
    
    const apiModel = model === 'deepseek' ? 'deepseek-chat' : 'abab6.5s-chat';

    // Helper to call AI
    const callAI = async (systemPrompt: string, userContent: string, prefixText = '') => {
      if (prefixText) {
        sendEvent({ token: prefixText });
      }
      
      const aiResponse = await axios({
        method: 'post',
        url: apiUrl,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        data: {
          model: apiModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
          ],
          stream: true,
          temperature: 0.7,
          max_tokens: 4096
        },
        responseType: 'stream'
      });

      return new Promise<string>((resolve, reject) => {
        let text = '';
        aiResponse.data.on('data', (chunk: Buffer) => {
          const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const payload = line.replace('data: ', '').trim();
              if (payload === '[DONE]') continue;
              try {
                const parsed = JSON.parse(payload);
                const token = parsed.choices?.[0]?.delta?.content || '';
                if (token) {
                  text += token;
                  sendEvent({ token });
                }
              } catch (e) {}
            }
          }
        });
        aiResponse.data.on('end', () => resolve(text));
        aiResponse.data.on('error', reject);
      });
    };

    let fullText = '';
    
    if (session.collaboration_mode === 1 && session.selected_employees) {
      // Group Chat
      const selectedIds = typeof session.selected_employees === 'string' ? JSON.parse(session.selected_employees) : session.selected_employees;
      
      // Fetch AI employees data (assuming we have it in frontend, backend might need a map or just basic info)
      // Since backend doesn't have the employees.ts directly, we can just use generic prompts or pass info from frontend.
      // Wait, selected_employees is just an array of IDs. We don't have their names and system prompts here.
      // Let's pass the needed info from frontend, or duplicate the employee list in backend.
      // For now, let's use a generic prompt if we don't have the specific one.
      const employeeMap: Record<string, any> = {
        'bilibili-strategist': { name: 'B站内容策略师', icon: '📺' },
        'douyin-strategist': { name: '抖音策略师', icon: '🎵' },
        'xiaohongshu-strategist': { name: '小红书策略师', icon: '📕' },
        'discovery-coach': { name: 'Discovery教练', icon: '🎯' },
        'pipeline-analyst': { name: 'Pipeline分析师', icon: '📊' },
        'ai-painter': { name: 'AI绘画师', icon: '🎨' },
        'podcast-strategist': { name: '播客内容策略师', icon: '🎙️' },
        'customer-service': { name: '客服响应者', icon: '💬' }
      };

      for (let i = 0; i < selectedIds.length; i++) {
        const empId = selectedIds[i];
        const emp = employeeMap[empId] || { name: '专家', icon: '🤖' };
        const sysPrompt = `你是一个专业的${emp.name}，请从你的专业角度来回答用户的问题。`;
        const prefix = (i > 0 ? '\n\n---\n\n' : '') + `### ${emp.icon} ${emp.name} 的回答：\n\n`;
        
        const text = await callAI(sysPrompt, content, prefix);
        fullText += prefix + text;
      }
    } else {
      // Single Chat
      const systemPrompt = `你是${session.employee_name}，一个专业的AI助手。`;
      fullText = await callAI(systemPrompt, content);
    }

    // 5. Save assistant message and extract follow-ups
    let followUps: string[] = [];
    const followUpRegex = /【追问[：:]?\d*】(.+?)(?=【|$)/gs;
    let match;
    while ((match = followUpRegex.exec(fullText)) !== null) {
        followUps.push(match[1].trim());
    }
    
    const cleanText = fullText.replace(/【追问[：:]?\d*】.+$/s, '').trim();

    if (cleanText) {
      await pool.query(
        'INSERT INTO messages (session_id, role, content, model_used, created_at) VALUES (?, ?, ?, ?, NOW())',
        [session_id, 'assistant', cleanText, apiModel]
      );
    }

    sendEvent({ done: true, follow_ups: followUps.slice(0,4) });
    res.end();

  } catch (error: any) {
    console.error('Stream chat error:', error.message || error);
    sendEvent({ error: 'Failed to communicate with AI provider', done: true });
    res.end();
  }
});

export default router;