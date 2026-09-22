const fs = require('fs');
let code = fs.readFileSync('js/spa-router.js', 'utf8');

// Inject RBAC call right after initializeAllSections() in mount()
const target = `    app.innerHTML = renderCompletePage();

    initializeAllSections();
    if (window.RX && window.RX.refreshNavUser) {`;

const replacement = `    app.innerHTML = renderCompletePage();

    initializeAllSections();

    // ── RBAC: Apply role-based section visibility immediately (no flash) ──
    (function applyInitialRBAC() {
      let user = null;
      try { user = JSON.parse(localStorage.getItem('rx_user') || 'null'); } catch(e) {}
      if (window.RX_RBAC) window.RX_RBAC.applyAccess(user);
    })();

    if (window.RX && window.RX.refreshNavUser) {`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('js/spa-router.js', code);
  console.log('✅ RBAC initial call injected successfully');
} else {
  console.log('❌ Target not found — dumping context for manual check');
  const idx = code.indexOf('initializeAllSections();\n    if (window.RX');
  console.log('idx:', idx);
  console.log(code.substring(idx, idx+200));
}
