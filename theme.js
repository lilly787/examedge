/**
 * PrepFast Theme Manager — Light / Dark Mode
 * Reads from localStorage and applies theme before first paint.
 */
(function () {
  // 1. Apply saved theme immediately (before paint) to avoid flash
  const saved = localStorage.getItem('pf-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  // Expose a global function to toggle the theme from settings menus
  window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('pf-theme', next);
    
    // Dispatch a custom event in case components need to react
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next } }));
    return next;
  };
})();
