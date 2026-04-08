/**
 * app.js – Router / nav logic
 * Highlights the active nav link and exposes shared page utilities.
 */
const App = (() => {
  /* ── Navigation ──────────────────────────────────────────── */
  function highlightNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === page);
    });
  }

  /* ── Shared navbar ───────────────────────────────────────── */
  function renderNav(container) {
    if (!container) return;
    const user = Auth.getUser();
    container.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <a class="navbar-brand fw-bold" href="dashboard">
          <span class="me-1">🐛</span>BugTracker
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#mainNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" href="dashboard">🗂 Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="issues">🔍 Issues</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="people">👥 People</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="projects">📁 Projects</a>
            </li>
          </ul>
          <div class="d-flex align-items-center gap-2">
            <span class="text-light small">👤 ${user ? user.username : 'admin'}</span>
            <button class="btn btn-outline-light btn-sm" onclick="Auth.logout()">Logout</button>
          </div>
        </div>
      </nav>`;
    highlightNav();
  }

  /* ── Toast notifications ─────────────────────────────────── */
  function toast(message, type = 'success') {
    const container = document.getElementById('toast-container') ||
      (() => {
        const c = document.createElement('div');
        c.id = 'toast-container';
        c.className = 'position-fixed bottom-0 end-0 p-3';
        c.style.zIndex = 9999;
        document.body.appendChild(c);
        return c;
      })();

    const id = `toast-${Date.now()}`;
    const html = `
      <div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto"
                  data-bs-dismiss="toast"></button>
        </div>
      </div>`;
    container.insertAdjacentHTML('beforeend', html);
    const toastEl = document.getElementById(id);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
    bsToast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }

  /* ── Modal helpers ───────────────────────────────────────── */
  function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) new bootstrap.Modal(el).show();
  }

  function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) bootstrap.Modal.getInstance(el)?.hide();
  }

  /* ── Format date ─────────────────────────────────────────── */
  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  }

  /* ── Init page ───────────────────────────────────────────── */
  function init() {
    if (!Auth.requireAuth()) return;
    const navContainer = document.getElementById('app-nav');
    if (navContainer) renderNav(navContainer);
  }

  return { init, renderNav, highlightNav, toast, openModal, closeModal, formatDate };
})();
