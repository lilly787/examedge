// PrepFast runtime configuration (Phases 0–2)
(function () {
  let origin = 'http://127.0.0.1:8000'; // Default fallback
  if (window.location.origin && window.location.origin !== 'null' && !window.location.origin.startsWith('file')) {
    origin = window.location.origin;
  }
  
  window.PREPFAST_CONFIG = {
    apiBase: origin + '/api',
    useApi: true,
    offlineDbName: 'prepfast-offline-v1',
  };
  window.EXAMEDGE_CONFIG = window.PREPFAST_CONFIG;
})();
