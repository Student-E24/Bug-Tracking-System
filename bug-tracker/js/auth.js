/**
 * auth.js – Admin login (single sign-on)
 * Credentials are intentionally simple for a demo system.
 * Stores session in sessionStorage so it clears on tab close.
 */
const Auth = (() => {
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';
  const SESSION_KEY    = 'bts_session';
  const LOGIN_PAGE     = 'index';

  function login(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ username, loginAt: new Date().toISOString() })
      );
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = LOGIN_PAGE;
  }

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) !== null;
  }

  function getUser() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  }

  /** Redirect to login page when not authenticated. */
  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = LOGIN_PAGE;
      return false;
    }
    return true;
  }

  return { login, logout, isLoggedIn, getUser, requireAuth };
})();
