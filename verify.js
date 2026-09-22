const fs = require('fs');
const code = fs.readFileSync('js/spa-router.js', 'utf8');
const sections = ['marketplace', 'net-value', 'material-journey', 'material-bank', 'about', 'dashboard'];
sections.forEach(id => {
  const hasRoleAttr = code.includes('id="' + id + '" data-rx-role') || code.includes("id='" + id + "' data-rx-role");
  const hasHide = code.includes('id="' + id + '"') && code.includes('style="display:none;"');
  console.log(id + ': role-gated =', hasRoleAttr, '| hidden by default =', hasHide);
});
console.log('applyAccess present:', code.includes('applyAccess'));
console.log('Initial RBAC call present:', code.includes('applyInitialRBAC'));
console.log('Login prompt banner present:', code.includes('rx-login-prompt-banner'));
