// ── THEME SYSTEM ─────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('prepfast_theme') || 'dark';
  applyTheme(saved);
}

function toggleTheme() {
  const current = localStorage.getItem('prepfast_theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('prepfast_theme', next);
}

function applyTheme(theme) {
  const root = document.documentElement;
  
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
  } else {
    root.removeAttribute('data-theme');
  }
  
  // Update toggle button text and icon
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    if (theme === 'light') {
      btn.innerHTML = `
        <i data-lucide="moon" style="width:16px;height:16px;"></i>
        Dark Mode
      `;
      btn.style.color = '#475569';
    } else {
      btn.innerHTML = `
        <i data-lucide="sun" style="width:16px;height:16px;"></i>
        Light Mode
      `;
      btn.style.color = '#9CA3AF';
    }
    if (window.lucide) {
      lucide.createIcons();
    }
  }
}

// Call on every page load — before anything renders
initTheme();
