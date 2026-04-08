/**
 * issues.js – Issue logic
 * Thin wrapper around Storage that adds issue-specific helpers.
 */
const Issues = (() => {
  const COLLECTION = 'issues';

  const STATUSES = [
    { id: 'backlog',     label: 'Backlog',      color: 'secondary' },
    { id: 'ready',       label: 'Ready',        color: 'primary'   },
    { id: 'in-progress', label: 'In Progress',  color: 'warning'   },
    { id: 'done',        label: 'Done',         color: 'success'   },
  ];

  const PRIORITIES = [
    { id: 'low',      label: 'Low',      color: 'secondary', icon: '▼' },
    { id: 'medium',   label: 'Medium',   color: 'info',      icon: '■' },
    { id: 'high',     label: 'High',     color: 'warning',   icon: '▲' },
    { id: 'critical', label: 'Critical', color: 'danger',    icon: '‼' },
  ];

  const TYPES = [
    { id: 'bug',         label: 'Bug',         icon: '🐛' },
    { id: 'feature',     label: 'Feature',     icon: '✨' },
    { id: 'task',        label: 'Task',        icon: '✅' },
    { id: 'improvement', label: 'Improvement', icon: '⚡' },
  ];

  /* ── CRUD ────────────────────────────────────────────────── */
  function getAll()          { return Storage.getAll(COLLECTION); }
  function get(id)           { return Storage.get(COLLECTION, id); }
  function create(data)      { return Storage.create(COLLECTION, data); }
  function update(id, data)  { return Storage.update(COLLECTION, id, data); }
  function remove(id)        { return Storage.remove(COLLECTION, id); }

  /* ── Queries ─────────────────────────────────────────────── */
  function byStatus(status) {
    return Storage.query(COLLECTION, i => i.status === status);
  }

  function byProject(projectId) {
    return Storage.query(COLLECTION, i => i.projectId === projectId);
  }

  function search(term) {
    const t = term.toLowerCase();
    return Storage.query(COLLECTION, i =>
      i.title.toLowerCase().includes(t) ||
      (i.description || '').toLowerCase().includes(t) ||
      (i.tags || []).some(tag => tag.toLowerCase().includes(t))
    );
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  function statusMeta(id) {
    return STATUSES.find(s => s.id === id) || STATUSES[0];
  }

  function priorityMeta(id) {
    return PRIORITIES.find(p => p.id === id) || PRIORITIES[1];
  }

  function typeMeta(id) {
    return TYPES.find(t => t.id === id) || TYPES[0];
  }

  function statusBadge(status) {
    const meta = statusMeta(status);
    return `<span class="badge bg-${meta.color}">${meta.label}</span>`;
  }

  function priorityBadge(priority) {
    const meta = priorityMeta(priority);
    return `<span class="badge bg-${meta.color} text-${meta.color === 'warning' ? 'dark' : 'white'}">${meta.icon} ${meta.label}</span>`;
  }

  return {
    getAll, get, create, update, remove,
    byStatus, byProject, search,
    statusMeta, priorityMeta, typeMeta,
    statusBadge, priorityBadge,
    STATUSES, PRIORITIES, TYPES,
  };
})();
