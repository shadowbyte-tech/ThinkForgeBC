const fs = require('fs');
let code = fs.readFileSync('js/spa-router.js', 'utf8');

const newModal = `    <!-- 1. OFFICIAL GOOGLE IDENTITY SERVICES & RESOURCE-X B2B MODAL -->
    <div class="google-modal-overlay" id="spa-login-modal" role="dialog" aria-modal="true" aria-labelledby="google-modal-title" onclick="if(event.target===this) window.RX_SPA.closeLoginModal()">
      <div class="google-account-modal" role="document" style="max-width: 440px; border: 1px solid var(--rx-stone-400); background: var(--rx-bg-dark); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
        <button type="button" class="google-modal-close-btn" onclick="window.RX_SPA.closeLoginModal()" aria-label="Close dialog" style="color: var(--rx-stone-300);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div style="text-align:center; margin-bottom:1.5rem;">
          <div class="google-brand-glow" style="background: none; border: none; box-shadow: none; margin-bottom: 0;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--rx-brass-400)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2 id="google-modal-title" class="google-modal-title" style="color: var(--rx-text-light); font-size: 1.5rem; letter-spacing: -0.02em;">Access ResourceX</h2>
          <p class="google-modal-subtitle" style="color: var(--rx-stone-300);">Secure industrial byproduct exchange</p>
        </div>

        <div style="margin-bottom: 1.5rem; text-align: left;">
            <label style="display: block; font-size: 0.85rem; color: var(--rx-stone-300); margin-bottom: 0.5rem;">Select your organizational role</label>
            <select id="rx-auth-role" style="width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--rx-stone-400); border-radius: 8px; color: var(--rx-text-light); outline: none;">
                <option value="seller">Generator / Seller (Source Material)</option>
                <option value="buyer">Processor / Buyer (Procure Material)</option>
                <option value="logistics">Logistics / Transport Partner</option>
            </select>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
            <input id="rx-demo-email" type="email" placeholder="Work Email" style="width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--rx-stone-400); border-radius: 8px; color: var(--rx-text-light); outline: none;" />
            <input type="password" placeholder="Password" style="width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--rx-stone-400); border-radius: 8px; color: var(--rx-text-light); outline: none;" />
            <button type="button" class="rx-btn rx-btn-primary" style="width: 100%; padding: 0.75rem; border-radius: 8px; margin-top: 0.5rem;" onclick="window.RX_SPA.executeDemoEmailLogin()">Sign In to Portal</button>
        </div>

        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; color: var(--rx-stone-400); font-size: 0.85rem;">
            <div style="flex: 1; height: 1px; background: var(--rx-stone-400); opacity: 0.3;"></div>
            <span style="margin: 0 1rem; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.1em;">Or use enterprise SSO</span>
            <div style="flex: 1; height: 1px; background: var(--rx-stone-400); opacity: 0.3;"></div>
        </div>

        <!-- Official Google Identity Services Generated Button Mount -->
        <div id="g_id_signin_mount" style="display:flex; justify-content:center; align-items:center; min-height:50px; margin-bottom: 1rem;">
          <!-- Rendered dynamically by google.accounts.id.renderButton -->
        </div>

        <div id="google-auth-status" style="font-size:0.85rem; text-align:center; min-height:1.2rem; margin-bottom:0.5rem; color:var(--rx-brass-400);"></div>

        <div class="google-modal-footer" style="background: rgba(0,0,0,0.2); border-top: 1px solid var(--rx-stone-400); margin: 1.5rem -1.5rem -1.5rem; padding: 1rem 1.5rem; border-radius: 0 0 16px 16px;">
          <p style="margin: 0; font-size: 0.75rem; color: var(--rx-stone-300);">
            By continuing, you agree to ResourceX's <a href="#" style="color: var(--rx-brass-400); text-decoration: none;">Terms of Service</a>, <a href="#" style="color: var(--rx-brass-400); text-decoration: none;">Privacy Policy</a>, and <a href="#" style="color: var(--rx-brass-400); text-decoration: none;">Chain-of-Custody Agreement</a>.
          </p>
        </div>
      </div>
    </div>`;

code = code.replace(/<!-- 1\. OFFICIAL GOOGLE IDENTITY SERVICES MODAL -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, newModal);

// Also add the executeDemoEmailLogin function
const loginFunc = `
  window.RX_SPA.executeDemoEmailLogin = function () {
    const email = document.getElementById('rx-demo-email')?.value || 'user@resourcex.com';
    const roleEl = document.getElementById('rx-auth-role');
    const role = roleEl ? roleEl.options[roleEl.selectedIndex].text : 'Generator';
    const name = email.split('@')[0];
    
    // Create the session based on role
    const user = { 
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        email, 
        avatar: name.charAt(0).toUpperCase(), 
        provider: 'Email', 
        authenticated: true,
        role: role,
        facility: name.charAt(0).toUpperCase() + name.slice(1) + " Industrial Corp",
        location: "Global Logistics Hub"
    };
    
    localStorage.setItem('rx_user', JSON.stringify(user));
    window.RX_SPA.closeLoginModal();

    if (window.RX && window.RX.refreshNavUser) {
      window.RX.refreshNavUser();
    }
    if (window.RX && window.RX.toast) {
      window.RX.toast(\`Signed in successfully as \${user.name} (\${user.role})\`, 'success');
    }
  };
`;

if (!code.includes('executeDemoEmailLogin')) {
    code = code.replace('window.RX_SPA.executeGoogleLogin = function', loginFunc + '\n  window.RX_SPA.executeGoogleLogin = function');
}

fs.writeFileSync('js/spa-router.js', code);
