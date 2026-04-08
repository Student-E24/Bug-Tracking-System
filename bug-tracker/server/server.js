/**
 * server.js – Express entry point
 *
 * Usage:
 *   npm install
 *   node server.js
 *
 * Environment variables (create a .env file):
 *   DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT
 */
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');

const issuesRouter   = require('./routes/issues');
const peopleRouter   = require('./routes/people');
const projectsRouter = require('./routes/projects');

const app  = express();
const PORT = process.env.PORT || 4000;

/* ── Middleware ──────────────────────────────────────────────── */
app.use(cors());
app.use(express.json());

/* ── Serve static frontend from parent directory ─────────────── */
app.use(express.static(path.join(__dirname, '..')));

/* ── API routes ──────────────────────────────────────────────── */
app.use('/api/issues',   issuesRouter);
app.use('/api/people',   peopleRouter);
app.use('/api/projects', projectsRouter);

/* ── Health check ────────────────────────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── 404 handler ─────────────────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

/* ── Global error handler ────────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`BugTracker API running on http://localhost:${PORT}`);
});

module.exports = app;
