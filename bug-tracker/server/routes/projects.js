/**
 * routes/projects.js – REST endpoints for projects
 */
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db      = require('../db');

const router = express.Router();

/* ── GET /api/projects ──────────────────────────────────────── */
router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM projects ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/* ── GET /api/projects/:id ──────────────────────────────────── */
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/* ── POST /api/projects ─────────────────────────────────────── */
router.post('/', async (req, res, next) => {
  try {
    const { name, description, color = '#4361ee' } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const id = uuidv4();
    await db.execute(
      'INSERT INTO projects (id, name, description, color) VALUES (?, ?, ?, ?)',
      [id, name, description || null, color]
    );

    const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/* ── PUT /api/projects/:id ──────────────────────────────────── */
router.put('/:id', async (req, res, next) => {
  try {
    const [existing] = await db.execute('SELECT id FROM projects WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Project not found' });

    const { name, description, color } = req.body;
    const fields = [];
    const params = [];

    if (name        !== undefined) { fields.push('name = ?');        params.push(name); }
    if (description !== undefined) { fields.push('description = ?'); params.push(description || null); }
    if (color       !== undefined) { fields.push('color = ?');       params.push(color); }

    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

    params.push(req.params.id);
    await db.execute(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, params);

    const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/* ── DELETE /api/projects/:id ───────────────────────────────── */
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await db.execute('DELETE FROM projects WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Project not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
