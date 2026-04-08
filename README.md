# Bug Tracking System 🐛

A browser-based bug/issue tracking application built with plain HTML, CSS, Bootstrap 5, and vanilla JavaScript. All data is persisted using the Web Storage API (`localStorage`).

---

## Features

| Area | Description |
|------|-------------|
| **Authentication** | Single admin login (`admin` / `admin123`) |
| **Issues (Tickets)** | Create, view, edit issues with full detail capture |
| **Assignment** | Assign/re-assign issues to team members (including delayed assignment) |
| **Status & Priority** | Status: `open` / `resolved` / `overdue` · Priority: `low` / `medium` / `high` |
| **People Management** | Create people (id, name, surname, email, username) |
| **Project Management** | Create and link projects to issues |
| **Dashboard** | Summary stats + filterable/searchable issues table |
| **Data Persistence** | All entities stored in `localStorage` across sessions |

---

## Getting Started

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. Sign in with the default admin credentials: **username** `admin`, **password** `admin123`.
4. The app pre-loads with **3 projects**, **5 people**, and **12 sample issues** on first run.

> No build step or server is required – this is a fully static web app.

---

## Project Structure

```
Bug-Tracking-System/
├── index.html        # Login page
├── dashboard.html    # Main single-page application
├── css/
│   └── style.css     # Custom styles (built on Bootstrap 5)
├── js/
│   ├── storage.js    # localStorage read/write helpers
│   ├── seed.js       # Initial demo data seeding
│   └── app.js        # Core application logic & view management
└── README.md
```

---

## Data Models

### Issue (Ticket)
| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Auto-generated |
| `summary` | string | Brief title |
| `description` | string | Detailed description |
| `identifiedBy` | person id | Who found it |
| `dateIdentified` | date | When found |
| `projectId` | project id | Related project |
| `assignedTo` | person id | Assignee (optional) |
| `status` | enum | `open` / `resolved` / `overdue` |
| `priority` | enum | `low` / `medium` / `high` |
| `targetResolutionDate` | date | Expected fix date |
| `actualResolutionDate` | date | Actual fix date |
| `resolutionSummary` | string | How it was resolved |

### Person
`id`, `name`, `surname`, `email`, `username`

### Project
`id`, `name`

---

## Usage

### Creating an Issue
1. Click **New Issue** in the sidebar or the button on the dashboard.
2. Fill in all required fields (marked with *).
3. Click **Save Issue**.

### Viewing an Issue
Click any row in the issues table to open the full detail view.

### Editing an Issue
Open an issue's detail view and click the **Edit** button (top right), or re-use the Create Issue sidebar link to navigate directly.

### Managing People
Navigate to **People** in the sidebar, fill in the form, and click **Add Person**.

### Managing Projects
Navigate to **Projects** in the sidebar, enter a name, and click **Add Project**.

---

## Technologies Used

- [Bootstrap 5.3](https://getbootstrap.com/)
- [Bootstrap Icons 1.11](https://icons.getbootstrap.com/)
- Vanilla JavaScript (ES6+)
- Web Storage API (`localStorage`)

---

## Resources

- [localStorage – javascript.info](https://javascript.info/localstorage)
- [Bootstrap Docs](https://getbootstrap.com/docs/5.3/)
- [Markdown Guide](https://www.markdownguide.org/)