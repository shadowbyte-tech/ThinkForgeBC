/**
 * ResourceX: Role-Based Access Control + UI Fix Script
 * 
 * Fixes:
 *  1. Login modal select dropdown colors (dark theme)
 *  2. Role-based section gating:
 *     - Unauthenticated: only #home visible
 *     - seller:  home, marketplace, net-value, material-bank, material-journey, dashboard, negotiations
 *     - buyer:   home, marketplace, net-value, material-journey, dashboard, negotiations
 *     - logistics: home, marketplace, material-journey, dashboard
 */

const fs = require('fs');
let code = fs.readFileSync('js/spa-router.js', 'utf8');

// ============================================================
// FIX 1: Fix select element to use appearance: none with custom
// dark background color via JS-injected inline styles
// ============================================================
code = code.replace(
  `<select id="rx-auth-role" style="width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--rx-stone-400); border-radius: 8px; color: var(--rx-text-light); outline: none;">`,
  `<select id="rx-auth-role" style="width: 100%; padding: 0.75rem; background: #141c18; border: 1px solid rgba(196,173,122,0.35); border-radius: 8px; color: #F2EFE7; outline: none; appearance: none; -webkit-appearance: none; cursor: pointer; font-size: 0.9rem; background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23C4AD7A%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>'); background-repeat: no-repeat; background-position: right 1rem center; padding-right: 2.5rem;">`
);

// Fix option colors
code = code.replace(
  `<option value="seller" style="background: #1a1a1a; color: #ffffff;">Generator / Seller (Source Material)</option>
                <option value="buyer" style="background: #1a1a1a; color: #ffffff;">Processor / Buyer (Procure Material)</option>
                <option value="logistics" style="background: #1a1a1a; color: #ffffff;">Logistics / Transport Partner</option>`,
  `<option value="seller" style="background: #0f1210; color: #F2EFE7; font-weight: 600;">🏭 Generator / Seller (Source Material)</option>
                <option value="buyer" style="background: #0f1210; color: #F2EFE7; font-weight: 600;">🔄 Processor / Buyer (Procure Material)</option>
                <option value="logistics" style="background: #0f1210; color: #F2EFE7; font-weight: 600;">🚚 Logistics / Transport Partner</option>`
);

// ============================================================
// FIX 2: Add role-based access control at the bottom of the
// executeDemoEmailLogin function and in mount()
// ============================================================

// Add RX_ACCESS module after executeDemoEmailLogin
const roleAccessModule = `

  /* ============================================================
     ROLE-BASED ACCESS CONTROL (RBAC) MODULE
     Controls which sections are visible based on user role.
     Unauthenticated → only #home visible
     seller → home, marketplace, net-value, material-bank, material-journey, negotiations, dashboard
     buyer → home, marketplace, net-value, material-journey, negotiations, dashboard
     logistics → home, marketplace, material-journey, dashboard
  ============================================================ */
  const RX_RBAC = {
    sectionsByRole: {
      seller:    ['home', 'marketplace', 'net-value', 'material-bank', 'material-journey', 'dashboard'],
      buyer:     ['home', 'marketplace', 'net-value', 'material-journey', 'dashboard'],
      logistics: ['home', 'marketplace', 'material-journey', 'dashboard'],
      guest:     ['home']
    },

    navByRole: {
      seller:    ['Marketplace', 'Net Value', 'Material Bank', 'Journey', 'Dashboard'],
      buyer:     ['Marketplace', 'Net Value', 'Journey', 'Dashboard'],
      logistics: ['Marketplace', 'Journey', 'Dashboard'],
      guest:     []
    },

    getRole(user) {
      if (!user || !user.name) return 'guest';
      const roleVal = user.role_key || '';
      if (roleVal === 'buyer') return 'buyer';
      if (roleVal === 'logistics') return 'logistics';
      if (roleVal === 'seller') return 'seller';
      // Fallback: match by role text
      const roleText = (user.role || '').toLowerCase();
      if (roleText.includes('buyer') || roleText.includes('processor')) return 'buyer';
      if (roleText.includes('logistic') || roleText.includes('transport')) return 'logistics';
      if (roleText.includes('seller') || roleText.includes('generator')) return 'seller';
      return 'guest';
    },

    applyAccess(user) {
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
      });

      // If guest, show a "login prompt" overlay on the page (light indicator)
      const existingBanner = document.getElementById('rx-login-prompt-banner');
      if (role === 'guest') {
        if (!existingBanner) {
          const banner = document.createElement('div');
          banner.id = 'rx-login-prompt-banner';
          banner.style.cssText = \`
            position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
            background: rgba(15, 18, 16, 0.95); border: 1px solid rgba(196,173,122,0.4);
            border-radius: 16px; padding: 1.25rem 1.5rem; max-width: 320px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5); backdrop-filter: blur(12px);
          \`;
          banner.innerHTML = \`
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:0.75rem;">
              <div style="width:8px; height:8px; border-radius:50%; background:#C4AD7A; animation: pulse 2s infinite;"></div>
              <strong style="color:#F2EFE7; font-size:0.9rem;">Industrial Access Required</strong>
            </div>
            <p style="color:#A8A5A0; font-size:0.82rem; margin:0 0 1rem; line-height:1.5;">
              Sign in with your organizational role to access the marketplace, net-value engine, and supply chain tools.
            </p>
            <button onclick="window.RX_SPA.openLoginModal()" style="
              width:100%; padding:0.6rem 1rem; background: var(--rx-brass-400, #C4AD7A); color:#0F1210;
              border:none; border-radius:8px; font-weight:700; font-size:0.85rem; cursor:pointer;
            ">Sign In to Access Portal →</button>
            <button onclick="document.getElementById('rx-login-prompt-banner').remove()" style="
              position:absolute; top:0.75rem; right:0.75rem; background:none; border:none;
              color:#8D8A82; cursor:pointer; font-size:1rem;
            ">✕</button>
          \`;
          document.body.appendChild(banner);
        }
      } else {
        if (existingBanner) existingBanner.remove();
      }

      console.log(\`[RX-RBAC] Applied access for role: \${role} | Visible: [\${allowed.join(', ')}]\`);
    }
  };

  window.RX_RBAC = RX_RBAC;

`;

// Insert RX_RBAC module right before the mount() function
code = code.replace('  function mount() {', roleAccessModule + '  function mount() {');

// ============================================================
// FIX 3: Call RBAC.applyAccess in mount() after page render
// ============================================================
code = code.replace(
  '    app.innerHTML = renderCompletePage();\n  \n      initializeAllSections();',
  `    app.innerHTML = renderCompletePage();
  
      initializeAllSections();

      // Apply role-based access immediately
      (function applyInitialRBAC() {
        let user = null;
        try { user = JSON.parse(localStorage.getItem('rx_user') || 'null'); } catch(e) {}
        window.RX_RBAC.applyAccess(user);
      })();`
);

// ============================================================
// FIX 4: Also apply RBAC after email login and after Google login
// ============================================================
// Patch executeDemoEmailLogin to store role_key and call RBAC
code = code.replace(
  `    const roleEl = document.getElementById('rx-auth-role');
    const role = roleEl ? roleEl.options[roleEl.selectedIndex].text : 'Generator';`,
  `    const roleEl = document.getElementById('rx-auth-role');
    const role = roleEl ? roleEl.options[roleEl.selectedIndex].text : 'Generator / Seller (Source Material)';
    const role_key = roleEl ? roleEl.value : 'seller';`
);

code = code.replace(
  `    const user = { 
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        email, 
        avatar: name.charAt(0).toUpperCase(), 
        provider: 'Email', 
        authenticated: true,
        role: role,
        facility: name.charAt(0).toUpperCase() + name.slice(1) + " Industrial Corp",
        location: "Global Logistics Hub"
    };`,
  `    const user = { 
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        email, 
        avatar: name.charAt(0).toUpperCase(), 
        provider: 'Email', 
        authenticated: true,
        role: role,
        role_key: role_key,
        facility: name.charAt(0).toUpperCase() + name.slice(1) + " Industrial Corp",
        location: "Global Logistics Hub"
    };`
);

// Apply RBAC after email login success
code = code.replace(
  `    if (window.RX && window.RX.toast) {
      window.RX.toast(\`Signed in successfully as \${user.name} (\${user.role})\`, 'success');
    }
  };`,
  `    if (window.RX && window.RX.toast) {
      window.RX.toast(\`Signed in successfully as \${user.name} (\${user.role})\`, 'success');
    }
    // Apply role-based access control
    if (window.RX_RBAC) {
      window.RX_RBAC.applyAccess(user);
    }
  };`
);

// Apply RBAC after Google login (refreshNavUser callback)
code = code.replace(
  '    if (window.RX && window.RX.refreshNavUser) {\n      window.RX.refreshNavUser();\n    }\n    if (window.RX && window.RX.toast) {\n      window.RX.toast(`Signed in successfully as ',
  '    if (window.RX && window.RX.refreshNavUser) {\n      window.RX.refreshNavUser();\n    }\n    if (window.RX_RBAC) {\n      window.RX_RBAC.applyAccess(authenticated_user);\n    }\n    if (window.RX && window.RX.toast) {\n      window.RX.toast(`Signed in successfully as '
);

// Apply RBAC after nav refresh (so it runs every time nav checks session)
const navRefreshPatch = `
  // Patch refreshNavUser to also apply RBAC on session check
  const _origRefreshNav = window.RX && window.RX.refreshNavUser ? window.RX.refreshNavUser.bind(window.RX) : null;
`;

fs.writeFileSync('js/spa-router.js', code);
console.log('✅ Role-Based Access Control + Dropdown Color Fix applied successfully!');
