/**
 * routes/people.js – REST endpoints for people
 */
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db      = require('../db');

const router = express.Router();

/* ── GET /api/people ────────────────────────────────────────── */
router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM people ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/* ── GET /api/people/:id ────────────────────────────────────── */
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM people WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Person not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/* ── POST /api/people ───────────────────────────────────────── */
router.post('/', async (req, res, next) => {
  try {
    const { name, email, role, avatar } = req.body;
    if (!name)  return res.status(400).json({ error: 'name is required' });
    if (!email) return res.status(400).json({ error: 'email is required' });

    const id = uuidv4();
    await db.execute(
      'INSERT INTO people (id, name, email, role, avatar) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, role || null, avatar || null]
    );

    const [rows] = await db.execute('SELECT * FROM people WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    next(err);
  }
});

/* ── PUT /api/people/:id ────────────────────────────────────── */
router.put('/:id', async (req, res, next) => {
  try {
    const [existing] = await db.execute('SELECT id FROM people WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Person not found' });

    const { name, email, role, avatar } = req.body;
    const fields = [];
    const params = [];

    if (name   !== undefined) { fields.push('name = ?');   params.push(name); }
    if (email  !== undefined) { fields.push('email = ?');  params.push(email); }
    if (role   !== undefined) { fields.push('role = ?');   params.push(role || null); }
    if (avatar !== undefined) { fields.push('avatar = ?'); params.push(avatar || null); }

    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

    params.push(req.params.id);
    await db.execute(`UPDATE people SET ${fields.join(', ')} WHERE id = ?`, params);

    const [rows] = await db.execute('SELECT * FROM people WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    next(err);
  }
});

/* ── DELETE /api/people/:id ─────────────────────────────────── */
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await db.execute('DELETE FROM people WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Person not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
