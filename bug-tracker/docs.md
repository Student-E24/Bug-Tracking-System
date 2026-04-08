# BugTracker – Documentation

## Overview

BugTracker is a lightweight, client-side bug and issue tracking application. All data is stored in the browser's `localStorage` (no server required for the frontend). An optional Express/MySQL backend is included in the `server/` directory.

---

## Getting Started

### Frontend (no server needed)

1. Open `bug-tracker/index.html` in any modern browser **or** serve the directory with a static server:

   ```bash
   npx serve bug-tracker
   # then open http://localhost:3000
   ```

2. Sign in with the demo credentials:

   | Field    | Value      |
   |----------|------------|
   | Username | `admin`    |
   | Password | `admin123` |

3. Demo data (12 issues, 5 people, 4 projects) is seeded automatically on first load.

---

## Pages

### Login (`index.html`)

Single-admin authentication. Credentials are validated client-side; the session is stored in `sessionStorage` and expires when the tab closes.

### Dashboard (`dashboard.html`)

Kanban board with four columns:

| Column      | Description                      |
|-------------|----------------------------------|
| Backlog     | Issues not yet scheduled         |
| Ready       | Issues ready to work on          |
| In Progress | Issues actively being worked on  |
| Done        | Completed issues                 |

Drag and drop cards between columns to change their status. A summary strip at the top shows key stats. A fun tip/joke is loaded from a public API.

### Issues (`issues.html`)

Tabular view of all issues with live filtering by:
- Free-text search (title, description, tags)
- Status
- Priority
- Project

Click a row to open the issue detail page.

### Issue Detail (`issue-detail.html`)

Create or edit a single issue. Fields:

| Field       | Type               |
|-------------|--------------------|
| Title       | Text (required)    |
| Description | Textarea           |
| Status      | Select             |
| Priority    | Select             |
| Type        | Select             |
| Project     | Select             |
| Assignee    | Select             |
| Tags        | Comma-separated text |

### People (`people.html`)

Manage team members (CRUD). Each person has: name, email, role. Avatar initials are auto-generated.

### Projects (`projects.html`)

Manage projects (CRUD). Each project has: name, description, colour. A progress bar shows the percentage of done issues per project.

---

## Architecture

```
bug-tracker/
├── index.html          # Login page
├── dashboard.html      # Kanban board
├── issues.html         # Table view
├── issue-detail.html   # Single issue view/edit
├── people.html         # Manage people
├── projects.html       # Manage projects
├── docs.md             # This file
├── css/
│   └── style.css       # Custom styles (Bootstrap 5 base)
├── js/
│   ├── app.js          # Shared nav, toast, utilities
│   ├── auth.js         # Session management
│   ├── storage.js      # localStorage CRUD abstraction
│   ├── issues.js       # Issue model + helpers
│   ├── people.js       # People model + helpers
│   ├── projects.js     # Project model + helpers
│   ├── seed.js         # Seed 12 demo issues
│   └── api.js          # Fun API integrations
└── server/             # Optional Express/MySQL backend
    ├── server.js
    ├── db.js
    └── routes/
        ├── issues.js
        ├── people.js
        └── projects.js
```

### Data Models

#### Issue

```json
{
  "id":          "1714000000000-ab1cd",
  "title":       "Login button unresponsive on Safari",
  "description": "Steps to reproduce…",
  "status":      "backlog",
  "priority":    "high",
  "type":        "bug",
  "projectId":   "<project-id>",
  "assigneeId":  "<person-id>",
  "tags":        ["frontend", "auth"],
  "createdAt":   "2024-04-25T10:00:00.000Z",
  "updatedAt":   "2024-04-25T10:00:00.000Z"
}
```

**Status values:** `backlog` | `ready` | `in-progress` | `done`  
**Priority values:** `low` | `medium` | `high` | `critical`  
**Type values:** `bug` | `feature` | `task` | `improvement`

#### Person

```json
{
  "id":        "<person-id>",
  "name":      "Alice Johnson",
  "email":     "alice@example.com",
  "role":      "developer",
  "avatar":    "AJ",
  "createdAt": "…",
  "updatedAt": "…"
}
```

#### Project

```json
{
  "id":          "<project-id>",
  "name":        "Frontend App",
  "description": "React-based customer portal",
  "color":       "#4361ee",
  "createdAt":   "…",
  "updatedAt":   "…"
}
```

---

## Backend (Bonus)

The `server/` directory contains an Express.js server backed by MySQL.

### Setup

```bash
cd bug-tracker/server
npm install
```

Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=bugtracker
PORT=4000
```

Start the server:

```bash
node server.js
```

### REST API Endpoints

#### Issues

| Method | Path                   | Description         |
|--------|------------------------|---------------------|
| GET    | `/api/issues`          | List all issues     |
| GET    | `/api/issues/:id`      | Get one issue       |
| POST   | `/api/issues`          | Create issue        |
| PUT    | `/api/issues/:id`      | Update issue        |
| DELETE | `/api/issues/:id`      | Delete issue        |

#### People

| Method | Path                   | Description         |
|--------|------------------------|---------------------|
| GET    | `/api/people`          | List all people     |
| GET    | `/api/people/:id`      | Get one person      |
| POST   | `/api/people`          | Create person       |
| PUT    | `/api/people/:id`      | Update person       |
| DELETE | `/api/people/:id`      | Delete person       |

#### Projects

| Method | Path                     | Description         |
|--------|--------------------------|---------------------|
| GET    | `/api/projects`          | List all projects   |
| GET    | `/api/projects/:id`      | Get one project     |
| POST   | `/api/projects`          | Create project      |
| PUT    | `/api/projects/:id`      | Update project      |
| DELETE | `/api/projects/:id`      | Delete project      |

---

## Resetting Demo Data

Open the browser console on any page and run:

```js
Seed.reset();
location.reload();
```

This clears all localStorage data and re-seeds on the next page load.
