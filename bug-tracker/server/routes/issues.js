/**
 * routes/issues.js – REST endpoints for issues
 */
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db      = require('../db');

const router = express.Router();

/* ── GET /api/issues ────────────────────────────────────────── */
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, project_id } = req.query;
    let sql = 'SELECT * FROM issues WHERE 1=1';
    const params = [];

    if (status)     { sql += ' AND status = ?';     params.push(status); }
    if (priority)   { sql += ' AND priority = ?';   params.push(priority); }
    if (project_id) { sql += ' AND project_id = ?'; params.push(project_id); }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await db.execute(sql, params);
    rows.forEach(r => { r.tags = r.tags ? JSON.parse(r.tags) : []; });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/* ── GET /api/issues/:id ────────────────────────────────────── */
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM issues WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Issue not found' });
    const issue = rows[0];
    issue.tags = issue.tags ? JSON.parse(issue.tags) : [];
    res.json(issue);
  } catch (err) {
    next(err);
  }
});

/* ── POST /api/issues ───────────────────────────────────────── */
router.post('/', async (req, res, next) => {
  try {
    const { title, description, status = 'backlog', priority = 'medium',
            type = 'bug', project_id, assignee_id, tags = [] } = req.body;

    if (!title) return res.status(400).json({ error: 'title is required' });

    const id = uuidv4();
    await db.execute(
      `INSERT INTO issues (id, title, description, status, priority, type, project_id, assignee_id, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description || null, status, priority, type,
       project_id || null, assignee_id || null, JSON.stringify(tags)]
    );

    const [rows] = await db.execute('SELECT * FROM issues WHERE id = ?', [id]);
    const issue  = rows[0];
    issue.tags   = JSON.parse(issue.tags);
    res.status(201).json(issue);
  } catch (err) {
    next(err);
  }
});

/* ── PUT /api/issues/:id ────────────────────────────────────── */
router.put('/:id', async (req, res, next) => {
  try {
    const [existing] = await db.execute('SELECT id FROM issues WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Issue not found' });

    const { title, description, status, priority, type,
            project_id, assignee_id, tags } = req.body;

    const fields = [];
    const params = [];

    if (title       !== undefined) { fields.push('title = ?');       params.push(title); }
    if (description !== undefined) { fields.push('description = ?'); params.push(description); }
    if (status      !== undefined) { fields.push('status = ?');      params.push(status); }
    if (priority    !== undefined) { fields.push('priority = ?');    params.push(priority); }
    if (type        !== undefined) { fields.push('type = ?');        params.push(type); }
    if (project_id  !== undefined) { fields.push('project_id = ?'); params.push(project_id || null); }
    if (assignee_id !== undefined) { fields.push('assignee_id = ?'); params.push(assignee_id || null); }
    if (tags        !== undefined) { fields.push('tags = ?');        params.push(JSON.stringify(tags)); }

    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

    params.push(req.params.id);
    await db.execute(`UPDATE issues SET ${fields.join(', ')} WHERE id = ?`, params);

    const [rows] = await db.execute('SELECT * FROM issues WHERE id = ?', [req.params.id]);
    const issue  = rows[0];
    issue.tags   = issue.tags ? JSON.parse(issue.tags) : [];
    res.json(issue);
  } catch (err) {
    next(err);
  }
});

/* ── DELETE /api/issues/:id ─────────────────────────────────── */
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await db.execute('DELETE FROM issues WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Issue not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
