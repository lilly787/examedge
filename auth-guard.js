/**
 * ExamEdge Auth Guard
 * Role-based access control helper for routing and gating pages.
 */

function checkAccess(allowedRoles) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('prepfast_user') || 'null');
  } catch (e) {
    window.location.replace('index.html');
    return;
  }

  if (!user || !user.role) {
    window.location.replace('index.html');
    return;
  }

  const role = user.role;
  if (!allowedRoles.includes(role)) {
    const redirectMap = {
      student: 'index.html',
      teacher: 'teacher.html',
      parent: 'parent.html',
      school: 'school.html',
      admin: 'admin.html'
    };
    window.location.replace(redirectMap[role] || 'index.html');
  }
}

// Global Impersonation Banner Injection
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('isAdminView') === 'true') {
    const banner = document.createElement('div');
    banner.id = 'admin-view-banner';
    banner.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0;
      background: linear-gradient(90deg, #f59e0b, #d97706);
      color: #000;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 700;
      text-align: center;
      z-index: 99999;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: 'Inter', sans-serif;
    `;
    
    let targetName = 'User';
    try {
      const user = JSON.parse(localStorage.getItem('prepfast_user') || '{}');
      targetName = user.name || 'User';
    } catch(e) {}
    
    banner.innerHTML = `
      <span>⚠️ Admin View — You are viewing this portal as <strong>${targetName}</strong></span>
      <button onclick="exitImpersonation()" style="
        background: #000;
        color: #fff;
        border: none;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        Exit View
      </button>
    `;
    document.body.appendChild(banner);
    document.body.style.paddingTop = (document.body.style.paddingTop ? parseFloat(document.body.style.paddingTop) : 0) + 36 + 'px';
  }
});

// Global Exit Impersonation Handler
window.exitImpersonation = function() {
  const adminToken = localStorage.getItem('admin_token');
  const adminUser = localStorage.getItem('admin_user');
  
  if (adminToken && adminUser) {
    localStorage.setItem('prepfast_token', adminToken);
    localStorage.setItem('prepfast_user', adminUser);
    
    try {
      if (typeof PrepFastDB !== 'undefined') {
        const parsed = JSON.parse(adminUser);
        PrepFastDB.loginProfile(parsed);
      }
    } catch(e) {}
    
    localStorage.removeItem('isAdminView');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = 'admin.html';
  } else {
    localStorage.removeItem('isAdminView');
    localStorage.removeItem('prepfast_user');
    localStorage.removeItem('prepfast_token');
    window.location.href = 'index.html';
  }
};

// Make available globally in the browser
if (typeof window !== 'undefined') {
  window.checkAccess = checkAccess;
}

// Support CommonJS for backend/testing scripts if required
if (typeof module !== 'undefined' && module.exports) {
  module.exports = checkAccess;
}
