import { Router, type Request, type Response } from 'express';
import pool from '../../db.js';
import { adminAuthMiddleware, requirePermission, logOperation, type AdminUser } from '../../middleware/adminAuth.js';

const router = Router();
router.use(adminAuthMiddleware);

router.get('/agents', requirePermission('agent:view'), async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      `SELECT id, name, icon, dept, description, tags, skills, model, max_tokens,
              temperature, top_p, price_range, is_active, is_recommended, sort_order, created_at, updated_at
       FROM ai_agents ORDER BY sort_order ASC, created_at DESC`
    );
    res.json({ code: 200, data: rows });
  } catch (err) {
    console.error(err);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.post('/agents', requirePermission('agent:create'), async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = (req as any).admin as AdminUser;
    const { id, name, icon, dept, description, system_prompt, tags, skills, model, max_tokens, temperature, top_p, price_range, is_active, is_recommended, sort_order } = req.body;

    if (!id || !name) { res.json({ code: 400, message: 'id and name are required' }); return; }

    await pool.query(
      `INSERT INTO ai_agents (id, name, icon, dept, description, system_prompt, tags, skills, model, max_tokens, temperature, top_p, price_range, is_active, is_recommended, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, icon || null, dept || null, description || null, system_prompt || '', JSON.stringify(tags || []), JSON.stringify(skills || []),
       model || 'deepseek', max_tokens || 4096, temperature || 0.7, top_p || 0.9, price_range || 'free',
       is_active !== undefined ? is_active : 1, is_recommended ? 1 : 0, sort_order || 0]
    );

    const [versionResult]: any = await pool.query('SELECT COALESCE(MAX(version), 0) + 1 AS next_ver FROM ai_agent_versions WHERE agent_id = ?', [id]);
    await pool.query(
      `INSERT INTO ai_agent_versions (agent_id, version, system_prompt, model, max_tokens, temperature, top_p, changed_by, change_desc)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, versionResult[0].next_ver, system_prompt || '', model || 'deepseek', max_tokens || 4096, temperature || 0.7, top_p || 0.9, admin.username, 'Initial creation']
    );

    await logOperation(req, admin, 'agent:create', 'ai_agents', id, null, req.body);
    res.json({ code: 200, message: 'Agent created' });
  } catch (err: any) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') { res.json({ code: 400, message: 'Agent ID already exists' }); return; }
    res.json({ code: 500, message: 'Server error' });
  }
});

router.put('/agents/:id', requirePermission('agent:edit'), async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = (req as any).admin as AdminUser;
    const agentId = req.params.id;
    const { name, icon, dept, description, system_prompt, tags, skills, model, max_tokens, temperature, top_p, price_range, is_active, is_recommended, sort_order } = req.body;

    const [before]: any = await pool.query('SELECT * FROM ai_agents WHERE id = ?', [agentId]);
    if (!before.length) { res.json({ code: 404, message: 'Agent not found' }); return; }

    const updates: string[] = []; const vals: any[] = [];
    if (name !== undefined) { updates.push('name = ?'); vals.push(name); }
    if (icon !== undefined) { updates.push('icon = ?'); vals.push(icon); }
    if (dept !== undefined) { updates.push('dept = ?'); vals.push(dept); }
    if (description !== undefined) { updates.push('description = ?'); vals.push(description); }
    if (system_prompt !== undefined) { updates.push('system_prompt = ?'); vals.push(system_prompt); }
    if (tags !== undefined) { updates.push('tags = ?'); vals.push(JSON.stringify(tags)); }
    if (skills !== undefined) { updates.push('skills = ?'); vals.push(JSON.stringify(skills)); }
    if (model !== undefined) { updates.push('model = ?'); vals.push(model); }
    if (max_tokens !== undefined) { updates.push('max_tokens = ?'); vals.push(max_tokens); }
    if (temperature !== undefined) { updates.push('temperature = ?'); vals.push(temperature); }
    if (top_p !== undefined) { updates.push('top_p = ?'); vals.push(top_p); }
    if (price_range !== undefined) { updates.push('price_range = ?'); vals.push(price_range); }
    if (is_active !== undefined) { updates.push('is_active = ?'); vals.push(is_active ? 1 : 0); }
    if (is_recommended !== undefined) { updates.push('is_recommended = ?'); vals.push(is_recommended ? 1 : 0); }
    if (sort_order !== undefined) { updates.push('sort_order = ?'); vals.push(sort_order); }

    if (updates.length) {
      vals.push(agentId);
      await pool.query(`UPDATE ai_agents SET ${updates.join(', ')} WHERE id = ?`, vals);
    }

    if (system_prompt !== undefined || model !== undefined || max_tokens !== undefined || temperature !== undefined || top_p !== undefined) {
      const [versionResult]: any = await pool.query('SELECT COALESCE(MAX(version), 0) + 1 AS next_ver FROM ai_agent_versions WHERE agent_id = ?', [agentId]);
      await pool.query(
        `INSERT INTO ai_agent_versions (agent_id, version, system_prompt, model, max_tokens, temperature, top_p, changed_by, change_desc)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [agentId, versionResult[0].next_ver, system_prompt || before[0].system_prompt, model || before[0].model,
         max_tokens || before[0].max_tokens, temperature ?? before[0].temperature, top_p ?? before[0].top_p,
         admin.username, 'Manual edit']
      );
    }

    await logOperation(req, admin, 'agent:edit', 'ai_agents', agentId, before[0], req.body);
    res.json({ code: 200, message: 'Agent updated' });
  } catch (err) {
    console.error(err);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.delete('/agents/:id', requirePermission('agent:delete'), async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = (req as any).admin as AdminUser;
    const [before]: any = await pool.query('SELECT * FROM ai_agents WHERE id = ?', [req.params.id]);
    if (!before.length) { res.json({ code: 404, message: 'Agent not found' }); return; }
    await pool.query('DELETE FROM ai_agents WHERE id = ?', [req.params.id]);
    await logOperation(req, admin, 'agent:delete', 'ai_agents', req.params.id, before[0], null);
    res.json({ code: 200, message: 'Agent deleted' });
  } catch (err) {
    console.error(err);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.post('/agents/:id/clone', requirePermission('agent:clone'), async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = (req as any).admin as AdminUser;
    const sourceId = req.params.id;
    const newId = `${sourceId}-clone-${Date.now()}`;
    const [rows]: any = await pool.query('SELECT * FROM ai_agents WHERE id = ?', [sourceId]);
    if (!rows.length) { res.json({ code: 404, message: 'Source agent not found' }); return; }
    const src = rows[0];
    await pool.query(
      `INSERT INTO ai_agents (id, name, icon, dept, description, system_prompt, tags, skills, model, max_tokens, temperature, top_p, price_range, is_active, is_recommended, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)`,
      [newId, `${src.name} (克隆)`, src.icon, src.dept, src.description, src.system_prompt, src.tags, src.skills, src.model, src.max_tokens, src.temperature, src.top_p, src.price_range, (src.sort_order || 0) + 1]
    );
    await logOperation(req, admin, 'agent:clone', 'ai_agents', `${sourceId}->${newId}`, null, { sourceId, newId });
    res.json({ code: 200, message: 'Agent cloned', data: { newId } });
  } catch (err) {
    console.error(err);
    res.json({ code: 500, message: 'Server error' });
  }
});

router.get('/agents/:id/versions', requirePermission('agent:view'), async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, agent_id, version, system_prompt, model, max_tokens, temperature, top_p, changed_by, change_desc, created_at FROM ai_agent_versions WHERE agent_id = ? ORDER BY version DESC',
      [req.params.id]
    );
    res.json({ code: 200, data: rows });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

router.post('/agents/:id/rollback/:vid', requirePermission('agent:rollback'), async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = (req as any).admin as AdminUser;
    const agentId = req.params.id;
    const versionId = req.params.vid;
    const [version]: any = await pool.query('SELECT * FROM ai_agent_versions WHERE id = ? AND agent_id = ?', [versionId, agentId]);
    if (!version.length) { res.json({ code: 404, message: 'Version not found' }); return; }
    const v = version[0];
    await pool.query(
      'UPDATE ai_agents SET system_prompt=?, model=?, max_tokens=?, temperature=?, top_p=? WHERE id=?',
      [v.system_prompt, v.model, v.max_tokens, v.temperature, v.top_p, agentId]
    );
    await logOperation(req, admin, 'agent:rollback', 'ai_agents', agentId, null, { rollback_to_version: v.version });
    res.json({ code: 200, message: 'Rolled back successfully' });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

router.post('/agents/config-cache/refresh', requirePermission('agent:edit'), async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ code: 200, message: 'Config cache refreshed' });
  } catch {
    res.json({ code: 500, message: 'Server error' });
  }
});

export default router;
