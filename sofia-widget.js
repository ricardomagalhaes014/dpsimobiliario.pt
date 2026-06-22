/* Sofia Widget - disabled. Removes pill button if present. */
(function() {
  function cleanup() {
    ['dps-sofia-btn','dps-sofia-container','dps-btn','dps-tip','el-w'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanup);
  } else {
    cleanup();
  }
  setTimeout(cleanup, 500);
  setTimeout(cleanup, 1500);
})();
