/**
 * app.js – Main application logic for the Bug Tracking System
 */

/* ── Auth guard ────────────────────────────────────────── */
if (sessionStorage.getItem('bts_auth') !== 'true') {
  window.location.href = 'index.html';
}

/* ── Helpers ───────────────────────────────────────────── */
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById(viewId);
  if (el) el.classList.add('active');
  document.querySelectorAll('#sidebar .nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.view === viewId);
  });
  window.scrollTo(0, 0);
}

function getPersonName(id) {
  const p = getPeople().find(x => x.id === id);
  return p ? `${p.name} ${p.surname}` : '—';
}
function getProjectName(id) {
  const p = getProjects().find(x => x.id === id);
  return p ? p.name : '—';
}
function getPersonInitials(id) {
  const p = getPeople().find(x => x.id === id);
  return p ? (p.name[0] + p.surname[0]).toUpperCase() : '?';
}

function statusBadge(status) {
  const map = { open: 'badge-open', resolved: 'badge-resolved', overdue: 'badge-overdue' };
  return `<span class="badge ${map[status] || 'bg-secondary'} text-capitalize">${status}</span>`;
}
function priorityBadge(priority) {
  const map = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' };
  return `<span class="badge ${map[priority] || 'bg-secondary'} text-capitalize">${priority}</span>`;
}
function fmtDate(d) {
  return d ? new Date(d + 'T00:00:00').toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: '2-digit' }) : '—';
}
function escHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Dashboard / Issues List ──────────────────────────── */
function renderIssuesList() {
  const issues   = getIssues();
  const fStatus  = document.getElementById('filterStatus').value;
  const fPriority = document.getElementById('filterPriority').value;
  const fProject = document.getElementById('filterProject').value;
  const search   = document.getElementById('searchIssues').value.toLowerCase();

  const filtered = issues.filter(iss => {
    if (fStatus   && iss.status   !== fStatus)   return false;
    if (fPriority && iss.priority !== fPriority) return false;
    if (fProject  && iss.projectId !== fProject) return false;
    if (search && !iss.summary.toLowerCase().includes(search) &&
        !iss.description.toLowerCase().includes(search)) return false;
    return true;
  });

  const tbody = document.getElementById('issuesTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No issues found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(iss => `
    <tr class="issue-row" onclick="viewIssue('${iss.id}')">
      <td class="fw-semibold text-primary" style="max-width:250px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${escHtml(iss.summary)}">${escHtml(iss.summary)}</td>
      <td>${getProjectName(iss.projectId)}</td>
      <td>${statusBadge(iss.status)}</td>
      <td>${priorityBadge(iss.priority)}</td>
      <td>${getPersonName(iss.assignedTo)}</td>
      <td>${fmtDate(iss.dateIdentified)}</td>
      <td>${fmtDate(iss.targetResolutionDate)}</td>
    </tr>
  `).join('');

  updateStats(issues);
}

function updateStats(issues) {
  document.getElementById('statTotal').textContent    = issues.length;
  document.getElementById('statOpen').textContent     = issues.filter(i => i.status === 'open').length;
  document.getElementById('statOverdue').textContent  = issues.filter(i => i.status === 'overdue').length;
  document.getElementById('statResolved').textContent = issues.filter(i => i.status === 'resolved').length;
}

function populateFilterDropdowns() {
  const projects = getProjects();
  const sel = document.getElementById('filterProject');
  sel.innerHTML = '<option value="">All Projects</option>' +
    projects.map(p => `<option value="${p.id}">${escHtml(p.name)}</option>`).join('');
}

/* ── View single issue ───────────────────────────────── */
function viewIssue(id) {
  const issue = getIssues().find(i => i.id === id);
  if (!issue) return;

  const borderColor = { open: '#0d6efd', resolved: '#198754', overdue: '#dc3545' }[issue.status] || '#6c757d';

  document.getElementById('detailContent').innerHTML = `
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div class="detail-header" style="border-left-color:${borderColor}">
        <h4 class="fw-bold mb-1">${escHtml(issue.summary)}</h4>
        <div class="d-flex gap-2 flex-wrap mt-2">
          ${statusBadge(issue.status)}
          ${priorityBadge(issue.priority)}
          <span class="badge bg-secondary">${escHtml(getProjectName(issue.projectId))}</span>
        </div>
      </div>
      <button class="btn btn-outline-primary btn-sm" onclick="editIssue('${issue.id}')">
        <i class="bi bi-pencil me-1"></i>Edit
      </button>
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <h6 class="card-subtitle text-muted mb-2">Description</h6>
        <p class="mb-0">${escHtml(issue.description) || '<em class="text-muted">No description provided.</em>'}</p>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-subtitle text-muted mb-3">Details</h6>
            <table class="table table-sm mb-0">
              <tr><th>Identified By</th><td>${escHtml(getPersonName(issue.identifiedBy))}</td></tr>
              <tr><th>Assigned To</th><td>${issue.assignedTo ? escHtml(getPersonName(issue.assignedTo)) : '<em class="text-muted">Unassigned</em>'}</td></tr>
              <tr><th>Project</th><td>${escHtml(getProjectName(issue.projectId))}</td></tr>
              <tr><th>Date Identified</th><td>${fmtDate(issue.dateIdentified)}</td></tr>
              <tr><th>Target Resolution</th><td>${fmtDate(issue.targetResolutionDate)}</td></tr>
              <tr><th>Actual Resolution</th><td>${fmtDate(issue.actualResolutionDate)}</td></tr>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-subtitle text-muted mb-3">Resolution</h6>
            ${issue.resolutionSummary
              ? `<p class="mb-0">${escHtml(issue.resolutionSummary)}</p>`
              : '<em class="text-muted">No resolution summary yet.</em>'}
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('detailBackBtn').onclick = () => showView('view-issues');
  showView('view-detail');
}

/* ── Create / Edit issue ─────────────────────────────── */
let _editingIssueId = null;

function openCreateIssue() {
  _editingIssueId = null;
  document.getElementById('issueFormTitle').textContent = 'Create New Issue';
  document.getElementById('issueForm').reset();
  populateIssueFormDropdowns();
  showView('view-issue-form');
}

function editIssue(id) {
  const issue = getIssues().find(i => i.id === id);
  if (!issue) return;
  _editingIssueId = id;
  document.getElementById('issueFormTitle').textContent = 'Edit Issue';
  populateIssueFormDropdowns();

  document.getElementById('fSummary').value             = issue.summary;
  document.getElementById('fDescription').value         = issue.description;
  document.getElementById('fIdentifiedBy').value        = issue.identifiedBy;
  document.getElementById('fDateIdentified').value      = issue.dateIdentified;
  document.getElementById('fProject').value             = issue.projectId;
  document.getElementById('fAssignedTo').value          = issue.assignedTo || '';
  document.getElementById('fStatus').value              = issue.status;
  document.getElementById('fPriority').value            = issue.priority;
  document.getElementById('fTargetDate').value          = issue.targetResolutionDate;
  document.getElementById('fActualDate').value          = issue.actualResolutionDate || '';
  document.getElementById('fResolutionSummary').value   = issue.resolutionSummary || '';

  showView('view-issue-form');
}

function populateIssueFormDropdowns() {
  const people   = getPeople();
  const projects = getProjects();

  const peopleOpts = '<option value="">— Select —</option>' +
    people.map(p => `<option value="${p.id}">${escHtml(p.name + ' ' + p.surname)}</option>`).join('');
  const projOpts = '<option value="">— Select —</option>' +
    projects.map(p => `<option value="${p.id}">${escHtml(p.name)}</option>`).join('');

  document.getElementById('fIdentifiedBy').innerHTML = peopleOpts;
  document.getElementById('fAssignedTo').innerHTML   = '<option value="">— Unassigned —</option>' +
    people.map(p => `<option value="${p.id}">${escHtml(p.name + ' ' + p.surname)}</option>`).join('');
  document.getElementById('fProject').innerHTML = projOpts;
}

document.getElementById('issueForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!this.checkValidity()) { this.classList.add('was-validated'); return; }

  const issues = getIssues();
  const issue = {
    id:                   _editingIssueId || generateId(),
    summary:              document.getElementById('fSummary').value.trim(),
    description:          document.getElementById('fDescription').value.trim(),
    identifiedBy:         document.getElementById('fIdentifiedBy').value,
    dateIdentified:       document.getElementById('fDateIdentified').value,
    projectId:            document.getElementById('fProject').value,
    assignedTo:           document.getElementById('fAssignedTo').value,
    status:               document.getElementById('fStatus').value,
    priority:             document.getElementById('fPriority').value,
    targetResolutionDate: document.getElementById('fTargetDate').value,
    actualResolutionDate: document.getElementById('fActualDate').value,
    resolutionSummary:    document.getElementById('fResolutionSummary').value.trim(),
  };

  if (_editingIssueId) {
    const idx = issues.findIndex(i => i.id === _editingIssueId);
    if (idx !== -1) issues[idx] = issue;
  } else {
    issues.push(issue);
  }
  saveIssues(issues);
  this.classList.remove('was-validated');

  if (_editingIssueId) {
    viewIssue(issue.id);
  } else {
    renderIssuesList();
    showView('view-issues');
  }
});

/* ── People ──────────────────────────────────────────── */
function renderPeople() {
  const people = getPeople();
  const container = document.getElementById('peopleList');
  if (people.length === 0) {
    container.innerHTML = '<p class="text-muted">No people added yet.</p>';
    return;
  }
  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr><th></th><th>Name</th><th>Username</th><th>Email</th></tr>
        </thead>
        <tbody>
          ${people.map(p => `
            <tr>
              <td><div class="avatar-circle">${(p.name[0]+p.surname[0]).toUpperCase()}</div></td>
              <td class="fw-semibold">${escHtml(p.name)} ${escHtml(p.surname)}</td>
              <td><code>${escHtml(p.username)}</code></td>
              <td>${escHtml(p.email)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

document.getElementById('personForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!this.checkValidity()) { this.classList.add('was-validated'); return; }

  const username = document.getElementById('pUsername').value.trim();
  const people   = getPeople();
  if (people.find(p => p.username === username)) {
    document.getElementById('pUsernameError').textContent = 'Username already taken.';
    document.getElementById('pUsername').setCustomValidity('taken');
    this.classList.add('was-validated');
    return;
  }
  document.getElementById('pUsername').setCustomValidity('');

  people.push({
    id:      generateId(),
    name:    document.getElementById('pName').value.trim(),
    surname: document.getElementById('pSurname').value.trim(),
    email:   document.getElementById('pEmail').value.trim(),
    username,
  });
  savePeople(people);
  this.reset();
  this.classList.remove('was-validated');
  renderPeople();
  // Also refresh dropdowns if on issue form
  populateFilterDropdowns();
});

document.getElementById('pUsername').addEventListener('input', function () {
  this.setCustomValidity('');
});

/* ── Projects ────────────────────────────────────────── */
function renderProjects() {
  const projects = getProjects();
  const issues   = getIssues();
  const container = document.getElementById('projectsList');
  if (projects.length === 0) {
    container.innerHTML = '<p class="text-muted">No projects added yet.</p>';
    return;
  }
  container.innerHTML = `
    <div class="row g-3">
      ${projects.map(proj => {
        const count = issues.filter(i => i.projectId === proj.id).length;
        return `
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h5 class="card-title fw-bold"><i class="bi bi-folder2 me-2 text-warning"></i>${escHtml(proj.name)}</h5>
                <p class="card-text text-muted mb-0"><i class="bi bi-ticket me-1"></i>${count} issue${count !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

document.getElementById('projectForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!this.checkValidity()) { this.classList.add('was-validated'); return; }

  const name = document.getElementById('projName').value.trim();
  const projects = getProjects();
  projects.push({ id: generateId(), name });
  saveProjects(projects);
  this.reset();
  this.classList.remove('was-validated');
  renderProjects();
  populateFilterDropdowns();
});

/* ── Sidebar navigation ──────────────────────────────── */
document.querySelectorAll('#sidebar .nav-link[data-view]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const view = this.dataset.view;
    if (view === 'view-issues') {
      populateFilterDropdowns();
      renderIssuesList();
    } else if (view === 'view-people') {
      renderPeople();
    } else if (view === 'view-projects') {
      renderProjects();
    } else if (view === 'view-issue-form') {
      openCreateIssue();
      return; // openCreateIssue calls showView itself
    }
    showView(view);
  });
});

document.getElementById('btnLogout').addEventListener('click', function () {
  sessionStorage.removeItem('bts_auth');
  window.location.href = 'index.html';
});

document.getElementById('btnNewIssue').addEventListener('click', openCreateIssue);

/* Search & filter live update */
['filterStatus', 'filterPriority', 'filterProject'].forEach(id => {
  document.getElementById(id).addEventListener('change', renderIssuesList);
});
document.getElementById('searchIssues').addEventListener('input', renderIssuesList);

/* Cancel buttons */
document.getElementById('cancelIssueForm').addEventListener('click', () => {
  renderIssuesList();
  showView('view-issues');
});

/* ── Boot ────────────────────────────────────────────── */
seedData();
populateFilterDropdowns();
renderIssuesList();
showView('view-issues');
