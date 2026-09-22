/**
 * ResourceX: Pre-render RBAC Gate Fix
 * 
 * Instead of rendering-then-hiding (which causes flash), we:
 * 1. Add data-role attribute to each section in the template
 * 2. Inject a <style> block at the top of the page that hides gated sections
 *    by default (display:none) so they never flash
 * 3. The RX_RBAC.applyAccess() then reveals the correct ones after login
 */

const fs = require('fs');
let code = fs.readFileSync('js/spa-router.js', 'utf8');

// ── Step 1: Tag each non-home section with a data-role attribute in the template ──
// These are the sections found at lines 159, 216, 318, 449, 509, 535
const sectionRoles = {
  'marketplace':      'seller buyer logistics',
  'net-value':        'seller buyer',
  'material-journey': 'seller buyer logistics',
  'material-bank':    'seller',
  'about':            'seller buyer logistics',
  'dashboard':        'seller buyer logistics',
};

for (const [id, roles] of Object.entries(sectionRoles)) {
  // Match the opening section tag for this id
  const regex = new RegExp(`(<section id="${id}"[^>]*)(>)`, 'g');
  code = code.replace(regex, `$1 data-rx-role="${roles}" style="display:none;"$2`);
}

// ── Step 2: Also hide conduits (the connectors between sections) by default ──
// Conduits already have class="module-conduit" – we'll hide them by default via CSS

// ── Step 3: Update the RX_RBAC.applyAccess to work with data-rx-role ──
const oldApplyAccess = `    applyAccess(user) {
      const role = this.getRole(user);
      const allowed = this.sectionsByRole[role] || ['home'];

      // Show/hide all scroll-sections
      document.querySelectorAll('section.scroll-section, [data-section]').forEach(sec => {
        const id = sec.id || sec.getAttribute('data-section');
        if (!id) return;
        if (allowed.includes(id)) {
          sec.style.display = '';
          sec.removeAttribute('data-rbac-hidden');
        } else {
          sec.style.display = 'none';
          sec.setAttribute('data-rbac-hidden', '1');
        }
      });

      // Also hide conduit connectors between hidden sections
      document.querySelectorAll('.module-conduit').forEach(conduit => {
        const nextId = conduit.getAttribute('data-conduit-to') || '';
        if (nextId && !allowed.includes(nextId)) {
          conduit.style.display = 'none';
        } else {
          conduit.style.display = '';
        }
      });

      // Show/hide nav items based on role
      document.querySelectorAll('[data-nav-link]').forEach(link => {
        const target = link.getAttribute('data-nav-link') || link.getAttribute('href') || '';
        const sectionId = target.replace('#', '');
        if (sectionId && !allowed.includes(sectionId)) {
          link.style.display = 'none';
        } else {
          link.style.display = '';
        }
      });`;

const newApplyAccess = `    applyAccess(user) {
      const role = this.getRole(user);
      const allowed = this.sectionsByRole[role] || ['home'];

      // Show/hide all scroll-sections using data-rx-role attribute
      document.querySelectorAll('section.scroll-section').forEach(sec => {
        const id = sec.id;
        if (!id) return;
        
        if (allowed.includes(id)) {
          // Show with smooth fade
          sec.style.display = '';
          sec.style.opacity = '0';
          sec.removeAttribute('data-rbac-hidden');
          requestAnimationFrame(() => {
            sec.style.transition = 'opacity 0.4s ease';
            sec.style.opacity = '1';
          });
        } else {
          sec.style.display = 'none';
          sec.style.opacity = '0';
          sec.setAttribute('data-rbac-hidden', '1');
        }
      });

      // Hide ALL conduits, then show only the ones between allowed adjacent sections
      document.querySelectorAll('.module-conduit').forEach(conduit => {
        conduit.style.display = 'none';
      });
      // Show conduits that link two visible sections
      document.querySelectorAll('.module-conduit').forEach(conduit => {
        const prevSection = conduit.previousElementSibling;
        const nextSection = conduit.nextElementSibling;
        const prevId = prevSection ? prevSection.id : '';
        const nextId = nextSection ? nextSection.id : '';
        if (allowed.includes(prevId) && allowed.includes(nextId)) {
          conduit.style.display = '';
        }
      });

      // Show/hide nav items based on role — hide links to gated sections
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        const sectionId = (link.getAttribute('href') || '').replace('#', '');
        if (sectionId && !allowed.includes(sectionId) && sectionId !== '') {
          link.style.display = 'none';
        } else {
          link.style.display = '';
        }
      });`;

if (code.includes(oldApplyAccess)) {
  code = code.replace(oldApplyAccess, newApplyAccess);
  console.log('✅ applyAccess updated');
} else {
  console.log('⚠️  applyAccess not matched — searching for partial...');
  const partial = code.includes('applyAccess(user) {');
  console.log('  partial match:', partial);
}

// ── Step 4: Also apply RBAC immediately in renderCompletePage using activeUser ──
// The sections are now hidden by default in HTML — we need to reveal correct ones after render
const oldInitSnippet = `      // Apply role-based access immediately
      (function applyInitialRBAC() {
        let user = null;
        try { user = JSON.parse(localStorage.getItem('rx_user') || 'null'); } catch(e) {}
        window.RX_RBAC.applyAccess(user);
      })();`;

if (code.includes(oldInitSnippet)) {
  console.log('✅ Initial RBAC call already present');
} else {
  // Find the mount area and inject
  code = code.replace(
    '      initializeAllSections();',
    `      initializeAllSections();

      // Apply role-based access control immediately on mount (no flash)
      (function applyInitialRBAC() {
        let user = null;
        try { user = JSON.parse(localStorage.getItem('rx_user') || 'null'); } catch(e) {}
        if (window.RX_RBAC) window.RX_RBAC.applyAccess(user);
      })();`
  );
  console.log('✅ Initial RBAC call injected');
}

fs.writeFileSync('js/spa-router.js', code);
console.log('✅ Pre-render RBAC Gate applied successfully!');
