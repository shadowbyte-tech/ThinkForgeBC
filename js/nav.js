/* ============================================================
   RESOURCEX — SHARED NAVIGATION, FOOTER & UI UTILITIES
   Industrial Resources. Reimagined.
   ============================================================ */

(function () {
  'use strict';

  window.RX = window.RX || {};

  /* ---- SVG LOGO MARK ---- */
  window.RX.logoSVG = '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<rect x="2" y="2" width="12" height="12" rx="2" fill="#A88A52" opacity="0.95"/>' +
    '<rect x="18" y="2" width="12" height="12" rx="2" fill="#173A2B" stroke="#2D7050" stroke-width="1.5"/>' +
    '<rect x="2" y="18" width="12" height="12" rx="2" fill="#173A2B" stroke="#2D7050" stroke-width="1.5"/>' +
    '<rect x="18" y="18" width="12" height="12" rx="2" fill="#A88A52" opacity="0.35"/>' +
    '<line x1="14" y1="8" x2="18" y2="8" stroke="#A88A52" stroke-width="1.5"/>' +
    '<line x1="8" y1="14" x2="8" y2="18" stroke="#2D7050" stroke-width="1.5"/>' +
    '<line x1="24" y1="14" x2="24" y2="18" stroke="#2D7050" stroke-width="1.5"/>' +
    '<line x1="14" y1="24" x2="18" y2="24" stroke="#A88A52" stroke-width="1.5" stroke-dasharray="2 2"/>' +
    '</svg>';

  /* ---- SHARED NAV HTML GENERATOR ---- */
  window.RX.navHTML = function () {
    return `
<nav class="rx-nav" role="navigation" aria-label="Primary ResourceX navigation">
  <div class="rx-nav-inner">
    <a href="#home" class="rx-logo" onclick="window.RX_SPA && window.RX_SPA.scrollToId('home'); return false;" aria-label="ResourceX Home">
      <div class="rx-logo-mark">${window.RX.logoSVG}</div>
      <span class="rx-logo-text">Resource<span>X</span></span>
    </a>

    <ul class="rx-nav-links" role="list">
      <li class="rx-nav-item">
        <a href="#home" class="rx-nav-link active" data-scroll="home" onclick="window.RX_SPA && window.RX_SPA.scrollToId('home'); return false;">Home</a>
      </li>
      <li class="rx-nav-item">
        <a href="#marketplace" class="rx-nav-link" data-scroll="marketplace" onclick="window.RX_SPA && window.RX_SPA.scrollToId('marketplace'); return false;">Marketplace</a>
      </li>
      <li class="rx-nav-item">
        <button class="rx-nav-link" type="button" aria-haspopup="true" aria-expanded="false">
          Solutions
          <svg class="rx-nav-arrow" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l4 4 4-4"/></svg>
        </button>
        <div class="rx-mega-menu" role="menu">
          <div class="rx-mega-inner">
            <div class="rx-mega-group">
              <div class="rx-mega-group-label">For Material Generators</div>
              <ul class="rx-mega-links">
                <li><a href="javascript:void(0)" onclick="window.RX_SPA && window.RX_SPA.openListModal(); return false;" class="rx-mega-link"><span class="rx-mega-link-title">List a Material</span><span class="rx-mega-link-desc">Register industrial byproduct or surplus stream</span></a></li>
                <li><a href="#material-bank" onclick="window.RX_SPA && window.RX_SPA.scrollToId('material-bank'); return false;" class="rx-mega-link"><span class="rx-mega-link-title">Material Bank</span><span class="rx-mega-link-desc">Maintain visibility with full seller price control</span></a></li>
                <li><a href="#dashboard" onclick="window.RX_SPA && window.RX_SPA.scrollToId('dashboard'); return false;" class="rx-mega-link"><span class="rx-mega-link-title">Generator Dashboard</span><span class="rx-mega-link-desc">Monitor lots, incoming bids, and journeys</span></a></li>
              </ul>
            </div>
            <div class="rx-mega-group">
              <div class="rx-mega-group-label">For Buyers &amp; Processors</div>
              <ul class="rx-mega-links">
                <li><a href="#marketplace" onclick="window.RX_SPA && window.RX_SPA.scrollToId('marketplace'); return false;" class="rx-mega-link"><span class="rx-mega-link-title">Browse Materials</span><span class="rx-mega-link-desc">Search by grade, form, distance and purity</span></a></li>
                <li><a href="#net-value" onclick="window.RX_SPA && window.RX_SPA.scrollToId('net-value'); return false;" class="rx-mega-link"><span class="rx-mega-link-title">Net Value Matching</span><span class="rx-mega-link-desc">Compare true landed economics vs gross bids</span></a></li>
                <li><a href="#material-journey" onclick="window.RX_SPA && window.RX_SPA.scrollToId('material-journey'); return false;" class="rx-mega-link"><span class="rx-mega-link-title">Material Traceability</span><span class="rx-mega-link-desc">Transport sensitivity &amp; reuse pathway analytics</span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </li>
      <li class="rx-nav-item">
        <a href="#net-value" class="rx-nav-link" data-scroll="net-value" onclick="window.RX_SPA && window.RX_SPA.scrollToId('net-value'); return false;">Net Value Match</a>
      </li>
      <li class="rx-nav-item">
        <a href="#material-journey" class="rx-nav-link" data-scroll="material-journey" onclick="window.RX_SPA && window.RX_SPA.scrollToId('material-journey'); return false;">Material Journey</a>
      </li>
      <li class="rx-nav-item">
        <a href="#material-bank" class="rx-nav-link" data-scroll="material-bank" onclick="window.RX_SPA && window.RX_SPA.scrollToId('material-bank'); return false;">Material Bank</a>
      </li>
      <li class="rx-nav-item">
        <a href="#about" class="rx-nav-link" data-scroll="about" onclick="window.RX_SPA && window.RX_SPA.scrollToId('about'); return false;">About</a>
      </li>
      <li class="rx-nav-item">
        <a href="#dashboard" class="rx-nav-link" data-scroll="dashboard" onclick="window.RX_SPA && window.RX_SPA.scrollToId('dashboard'); return false;">Dashboard</a>
      </li>
    </ul>

    <div class="rx-nav-actions">
      <div id="rx-nav-auth-slot" style="display:inline-flex; align-items:center;">
        <a href="javascript:void(0)" onclick="window.RX_SPA && window.RX_SPA.openLoginModal(); return false;" class="rx-btn rx-btn-sm" style="background: transparent; border: 1px solid rgba(201, 196, 184, 0.2); color: var(--rx-stone-300);" data-page="login">Log In</a>
      </div>
      <a href="#dashboard" class="rx-btn rx-btn-secondary rx-btn-sm" data-scroll="dashboard" onclick="window.RX_SPA && window.RX_SPA.scrollToId('dashboard'); return false;">Dashboard</a>
      <a href="javascript:void(0)" onclick="window.RX_SPA && window.RX_SPA.openListModal(); return false;" class="rx-btn rx-btn-primary rx-btn-sm" data-page="list-material">List Material</a>
      <button class="rx-nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" type="button">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>

<div class="rx-mobile-menu" role="dialog" aria-label="Mobile navigation menu" aria-hidden="true">
  <div class="rx-mobile-menu-inner">
    <div class="rx-mobile-nav-group">
      <div class="rx-mobile-nav-group-label">Authentication</div>
      <div id="rx-mobile-auth-slot">
        <a href="javascript:void(0)" onclick="window.RX_SPA && window.RX_SPA.openLoginModal(); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link" style="color: var(--rx-brass-400); font-weight: 600;">Sign In / Portal Access &rarr;</a>
      </div>
    </div>
    <div class="rx-mobile-nav-group">
      <div class="rx-mobile-nav-group-label">Navigation</div>
      <a href="#home" onclick="window.RX_SPA && window.RX_SPA.scrollToId('home'); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link">Home</a>
      <a href="#marketplace" onclick="window.RX_SPA && window.RX_SPA.scrollToId('marketplace'); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link">Browse Materials</a>
      <a href="javascript:void(0)" onclick="window.RX_SPA && window.RX_SPA.openListModal(); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link">List a Material</a>
      <a href="#net-value" onclick="window.RX_SPA && window.RX_SPA.scrollToId('net-value'); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link">Net Value Matching</a>
      <a href="#material-journey" onclick="window.RX_SPA && window.RX_SPA.scrollToId('material-journey'); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link">Material Journey</a>
      <a href="#material-bank" onclick="window.RX_SPA && window.RX_SPA.scrollToId('material-bank'); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link">Material Bank</a>
      <a href="#about" onclick="window.RX_SPA && window.RX_SPA.scrollToId('about'); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link">About ResourceX</a>
      <a href="#dashboard" onclick="window.RX_SPA && window.RX_SPA.scrollToId('dashboard'); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link">Dashboard</a>
    </div>
    <div class="rx-mobile-nav-group">
      <div class="rx-mobile-nav-group-label">Platform &amp; Tools</div>
      <a href="#material-journey" onclick="window.RX_SPA && window.RX_SPA.scrollToId('material-journey'); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link">Material Journey</a>
      <a href="#dashboard" onclick="window.RX_SPA && window.RX_SPA.scrollToId('dashboard'); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link">Dashboard</a>
    </div>
    <div class="rx-mobile-nav-group">
      <div class="rx-mobile-nav-group-label">Organization</div>
      <a href="#about" onclick="window.RX_SPA && window.RX_SPA.scrollToId('about'); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link">About ResourceX</a>
    </div>
    <div style="margin-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem;">
      <div id="rx-mobile-action-slot">
        <button type="button" id="rx-mobile-login-btn" onclick="window.RX_SPA && window.RX_SPA.openLoginModal(); document.querySelector('.rx-mobile-menu')?.classList.remove('open');" class="rx-btn rx-btn-primary" style="width:100%;">Sign In / Log In</button>
      </div>
      <button type="button" onclick="window.RX_SPA && window.RX_SPA.openListModal(); document.querySelector('.rx-mobile-menu')?.classList.remove('open');" class="rx-btn rx-btn-secondary">List a Material</button>
      <button type="button" onclick="window.RX_SPA && window.RX_SPA.scrollToId('marketplace'); document.querySelector('.rx-mobile-menu')?.classList.remove('open');" class="rx-btn" style="background: transparent; border: 1px solid var(--rx-stone-500); color: var(--rx-ivory-800); text-align: center;">Explore Materials</button>
    </div>
  </div>
</div>`;
  };

  /* ---- SHARED FOOTER HTML GENERATOR ---- */
  window.RX.footerHTML = function () {
    const currentYear = new Date().getFullYear();
    return `
<footer class="rx-footer" role="contentinfo">
  <div class="rx-container">
    <div class="rx-footer-top">
      <div class="rx-footer-brand">
        <a href="#home" onclick="window.RX_SPA && window.RX_SPA.scrollToId('home'); return false;" class="rx-logo" aria-label="ResourceX Home">
          <div class="rx-logo-mark">${window.RX.logoSVG}</div>
          <span class="rx-logo-text">Resource<span>X</span></span>
        </a>
        <p class="rx-footer-tagline">Industrial Resources. Reimagined.</p>
        <p class="rx-footer-sub">Where industrial byproducts find their next productive use.</p>
      </div>
      <div class="rx-footer-links">
        <div class="rx-footer-col">
          <div class="rx-footer-col-label">Marketplace</div>
          <a href="#marketplace" onclick="window.RX_SPA && window.RX_SPA.scrollToId('marketplace'); return false;" class="rx-footer-link">Browse Materials</a>
          <a href="javascript:void(0)" onclick="window.RX_SPA && window.RX_SPA.openListModal(); return false;" class="rx-footer-link">List a Material</a>
          <a href="#net-value" onclick="window.RX_SPA && window.RX_SPA.scrollToId('net-value'); return false;" class="rx-footer-link">Find a Match</a>
          <a href="#material-bank" onclick="window.RX_SPA && window.RX_SPA.scrollToId('material-bank'); return false;" class="rx-footer-link">Material Bank</a>
        </div>
        <div class="rx-footer-col">
          <div class="rx-footer-col-label">Platform</div>
          <a href="#net-value" onclick="window.RX_SPA && window.RX_SPA.scrollToId('net-value'); return false;" class="rx-footer-link">Net Value Matching</a>
          <a href="#material-journey" onclick="window.RX_SPA && window.RX_SPA.scrollToId('material-journey'); return false;" class="rx-footer-link">Material Journey</a>
          <a href="#dashboard" onclick="window.RX_SPA && window.RX_SPA.scrollToId('dashboard'); return false;" class="rx-footer-link">Dashboard</a>
        </div>
        <div class="rx-footer-col">
          <div class="rx-footer-col-label">Company</div>
          <a href="#about" onclick="window.RX_SPA && window.RX_SPA.scrollToId('about'); return false;" class="rx-footer-link">About ResourceX</a>
        </div>
      </div>
    </div>
    <div class="rx-footer-bottom">
      <div class="rx-footer-legal">
        <span class="rx-mono-sm" style="color: var(--rx-stone-500, #8D8A82);">&copy; <span class="rx-footer-year">${currentYear}</span> ResourceX</span>
        <span class="rx-footer-sep">&middot;</span>
        <span class="rx-footer-disclaimer">All listings, matches, and data shown are for demonstration purposes only.</span>
      </div>
      <div class="rx-footer-badge">
        <span class="rx-badge-demo">Demo Platform</span>
      </div>
    </div>
  </div>
</footer>`;
  };

  /* ---- TOAST NOTIFICATIONS ---- */
  const TOAST_ICONS = {
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    success: '<polyline points="20 6 9 17 4 12"/>',
    error: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
  };

  window.RX.toast = function (message, type) {
    type = type || 'info';
    let container = document.querySelector('.rx-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'rx-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'rx-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      '<span class="rx-toast-icon" aria-hidden="true">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      (TOAST_ICONS[type] || TOAST_ICONS.info) + '</svg></span>' +
      '<span class="rx-toast-text">' + message + '</span>';
    container.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.35s ease';
      setTimeout(function () { toast.remove(); }, 350);
    }, 3500);
  };

  /* ---- FORMATTING HELPERS ---- */
  window.RX.formatINR = function (amount, decimals) {
    return '₹' + Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: decimals || 0,
      maximumFractionDigits: decimals == null ? 2 : decimals
    });
  };

  window.RX.formatQty = function (qty, unit) {
    return Number(qty).toLocaleString('en-IN') + ' ' + (unit || 'kg');
  };

  /* ---- TABS HELPER ---- */
  window.RX.initTabs = function (tabsEl, onSwitch) {
    if (!tabsEl) return;
    const tabs = tabsEl.querySelectorAll('.rx-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const panel = tab.getAttribute('data-panel');
        if (panel) {
          document.querySelectorAll('[data-panel-content]').forEach(function (el) {
            el.style.display = el.getAttribute('data-panel-content') === panel ? '' : 'none';
          });
        }
        if (onSwitch) onSwitch(tab);
      });
    });
  };

  /* ---- NAV & INTERACTION BEHAVIORS ---- */
  function setupNavInteractions() {
    const nav = document.querySelector('.rx-nav');
    if (!nav) return;

    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    const toggle = nav.querySelector('.rx-nav-toggle');
    const mobileMenu = document.querySelector('.rx-mobile-menu');

    if (toggle && mobileMenu) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = toggle.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    }

    document.querySelectorAll('.rx-mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (toggle) toggle.classList.remove('open');
        if (mobileMenu) {
          mobileMenu.classList.remove('open');
          mobileMenu.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', function (e) {
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        if (!mobileMenu.contains(e.target) && !toggle.contains(e.target)) {
          toggle.classList.remove('open');
          mobileMenu.classList.remove('open');
          mobileMenu.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.rx-nav-link, .rx-mobile-nav-link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPath || link.getAttribute('data-page') === currentPath) {
        link.classList.add('active');
      }
    });

    document.querySelectorAll('.rx-nav-item button.rx-nav-link').forEach(function (btn) {
      const parent = btn.closest('.rx-nav-item');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const wasOpen = parent.classList.contains('open');
        document.querySelectorAll('.rx-nav-item').forEach(function (item) {
          item.classList.remove('open');
          const b = item.querySelector('button.rx-nav-link');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          parent.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', function () {
      document.querySelectorAll('.rx-nav-item').forEach(function (item) {
        item.classList.remove('open');
        const b = item.querySelector('button.rx-nav-link');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Dedicated Logout Function */
  window.RX.logout = async function () {
    const apiBase = (window.location.port === '5000' || (!window.location.port && window.location.protocol.startsWith('http'))) ? '' : 'http://localhost:5000';
    try {
      await fetch(apiBase + '/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}

    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {}
    }

    localStorage.removeItem('rx_user');
    window.RX.refreshNavUser();
    if (window.RX && window.RX.toast) {
      window.RX.toast('Signed out successfully.', 'info');
    }
    if (window.RX_SPA && window.RX_SPA.scrollToId) {
      window.RX_SPA.scrollToId('home');
    }
  };

  /* Check Google Auth Session & Synchronize All UI Surfaces */
  window.RX.refreshNavUser = function () {
    try {
      const userStr = localStorage.getItem('rx_user');
      let user = null;
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {}
      }
      
      const nav = document.querySelector('.rx-nav');
      const navSlot = document.getElementById('rx-nav-auth-slot');
      const loginBtn = nav ? nav.querySelector('a[data-page="login"]') : document.querySelector('a[data-page="login"]');
      const mobileAuthSlot = document.getElementById('rx-mobile-auth-slot');
      const mobileActionSlot = document.getElementById('rx-mobile-action-slot');

      if (user && user.name) {
        // --- AUTHENTICATED STATE ---
        const avatarHtml = user.picture
          ? `<img src="${user.picture}" alt="${user.name}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;border:1.5px solid #C4AD7A;display:inline-block;vertical-align:middle;" referrerpolicy="no-referrer">`
          : `<span style="width:24px;height:24px;border-radius:50%;background:#1A73E8;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;vertical-align:middle;">${user.avatar || user.name.charAt(0)}</span>`;

        // 1. Desktop Navbar: Hide "Log In" button completely, display user profile pill & Sign Out
        const userNavPill = `
          <div id="rx-nav-user-pill" style="display:inline-flex; align-items:center; gap:8px; padding:4px 12px 4px 6px; border-radius:24px; background:rgba(20,24,22,0.85); border:1px solid rgba(196,173,122,0.35); color:#F2EFE7; font-size:0.85rem; font-family:'Space Grotesk',sans-serif;">
            ${avatarHtml}
            <span style="font-weight:600; max-width:130px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#F2EFE7;">${user.name.split(' ')[0]}</span>
            <button type="button" onclick="window.RX.logout()" title="Sign out" style="background:transparent; border:none; color:#A8A5A0; font-size:0.75rem; cursor:pointer; padding:0 0 0 6px; border-left:1px solid rgba(201,196,184,0.2); font-family:'JetBrains Mono',monospace; transition:color 0.2s;" onmouseover="this.style.color='#C4AD7A'" onmouseout="this.style.color='#A8A5A0'">Sign Out</button>
          </div>
        `;

        if (navSlot) {
          navSlot.innerHTML = userNavPill;
        } else if (loginBtn) {
          loginBtn.outerHTML = `<div id="rx-nav-auth-slot" style="display:inline-flex;align-items:center;">${userNavPill}</div>`;
        }

        // 2. Mobile Menu Profile
        if (mobileAuthSlot) {
          mobileAuthSlot.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; padding:8px 0;">
              ${avatarHtml}
              <div style="display:flex; flex-direction:column;">
                <span style="font-weight:600; color:#F2EFE7; font-size:0.92rem;">${user.name}</span>
                <span style="font-size:0.75rem; color:#A8A5A0; font-family:'JetBrains Mono',monospace;">${user.email || 'Verified Partner'}</span>
              </div>
            </div>
          `;
        }
        if (mobileActionSlot) {
          mobileActionSlot.innerHTML = `
            <button type="button" onclick="window.RX.logout(); document.querySelector('.rx-mobile-menu')?.classList.remove('open');" class="rx-btn rx-btn-secondary" style="border:1px solid rgba(201,196,184,0.3); color:#F2EFE7; width:100%;">Sign Out (${user.name.split(' ')[0]})</button>
          `;
        }

        // 3. Update Hero Section & Dashboard in SPA Router
        if (window.RX_SPA && window.RX_SPA.updateHeroAuthSlot) {
          window.RX_SPA.updateHeroAuthSlot(user);
        }
        if (window.RX_SPA && window.RX_SPA.updateDashboardUser) {
          window.RX_SPA.updateDashboardUser(user);
        }

      } else {
        // --- LOGGED OUT / UNAUTHENTICATED STATE ---
        const defaultLoginBtn = `
          <a href="javascript:void(0)" onclick="window.RX_SPA && window.RX_SPA.openLoginModal(); return false;" class="rx-btn rx-btn-sm" style="background: transparent; border: 1px solid rgba(201, 196, 184, 0.2); color: var(--rx-stone-300);" data-page="login">Log In</a>
        `;

        if (navSlot) {
          navSlot.innerHTML = defaultLoginBtn;
        }

        if (mobileAuthSlot) {
          mobileAuthSlot.innerHTML = `
            <a href="javascript:void(0)" onclick="window.RX_SPA && window.RX_SPA.openLoginModal(); document.querySelector('.rx-mobile-menu')?.classList.remove('open'); return false;" class="rx-mobile-nav-link" style="color: var(--rx-brass-400); font-weight: 600;">Sign In / Portal Access &rarr;</a>
          `;
        }
        if (mobileActionSlot) {
          mobileActionSlot.innerHTML = `
            <button type="button" id="rx-mobile-login-btn" onclick="window.RX_SPA && window.RX_SPA.openLoginModal(); document.querySelector('.rx-mobile-menu')?.classList.remove('open');" class="rx-btn rx-btn-primary" style="width:100%;">Sign In / Log In</button>
          `;
        }

        // 3. Restore Hero Section & Dashboard in SPA Router
        if (window.RX_SPA && window.RX_SPA.updateHeroAuthSlot) {
          window.RX_SPA.updateHeroAuthSlot(null);
        }
        if (window.RX_SPA && window.RX_SPA.updateDashboardUser) {
          window.RX_SPA.updateDashboardUser(null);
        }
      }
    } catch (e) {
      console.error('refreshNavUser error:', e);
    }
  };

  /* ---- INITIALIZE ON DOMContentLoaded ---- */
  function autoMountNavAndFooter() {
    const navContainer = document.getElementById('rx-nav-container');
    if (navContainer && !navContainer.hasChildNodes()) {
      navContainer.innerHTML = window.RX.navHTML();
    }

    const footerContainer = document.getElementById('rx-footer-container');
    if (footerContainer && !footerContainer.hasChildNodes()) {
      footerContainer.innerHTML = window.RX.footerHTML();
    }

    setupNavInteractions();
    window.RX.refreshNavUser();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMountNavAndFooter);
  } else {
    autoMountNavAndFooter();
  }

})();
