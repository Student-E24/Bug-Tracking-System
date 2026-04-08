/**
 * api.js – Fun API integrations
 * Fetches random advice and jokes to display in the dashboard.
 */
const Api = (() => {
  /* ── Random Advice ───────────────────────────────────────── */
  async function fetchAdvice() {
    try {
      const res = await fetch('https://api.adviceslip.com/advice', { cache: 'no-store' });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return data.slip ? data.slip.advice : null;
    } catch {
      return null;
    }
  }

  /* ── Programming Quote (ZenQuotes fallback) ─────────────── */
  async function fetchJoke() {
    try {
      const res = await fetch(
        'https://v2.jokeapi.dev/joke/Programming?type=single&safe-mode',
        { cache: 'no-store' }
      );
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return data.joke || null;
    } catch {
      return null;
    }
  }

  /* ── Activity Suggestion ────────────────────────────────── */
  async function fetchActivity() {
    try {
      const res = await fetch('https://www.boredapi.com/api/activity', { cache: 'no-store' });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return data.activity || null;
    } catch {
      return null;
    }
  }

  /**
   * Render a "fun widget" into the element with the given selector.
   * Tries advice, then joke, then a static fallback.
   */
  async function renderWidget(selector) {
    const el = document.querySelector(selector);
    if (!el) return;

    el.innerHTML = '<span class="text-muted small fst-italic">Loading tip…</span>';

    const text = (await fetchAdvice()) || (await fetchJoke()) || 'Keep shipping! 🚀';
    el.innerHTML = `<span class="text-muted small fst-italic">💡 ${text}</span>`;
  }

  return { fetchAdvice, fetchJoke, fetchActivity, renderWidget };
})();
