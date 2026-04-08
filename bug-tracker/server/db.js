/**
 * db.js – MySQL connection pool
 *
 * Requires environment variables:
 *   DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
 *
 * Schema (run once):
 *
 *   CREATE DATABASE IF NOT EXISTS bugtracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
 *   USE bugtracker;
 *
 *   CREATE TABLE projects (
 *     id          VARCHAR(36)  NOT NULL PRIMARY KEY,
 *     name        VARCHAR(255) NOT NULL,
 *     description TEXT,
 *     color       VARCHAR(20)  NOT NULL DEFAULT '#4361ee',
 *     created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *     updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 *   );
 *
 *   CREATE TABLE people (
 *     id         VARCHAR(36)  NOT NULL PRIMARY KEY,
 *     name       VARCHAR(255) NOT NULL,
 *     email      VARCHAR(255) NOT NULL UNIQUE,
 *     role       VARCHAR(50),
 *     avatar     VARCHAR(10),
 *     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *     updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 *   );
 *
 *   CREATE TABLE issues (
 *     id          VARCHAR(36)  NOT NULL PRIMARY KEY,
 *     title       VARCHAR(500) NOT NULL,
 *     description TEXT,
 *     status      ENUM('backlog','ready','in-progress','done') NOT NULL DEFAULT 'backlog',
 *     priority    ENUM('low','medium','high','critical')       NOT NULL DEFAULT 'medium',
 *     type        ENUM('bug','feature','task','improvement')   NOT NULL DEFAULT 'bug',
 *     project_id  VARCHAR(36)  REFERENCES projects(id) ON DELETE SET NULL,
 *     assignee_id VARCHAR(36)  REFERENCES people(id)   ON DELETE SET NULL,
 *     tags        JSON,
 *     created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *     updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 *   );
 */
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD || '',
  database:        process.env.DB_NAME     || 'bugtracker',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

module.exports = pool;
