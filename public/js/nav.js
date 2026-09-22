/* ============================================================
   RESOURCEX — APPLICATION SHELL (single source of truth)
   Injects brand navigation (mega menus + mobile menu + search),
   and footer on every page. Pages mount via #rx-nav-container /
   #rx-footer-container; if absent, nav/footer auto-mount on body.
   Keyboard: ArrowDown/Up in menus, Escape closes, outside click.
   No dependencies.
   ============================================================ */

(function () {
  'use strict';

  window.RX = window.RX || {};

  /* ============================ LOGO ============================ */

  window.RX.logoSVG =
    '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<rect x="2" y="2" width="12" height="12" rx="1" fill="#A88A52" opacity="0.9"/>' +
    '<rect x="18" y="2" width="12" height="12" rx="1" fill="#204936" opacity="0.85"/>' +
    '<rect x="2" y="18" width="12" height="12" rx="1" fill="#204936" opacity="0.85"/>' +
    '<rect x="18" y="18" width="12" height="12" rx="1" fill="#A88A52" opacity="0.3"/>' +
    '<line x1="14" y1="8" x2="18" y2="8" stroke="#A88A52" stroke-width="1.5"/>' +
    '<line x1="8" y1="14" x2="8" y2="18" stroke="#204936" stroke-width="1.5"/>' +
    '<line x1="24" y1="14" x2="24" y2="18" stroke="#204936" stroke-width="1.5"/>' +
    '<line x1="14" y1="24" x2="18" y2="24" stroke="#A88A52" stroke-width="1.5" opacity="0.5"/>' +
    '</svg>';

  function logoHTML() {
    return '<a href="index.html" class="rx-logo" aria-label="ResourceX — home">' +
      '<span class="rx-logo-mark">' + window.RX.logoSVG + '</span>' +
      '<span class="rx-logo-text">RESOURCE<span class="rx-logo-x">X</span></span>' +
      '</a>';
  }

  /* ========================= NAV DATA =========================== */

  var SEARCH_ICON =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/>' +
    '<line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  var ARROW_ICON =
    '<svg class="rx-nav-arrow" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 1l4 4 4-4"/></svg>';

  var MEGA = {
    marketplace: {
      aria: 'Marketplace sub-navigation',
      groups: [
        {
          label: 'Marketplace',
          links: [
            { href: 'marketplace.html', title: 'Browse Materials', desc: 'Search the demo catalogue by grade, form and location' },
            { href: 'list-material.html', title: 'List Material', desc: 'Publish a surplus or byproduct stream' },
            { href: 'matches.html', title: 'Find Matches', desc: 'Potential buyers ranked by net value' },
            { href: 'material-bank.html', title: 'Material Bank', desc: 'Hold material until the right buyer emerges' }
          ]
        }
      ]
    },
    intelligence: {
      aria: 'Intelligence sub-navigation',
      groups: [
        {
          label: 'Intelligence',
          links: [
            { href: 'match-explorer.html', title: 'Net Value Matching', desc: 'Matches ranked by net value, not ask price' },
            { href: 'intelligence.html#compatibility', title: 'Material Compatibility', desc: 'Grade, form, volume and distance alignment' },
            { href: 'material-journey.html', title: 'Material Journey', desc: 'Conceptual lifecycle view of a listing' }
          ]
        }
      ]
    },
    resources: {
      aria: 'Resources sub-navigation',
      groups: [
        {
          label: 'Resources',
          links: [
            { href: 'how-it-works.html', title: 'How It Works', desc: 'Platform overview and approach' },
            { href: 'resources.html', title: 'Industry Insights', desc: 'Perspectives on secondary material flows' },
            { href: 'resources.html#guides', title: 'Guides', desc: 'Practical playbooks for generators and buyers' },
            { href: 'resources.html#documentation', title: 'Documentation', desc: 'Concept reference and demo data notes' }
          ]
        }
      ]
    },
    about: {
      aria: 'About sub-navigation',
      groups: [
        {
          label: 'About',
          links: [
            { href: 'about.html#approach', title: 'Our Approach', desc: 'Compatibility-first, net-value exchange' },
            { href: 'about.html#circular', title: 'Circular Industry', desc: 'Why industrial reuse matters' },
            { href: 'about.html#contact', title: 'Contact', desc: 'Reach the ResourceX team' }
          ]
        }
      ]
    }
  };

  var NAV_ITEMS = [
    { href: 'marketplace.html', label: 'Marketplace', mega: 'marketplace' },
    { href: 'materials.html', label: 'Materials' },
    { href: 'how-it-works.html', label: 'How It Works' },
    { href: 'material-journey.html', label: 'Material Journey' },
    { href: 'material-bank.html', label: 'Material Bank' },
    { href: 'intelligence.html', label: 'Intelligence', mega: 'intelligence' },
    { href: 'resources.html', label: 'Resources', mega: 'resources' }
  ];

  var MOBILE_GROUPS = [
    { label: 'Marketplace', links: [
      ['marketplace.html', 'Browse Materials'],
      ['list-material.html', 'List Material'],
      ['matches.html', 'Find Matches'],
      ['material-bank.html', 'Material Bank']
    ] },
    { label: 'Platform', links: [
      ['materials.html', 'Materials'],
      ['material-journey.html', 'Material Journey'],
      ['intelligence.html', 'Intelligence'],
      ['how-it-works.html', 'How It Works']
    ] },
    { label: 'Resources & Company', links: [
      ['resources.html', 'Resources'],
      ['about.html', 'About'],
      ['dashboard.html', 'Dashboard'],
      ['negotiations.html', 'Negotiations']
    ] }
  ];

  function megaMenuHTML(key) {
    var cfg = MEGA[key];
    if (!cfg) return '';
    return '<div class="rx-mega-menu" role="menu" aria-label="' + cfg.aria + '">' +
      '<div class="rx-mega-inner">' +
      cfg.groups.map(function (group) {
        return '<div class="rx-mega-group">' +
          '<div class="rx-mega-group-label">' + group.label + '</div>' +
          '<ul class="rx-mega-links" role="list">' +
          group.links.map(function (l) {
            return '<li><a href="' + l.href + '" class="rx-mega-link" role="menuitem" tabindex="-1">' +
              '<span class="rx-mega-link-title">' + l.title + '</span>' +
              (l.desc ? '<span class="rx-mega-link-desc">' + l.desc + '</span>' : '') +
              '</a></li>';
          }).join('') +
          '</ul></div>';
      }).join('') +
      '</div></div>';
  }

  /* ========================== NAV =============================== */

  window.RX.navHTML = function () {
    return `
<nav class="rx-nav" aria-label="Primary ResourceX navigation">
  <div class="rx-nav-inner">
    ${logoHTML()}

    <ul class="rx-nav-links" role="list">
      ${NAV_ITEMS.map(function (item) {
        if (item.mega) {
          return '<li class="rx-nav-item">' +
            '<button type="button" class="rx-nav-link rx-nav-link-trigger" aria-haspopup="true" aria-expanded="false">' +
            item.label + ARROW_ICON +
            '</button>' + megaMenuHTML(item.mega) +
            '</li>';
        }
        return '<li class="rx-nav-item"><a href="' + item.href + '" class="rx-nav-link" data-page="' + item.href + '">' + item.label + '</a></li>';
      }).join('')}
    </ul>

    <div class="rx-nav-actions">
      <button type="button" class="rx-nav-search-btn" aria-haspopup="dialog" aria-label="Search materials">
        ${SEARCH_ICON}
        <span>Search</span>
        <kbd class="rx-kbd">/</kbd>
      </button>
      <a href="dashboard.html" class="rx-btn rx-btn-secondary rx-btn-sm" data-page="dashboard.html">Dashboard</a>
      <a href="list-material.html" class="rx-btn rx-btn-primary rx-btn-sm" data-page="list-material.html">List Material</a>
      <button class="rx-nav-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="rx-mobile-menu" type="button">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>

<div class="rx-mobile-menu" id="rx-mobile-menu" role="dialog" aria-label="Mobile navigation menu" aria-hidden="true">
  <div class="rx-mobile-menu-inner">
    ${MOBILE_GROUPS.map(function (g) {
      return '<div class="rx-mobile-nav-group">' +
        '<div class="rx-mobile-nav-group-label">' + g.label + '</div>' +
        g.links.map(function (l) {
          return '<a href="' + l[0] + '" class="rx-mobile-nav-link">' + l[1] + '</a>';
        }).join('') +
        '</div>';
    }).join('')}
    <div class="rx-mobile-menu-cta">
      <a href="list-material.html" class="rx-btn rx-btn-primary rx-btn-lg">List a Material</a>
      <a href="marketplace.html" class="rx-btn rx-btn-secondary rx-btn-lg">Explore Materials</a>
    </div>
  </div>
</div>`;
  };

  /* ==================== FOOTER ================================== */

  function footerCol(label, links) {
    return '<div class="rx-footer-col">' +
      '<div class="rx-footer-col-label">' + label + '</div>' +
      links.map(function (l) {
        return '<a href="' + l[0] + '" class="rx-footer-link">' + l[1] + '</a>';
      }).join('') +
      '</div>';
  }

  window.RX.footerHTML = function () {
    var year = new Date().getFullYear();
    return `
<footer class="rx-footer" role="contentinfo">
  <div class="rx-container">
    <div class="rx-footer-top">
      <div class="rx-footer-brand">
        ${logoHTML()}
        <p class="rx-footer-tagline">Industrial Resources. Reimagined.</p>
        <p class="rx-footer-sub">Where industrial materials find their next productive use.</p>
      </div>
      <div class="rx-footer-links">
        ${footerCol('Marketplace', [
          ['marketplace.html', 'Marketplace'],
          ['materials.html', 'Materials'],
          ['list-material.html', 'List Material'],
          ['material-bank.html', 'Material Bank']
        ])}
        ${footerCol('Platform', [
          ['material-journey.html', 'Material Journey'],
          ['intelligence.html', 'Intelligence'],
          ['matches.html', 'Find Matches'],
          ['dashboard.html', 'Dashboard']
        ])}
        ${footerCol('Resources & Company', [
          ['how-it-works.html', 'How It Works'],
          ['resources.html', 'Resources'],
          ['about.html', 'About'],
          ['about.html#contact', 'Contact']
        ])}
      </div>
    </div>
    <div class="rx-footer-bottom">
      <div class="rx-footer-legal">
        <span class="rx-mono-sm" style="color: var(--rx-stone-600);">&copy; <span class="rx-footer-year">${year}</span> ResourceX</span>
        <span class="rx-footer-sep">&middot;</span>
        <span class="rx-footer-disclaimer">All listings, matches and figures shown are demo data for illustration only.</span>
      </div>
      <span class="rx-badge-demo">Demo Platform</span>
    </div>
  </div>
</footer>`;
  };

  /* ==================== SEARCH MODAL ============================ */

  function buildSearchModal() {
    var modal = document.createElement('div');
    modal.className = 'rx-search-modal';
    modal.id = 'rx-search-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Search materials');
    modal.hidden = true;
    modal.style.display = 'none';
    modal.innerHTML =
      '<div class="rx-search-backdrop" data-search-close></div>' +
      '<div class="rx-search-panel" role="document">' +
      '<div class="rx-search-head">' + SEARCH_ICON +
      '<input type="text" class="rx-search-input" placeholder="Search materials, grades, locations…" aria-label="Search materials" />' +
      '<button type="button" class="rx-search-esc" data-search-close aria-label="Close search">ESC</button>' +
      '</div>' +
      '<div class="rx-search-results"></div>' +
      '<div class="rx-search-hint">Search demo catalogue &middot; Press <span class="rx-kbd">ESC</span> to close</div>' +
      '</div>';
    document.body.appendChild(modal);

    var input = modal.querySelector('.rx-search-input');
    var results = modal.querySelector('.rx-search-results');

    function esc(str) { return window.RX.escapeHTML ? window.RX.escapeHTML(str) : str; }

    function renderResults(q) {
      var data = (window.RX_DATA && window.RX_DATA.materials) || [];
      var query = q.trim().toLowerCase();
      var list = query
        ? data.filter(function (m) {
            return [m.name, m.grade, m.category, m.location, m.id].join(' ').toLowerCase().indexOf(query) !== -1;
          })
        : data;

      if (!list.length) {
        results.innerHTML = '<div class="rx-search-empty">No materials match &ldquo;' + esc(q) + '&rdquo;</div>';
        return;
      }

      results.innerHTML = list.slice(0, 8).map(function (m) {
        return '<a href="material-detail.html?id=' + encodeURIComponent(m.id) + '" class="rx-search-result">' +
          '<span class="rx-search-result-id rx-mono-sm">' + esc(m.id) + '</span>' +
          '<span class="rx-search-result-name">' + esc(m.name) + '</span>' +
          '<span class="rx-search-result-loc">' + esc(m.location) + '</span>' +
          '</a>';
      }).join('');
    }

    function open() {
      modal.hidden = false;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      renderResults('');
      setTimeout(function () { input.focus(); }, 30);
    }

    function close() {
      modal.hidden = true;
      modal.style.display = 'none';
      document.body.style.overflow = '';
      input.value = '';
    }

    modal.querySelectorAll('[data-search-close]').forEach(function (btn) {
      btn.addEventListener('click', close);
    });
    input.addEventListener('input', function () { renderResults(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter') {
        var first = results.querySelector('.rx-search-result');
        if (first) window.location.href = first.getAttribute('href');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden && modal.style.display !== 'none') {
        close();
      }
    });

    return { open: open };
  }

  function isTypingTarget(t) {
    return t.matches && t.matches('input, textarea, select, [contenteditable="true"]');
  }

  /* ==================== NAV BEHAVIORS =========================== */

  function setupNavInteractions() {
    var nav = document.querySelector('.rx-nav');
    if (!nav) return;

    /* ---- scroll state ---- */
    var lastScrolled = null;
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY > 20;
      if (scrolled !== lastScrolled) {
        nav.classList.toggle('scrolled', scrolled);
        lastScrolled = scrolled;
      }
    }, { passive: true });

    /* ---- mega menu: hover + click + keyboard ---- */
    var items = Array.prototype.slice.call(nav.querySelectorAll('.rx-nav-item'));
    var closeTimer = null;

    function closeAll(except) {
      items.forEach(function (li) {
        if (li === except) return;
        li.classList.remove('open');
        var btn = li.querySelector('.rx-nav-link-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }

    items.forEach(function (li) {
      var trigger = li.querySelector('.rx-nav-link-trigger');
      if (!trigger) return;

      li.addEventListener('mouseenter', function () {
        if (window.innerWidth < 1025) return;
        clearTimeout(closeTimer);
        closeAll(li);
        li.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      });

      li.addEventListener('mouseleave', function () {
        if (window.innerWidth < 1025) return;
        closeTimer = setTimeout(function () {
          li.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }, 140);
      });

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = li.classList.contains('open');
        closeAll();
        li.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });

      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          closeAll(li);
          li.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
          var first = li.querySelector('.rx-mega-link');
          if (first) first.focus();
        }
      });

      li.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          li.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    });

    // Arrow navigation inside mega menus
    nav.querySelectorAll('.rx-mega-links').forEach(function (list) {
      list.addEventListener('keydown', function (e) {
        var links = Array.prototype.slice.call(list.querySelectorAll('.rx-mega-link'));
        var idx = links.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (idx >= 0 && idx < links.length - 1) links[idx + 1].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (idx > 0) links[idx - 1].focus();
        } else if (e.key === 'Escape') {
          var item = list.closest('.rx-nav-item');
          var btn = item && item.querySelector('.rx-nav-link-trigger');
          if (btn) btn.focus();
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('.rx-nav-item')) closeAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });

    /* ---- mobile menu ---- */
    var toggle = nav.querySelector('.rx-nav-toggle');
    var mobileMenu = document.getElementById('rx-mobile-menu') || document.querySelector('.rx-mobile-menu');

    if (toggle && mobileMenu) {
      function setOpen(open) {
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        mobileMenu.classList.toggle('open', open);
        mobileMenu.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
      }

      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        setOpen(!mobileMenu.classList.contains('open'));
      });

      mobileMenu.querySelectorAll('.rx-mobile-nav-link, .rx-mobile-menu-cta a').forEach(function (link) {
        link.addEventListener('click', function () { setOpen(false); });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) setOpen(false);
      });
      document.addEventListener('click', function (e) {
        if (mobileMenu.classList.contains('open') &&
            !mobileMenu.contains(e.target) && !toggle.contains(e.target)) {
          setOpen(false);
        }
      });
    }

    /* ---- active link ---- */
    var page = window.location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('.rx-nav-link[href], .rx-mobile-nav-link[href]').forEach(function (a) {
      var href = a.getAttribute('href').split('#')[0];
      if (href === page) a.classList.add('active');
    });

    /* ---- search ---- */
    var search = buildSearchModal();
    var searchBtn = nav.querySelector('.rx-nav-search-btn');
    if (searchBtn) searchBtn.addEventListener('click', search.open);
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !isTypingTarget(e.target)) {
        e.preventDefault();
        search.open();
      }
    });
  }

  /* ==================== RESOURCE TRACE UX ======================= */

  window.RX.getActiveMaterialId = function () {
    var params = new URLSearchParams(window.location.search);
    var fromUrl = params.get('id') || params.get('material');
    if (fromUrl) {
      try { localStorage.setItem('rx_trace_id', fromUrl); } catch (e) {}
      return fromUrl;
    }
    var fromStorage = null;
    try { fromStorage = localStorage.getItem('rx_trace_id'); } catch (e) {}
    return fromStorage || 'RX-AL-9402';
  };

  window.RX.setActiveMaterialId = function (id) {
    if (!id) return;
    try { localStorage.setItem('rx_trace_id', id); } catch (e) {}
  };

  window.RX.getActiveMaterial = function () {
    var id = window.RX.getActiveMaterialId();
    if (window.RX_DATA && window.RX_DATA.materialsMap && window.RX_DATA.materialsMap[id]) {
      return window.RX_DATA.materialsMap[id];
    }
    if (window.RX_DATA && window.RX_DATA.materials) {
      var found = window.RX_DATA.materials.find(function (m) { return m.id === id; });
      if (found) return found;
      return window.RX_DATA.materials[0];
    }
    return null;
  };

  window.RX.traceBarHTML = function () {
    var mat = window.RX.getActiveMaterial();
    if (!mat) return '';
    var activeId = mat.id;
    var curPage = window.location.pathname.split('/').pop() || 'index.html';
    var allMats = (window.RX_DATA && window.RX_DATA.materials) || [];

    var qtyDisplay = (mat.quantity || 5000).toLocaleString() + ' ' + (mat.unit || 'kg');
    var locDisplay = typeof mat.location === 'object' ? (mat.location.city + ', ' + mat.location.state) : String(mat.location || '');

    var options = allMats.map(function (m) {
      return '<option value="' + m.id + '"' + (m.id === activeId ? ' selected' : '') + '>' +
        m.id + ' — ' + m.name + '</option>';
    }).join('');

    return `
<div class="rx-trace-bar" role="region" aria-label="Active Resource Trace">
  <div class="rx-trace-inner">
    <div class="rx-trace-info">
      <span class="rx-trace-badge">
        <span class="rx-trace-pulse" aria-hidden="true"></span>
        Active Trace
      </span>
      <span class="rx-trace-id">${activeId}</span>
      <span class="rx-trace-sep">·</span>
      <span class="rx-trace-name">${mat.name}</span>
      <span class="rx-trace-sep">·</span>
      <span class="rx-trace-meta">${qtyDisplay} (${locDisplay})</span>
    </div>

    <div class="rx-trace-nav">
      <a href="material-detail.html?id=${encodeURIComponent(activeId)}" class="rx-trace-link ${curPage === 'material-detail.html' ? 'active' : ''}">
        Specs
      </a>
      <a href="match-explorer.html?id=${encodeURIComponent(activeId)}" class="rx-trace-link ${curPage === 'match-explorer.html' ? 'active' : ''}">
        Net Value Matches
      </a>
      <a href="material-journey.html?id=${encodeURIComponent(activeId)}" class="rx-trace-link ${curPage === 'material-journey.html' ? 'active' : ''}">
        Lifecycle Journey
      </a>
      <a href="material-bank.html?id=${encodeURIComponent(activeId)}" class="rx-trace-link ${curPage === 'material-bank.html' ? 'active' : ''}">
        Bank / Offers
      </a>
      <select class="rx-trace-select" aria-label="Switch tracked material" onchange="window.RX.switchActiveMaterial(this.value)">
        ${options}
      </select>
    </div>
  </div>
</div>`;
  };

  window.RX.switchActiveMaterial = function (newId) {
    if (!newId) return;
    window.RX.setActiveMaterialId(newId);
    var curPage = window.location.pathname.split('/').pop() || 'marketplace.html';
    // If on homepage or about, navigate to material-detail.html?id=...
    if (curPage === 'index.html' || curPage === '' || curPage === 'about.html' || curPage === 'how-it-works.html' || curPage === 'resources.html') {
      window.location.href = 'material-detail.html?id=' + encodeURIComponent(newId);
      return;
    }
    // Otherwise reload current page with new id
    var url = new URL(window.location.href);
    url.searchParams.set('id', newId);
    window.location.href = url.toString();
  };

  /* ==================== AUTO MOUNT ============================== */

  window.RX.mountTraceBar = function () {
    var curPage = window.location.pathname.split('/').pop() || 'index.html';
    var showTraceOn = ['material-detail.html', 'match-explorer.html', 'material-journey.html', 'material-bank.html', 'dashboard.html', 'intelligence.html', 'marketplace.html', 'list-material.html', 'negotiations.html', 'how-it-works.html', 'resources.html', 'solutions.html'];
    if (showTraceOn.indexOf(curPage) !== -1) {
      if (!document.querySelector('.rx-trace-bar')) {
        var navContainer = document.getElementById('rx-nav-container');
        var navEl = document.querySelector('.rx-nav');
        var targetEl = navContainer || navEl;
        if (targetEl) {
          targetEl.insertAdjacentHTML('afterend', window.RX.traceBarHTML());
        }
      }
    }
  };

  function autoMountNavAndFooter() {
    var navContainer = document.getElementById('rx-nav-container');
    if (navContainer && !navContainer.hasChildNodes()) {
      navContainer.innerHTML = window.RX.navHTML();
    } else if (!document.querySelector('.rx-nav')) {
      document.body.insertAdjacentHTML('afterbegin', window.RX.navHTML());
    }

    window.RX.mountTraceBar();
    setTimeout(window.RX.mountTraceBar, 60);

    var footerContainer = document.getElementById('rx-footer-container');
    if (footerContainer && !footerContainer.hasChildNodes()) {
      footerContainer.innerHTML = window.RX.footerHTML();
    } else if (!document.querySelector('.rx-footer')) {
      document.body.insertAdjacentHTML('beforeend', window.RX.footerHTML());
    }

    setupNavInteractions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMountNavAndFooter);
  } else {
    autoMountNavAndFooter();
  }
})();
