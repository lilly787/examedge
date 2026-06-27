/**
 * PrepFast Theme Manager — Light / Dark Mode
 * Reads from localStorage, applies theme before first paint, injects toggle button.
 */
(function () {
  // 1. Apply saved theme immediately (before paint) to avoid flash
  const saved = localStorage.getItem('pf-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  // 2. Inject the floating toggle button once the DOM is ready
  function injectToggle() {
    if (document.getElementById('pf-theme-toggle')) return;

    const btn = document.createElement('button');
    btn.id = 'pf-theme-toggle';
    btn.title = 'Toggle light / dark mode';
    btn.setAttribute('aria-label', 'Toggle theme');
    btn.innerHTML = saved === 'dark' ? '☀️' : '🌙';

    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '5.5rem',
      right: '1.25rem',
      zIndex: '9998',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: '1.5px solid rgba(99,102,241,0.35)',
      background: 'var(--card-glass)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      cursor: 'pointer',
      fontSize: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.12)';
      btn.style.boxShadow = '0 6px 28px rgba(99,102,241,0.4)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)';
    });

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('pf-theme', next);
      btn.innerHTML = next === 'dark' ? '☀️' : '🌙';
    });

    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggle);
  } else {
    injectToggle();
  }
})();
