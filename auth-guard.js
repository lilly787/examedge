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
      admin: 'admin.html'
    };
    window.location.replace(redirectMap[role] || 'index.html');
  }
}

// Make available globally in the browser
if (typeof window !== 'undefined') {
  window.checkAccess = checkAccess;
}

// Support CommonJS for backend/testing scripts if required
if (typeof module !== 'undefined' && module.exports) {
  module.exports = checkAccess;
}
