/* ============================================================
   RESOURCEX — APPLICATION SHELL
   Injects navigation (mega menu + mobile menu), search modal
   and footer on every page. Keyboard accessible: Arrow keys,
   Escape, outside click. No dependencies.
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

  /* ======================== NAV DATA ============================ */

  var NAV = {
    direct: [
      { href: 'marketplace.html', label: 'Marketplace', mega: null },
      { href: 'materials.html', label: 'Materials', mega: 'materials' },
      { href: 'how-it-works.html', label: 'How It Works', mega: null },
      { href: 'material-journey.html', label: 'Material Journey', mega: null },
      { href: 'material-bank.html', label: 'Material Bank', mega: null },
      { href: 'intelligence.html', label: 'Intelligence', mega: null }
    ],
    mega: {
      materials: [
        {
          label: 'Solutions',
          links: [
            { href: 'solutions.html', title: 'Generators', desc: 'Publish surplus and byproduct streams' },
            { href: 'solutions.html#processors', title: 'Processors', desc: 'Recovery, sorting and pre-processing' },
            { href: 'solutions.html#manufacturers', title: 'Manufacturers', desc: 'Secondary feedstock for production' },
            { href: 'solutions.html#procurement', title: 'Procurement Teams', desc: 'Structured sourcing of industrial inputs' }
          ]
        },
        {
          label: 'Intelligence',
          links: [
            { href: 'intelligence.html', title: 'Net Value Matching', desc: 'Matches ranked by net value, not price alone' },
            { href: 'intelligence.html#compatibility', title: 'Material Compatibility', desc: 'Grade, form and volume alignment' },
            { href: 'material-journey.html', title: 'Material Journey', desc: 'Conceptual lifecycle view of a listing' }
          ]
        }
      ]
    }
  };

  /* ========================= HELPERS ============================ */

  function el(html) {
    var tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild;
  }

  function megaGroupHTML(group) {
    return '<div class="rx-mega-group"><div class="rx-mega-group-label">' + group.label + '</div><ul class="rx-mega-links" role="list">' +
      group.links.map(function (l) {
        return '<li><a href="' + l.href + '" class="rx-mega-link" role="menuitem">' +
          '<span class="rx-mega-link-title">' + l.title + '</span>' +
          (l.desc ? '<span class="rx-mega-link-desc">' + l.desc + '</span>' : '') +
          '</a></li>';
      }).join('') +
      '</ul></div>';
  }

  function megaMenuHTML(key) {
    var groups = NAV.mega[key] || [];
    return '<div class="rx-mega-menu" role="menu" aria-label="Materials sub-navigation">' +
      groups.map(megaGroupHTML).join('') + '</div>';
  }

  /* ========================== NAV =============================== */

  function buildNav() {
    var nav = el(
      '<nav class="rx-nav" aria-label="Primary">' +
      '<div class="rx-nav-inner">' +
      '<div class="rx-logo-slot"></div>' +
      '<ul class="rx-nav-links" role="list"></ul>' +
      '<div class="rx-nav-actions">' +
      '<button type="button" class="rx-nav-search-btn" aria-haspopup="dialog" aria-label="Search materials">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '<span>Search</span>' +
      '<kbd class="rx-kbd">/</kbd>' +
      '</button>' +
      '<a href="list-material.html" class="rx-btn rx-btn-technical rx-btn-sm">List Material</a>' +
      '<a href="dashboard.html" class="rx-btn rx-btn-secondary rx-btn-sm">Dashboard</a>' +
      '<button type="button" class="rx-nav-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="rx-mobile-menu">' +
      '<span></span><span></span><span></span>' +
      '</button>' +
      '</div>' +
      '</nav>' +
      '<div class="rx-mobile-menu" id="rx-mobile-menu" hidden>' +
      '<div class="rx-mobile-menu-inner"></div>' +
      '</div>'
    );

    // Logo
    nav.querySelector('.rx-logo-slot').appendChild(el(logoHTML()));

    // Nav links + mega menus
    var linksUl = nav.querySelector('.rx-nav-links');
    NAV.direct.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'rx-nav-item';
      if (item.mega) {
        li.innerHTML =
          '<button type="button" class="rx-nav-link rx-nav-link-trigger" aria-haspopup="true" aria-expanded="false">' +
          item.label +
          '<svg class="rx-nav-arrow" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 1l4 4 4-4"/></svg>' +
          '</button>' + megaMenuHTML(item.mega);
      } else {
        li.innerHTML = '<a href="' + item.href + '" class="rx-nav-link">' + item.label + '</a>';
        li.className = 'rx-nav-item';
      }
      linksUl.appendChild(li);
    });

    return nav;
  }

  /* ==================== MEGA MENU BEHAVIOR ====================== */

  function initMegaMenu(nav) {
    var items = nav.querySelectorAll('.rx-nav-item');
    var openItem = null;
    var closeTimer = null;

    function closeAll(except) {
      items.forEach(function (li) {
        if (li !== except) {
          li.classList.remove('open');
          var btn = li.querySelector('.rx-nav-link-trigger');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
      if (except !== openItem) openItem = null;
    }

    items.forEach(function (li) {
      var trigger = li.querySelector('.rx-nav-link-trigger');
      if (!trigger) return;

      // Desktop hover intent
      li.addEventListener('mouseenter', function () {
        if (window.innerWidth < 1025) return;
        clearTimeout(closeTimer);
        openItem = li;
        li.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        closeAll(li);
      });

      li.addEventListener('mouseleave', function (e) {
        if (window.innerWidth < 1025) return;
        closeTimer = setTimeout(function () {
          li.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          if (openItem === li) openItem = null;
        }, 120);
      });

      // Click / touch toggle (also used on mobile widths)
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = li.classList.contains('open');
        closeAll();
        li.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });

      // Keyboard: open + arrow into menu
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          li.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
          var first = li.querySelector('.rx-mega-link');
          if (first) first.focus();
        }
      });

      // Keyboard: close on Escape, return focus to trigger
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          li.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    });

    // Arrow navigation between mega links
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
          else {
            var trigger = list.closest('.rx-nav-item').querySelector('.rx-nav-link-trigger');
            if (trigger) trigger.focus();
          }
        }
      });
    });

    // Click outside closes menus
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.rx-nav-item')) closeAll();
    });

    // Escape closes everything (document level)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  /* ==================== MOBILE MENU ============================= */

  function buildMobileMenu(inner) {
    var groups = [
      { label: 'Marketplace', links: [
        ['marketplace.html', 'Browse Materials'],
        ['list-material.html', 'List Material'],
        ['matches.html', 'Find Matches'],
        ['material-bank.html', 'Material Bank']
      ] },
      { label: 'Platform', links: [
        ['intelligence.html', 'Intelligence'],
        ['how-it-works.html', 'How It Works'],
        ['materials.html', 'Materials']
      ] },
      { label: 'Solutions', links: [
        ['solutions.html', 'Generators'],
        ['solutions.html#processors', 'Processors'],
        ['solutions.html#manufacturers', 'Manufacturers'],
        ['solutions.html#procurement', 'Procurement Teams']
      ] },
      { label: 'Resources & Company', links: [
        ['resources.html', 'Resources'],
        ['about.html', 'About'],
        ['dashboard.html', 'Dashboard'],
        ['negotiations.html', 'Negotiations']
      ] }
    ];

    inner.innerHTML = groups.map(function (g) {
      return '<div class="rx-mobile-nav-group">' +
        '<div class="rx-mobile-nav-group-label">' + g.label + '</div>' +
        g.links.map(function (l) {
          return '<a href="' + l[0] + '" class="rx-mobile-nav-link">' + l[1] + '</a>';
        }).join('') +
        '</div>';
    }).join('') +
      '<div class="rx-mobile-menu-cta">' +
      '<a href="list-material.html" class="rx-btn rx-btn-primary rx-btn-lg">List a Material</a>' +
      '<a href="marketplace.html" class="rx-btn rx-btn-secondary rx-btn-lg">Explore Materials</a>' +
      '</div>';
  }

  /* ==================== SEARCH MODAL ============================ */

  function buildSearchModal() {
    var modal = el(
      '<div class="rx-search-modal" id="rx-search-modal" role="dialog" aria-modal="true" aria-label="Search materials" hidden>' +
      '<div class="rx-search-backdrop" data-search-close></div>' +
      '<div class="rx-search-panel" role="document">' +
      '<div class="rx-search-head">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '<input type="text" class="rx-search-input" placeholder="Search materials, grades, locations…" aria-label="Search materials" />' +
      '<button type="button" class="rx-search-esc" data-search-close aria-label="Close search">ESC</button>' +
      '</div>' +
      '<div class="rx-search-results"></div>' +
      '<div class="rx-search-hint">Search demo catalogue · Press <span class="rx-kbd">ESC</span> to close</div>' +
      '</div>' +
      '</div>'
    );
    document.body.appendChild(modal);

    var input = modal.querySelector('.rx-search-input');
    var results = modal.querySelector('.rx-search-results');

    function renderResults(q) {
      var data = (window.RX_DATA && window.RX_DATA.materials) || [];
      var query = q.trim().toLowerCase();
      var list = query
        ? data.filter(function (m) {
            return [m.name, m.grade, m.category, m.location, m.id].join(' ').toLowerCase().indexOf(query) !== -1;
          })
        : data;

      if (!list.length) {
        results.innerHTML = '<div class="rx-search-empty">No materials match “' + window.RX.escapeHTML(q) + '”</div>';
        return;
      }

      results.innerHTML = list.slice(0, 8).map(function (m) {
        return '<a href="materials.html?id=' + encodeURIComponent(m.id) + '" class="rx-search-result">' +
          '<span class="rx-search-result-id rx-mono-sm">' + window.RX.escapeHTML(m.id) + '</span>' +
          '<span class="rx-search-result-name">' + window.RX.escapeHTML(m.name) + '</span>' +
          '<span class="rx-search-result-loc">' + window.RX.escapeHTML(m.location) + '</span>' +
          '</a>';
      }).join('');
    }

    function open() {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      renderResults('');
      setTimeout(function () { input.focus(); }, 30);
    }

    function close() {
      modal.hidden = true;
      document.body.style.overflow = '';
      input.value = '';
    }

    modal.querySelectorAll('[data-search-close]').forEach(function (btn) {
      btn.addEventListener('click', close);
    });

    input.addEventListener('input', function () { renderResults(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); }
      if (e.key === 'Enter') {
        var first = results.querySelector('.rx-search-result');
        if (first) window.location.href = first.getAttribute('href');
      }
    });

    return { open: open };
  }

  /* ==================== FOOTER ================================== */

  function buildFooter() {
    var footer = el(
      '<footer class="rx-footer" role="contentinfo">' +
      '<div class="rx-container">' +
      '<div class="rx-footer-top">' +
      '<div class="rx-footer-brand">' +
      '<div class="rx-logo-slot-footer"></div>' +
      '<p class="rx-footer-tagline">Industrial Resources. Reimagined.</p>' +
      '<p class="rx-footer-sub">Where industrial materials find their next productive use.</p>' +
      '</div>' +
      '<div class="rx-footer-links">' +
      footerCol('Marketplace', [
        ['marketplace.html', 'Browse Materials'],
        ['list-material.html', 'List Material'],
        ['matches.html', 'Find Matches'],
        ['material-bank.html', 'Material Bank']
      ]) +
      footerCol('Platform', [
        ['material-journey.html', 'Material Journey'],
        ['intelligence.html', 'Intelligence'],
        ['matches.html', 'Net Value Matching'],
        ['dashboard.html', 'Dashboard']
      ]) +
      footerCol('Resources & Company', [
        ['how-it-works.html', 'How It Works'],
        ['resources.html', 'Resources'],
        ['about.html', 'About'],
        ['about.html#contact', 'Contact']
      ]) +
      '</div>' +
      '</div>' +
      '<div class="rx-footer-bottom">' +
      '<div class="rx-footer-legal">' +
      '<span class="rx-mono-sm rx-footer-copy">© <span class="rx-footer-year"></span> ResourceX</span>' +
      '<span class="rx-footer-sep">·</span>' +
      '<span class="rx-footer-disclaimer">All listings, matches and figures shown are demo data for illustration only.</span>' +
      '</div>' +
      '<span class="rx-badge-demo">Demo Platform</span>' +
      '</div>' +
      '</div>' +
      '</footer>'
    );
    footer.querySelector('.rx-logo-slot-footer').appendChild(el(logoHTML()));

    // dynamic year
    var yearEl = footer.querySelector('.rx-footer-year');
    yearEl.textContent = new Date().getFullYear();

    return footer;
  }

  function footerCol(label, links) {
    return '<div class="rx-footer-col">' +
      '<div class="rx-footer-col-label">' + label + '</div>' +
      links.map(function (l) {
        return '<a href="' + l[0] + '" class="rx-footer-link">' + l[1] + '</a>';
      }).join('') +
      '</div>';
  }

  /* ==================== PAGE BOOTSTRAP ========================== */

  function initShell() {
    document.body.classList.add('rx-has-shell');

    var navWrap = el('<div class="rx-nav-wrap"></div>');
    var nav = buildNav();
    navWrap.appendChild(nav);
    document.body.insertBefore(navWrap, document.body.firstChild);

    var mobileMenu = document.getElementById('rx-mobile-menu');
    buildMobileMenu(mobileMenu.querySelector('.rx-mobile-menu-inner'));

    initMegaMenu(nav);
    initMobileMenu(nav, mobileMenu);
    setActiveLink(nav);

    var search = buildSearchModal();
    var searchBtn = nav.querySelector('.rx-nav-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', search.open);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !isTypingTarget(e.target)) {
        e.preventDefault();
        search.open();
      }
    });

    document.body.appendChild(buildFooter());
    initNavScroll(nav);
  }

  function isTypingTarget(t) {
    return t.matches('input, textarea, select, [contenteditable="true"]');
  }

  /* ==================== MOBILE MENU BEHAVIOR ==================== */

  function initMobileMenu(nav, mobileMenu) {
    var toggles = nav.querySelectorAll('.rx-nav-toggle');

    function setOpen(open) {
      toggles.forEach(function (t) {
        t.classList.toggle('open', open);
        t.setAttribute('aria-expanded', String(open));
        t.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      });
      if (open) {
        mobileMenu.hidden = false;
        // double rAF so the transition can run
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { mobileMenu.classList.add('open'); });
        });
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(function () { if (!mobileMenu.classList.contains('open')) mobileMenu.hidden = true; }, 400);
      }
    }

    toggles.forEach(function (t) {
      t.addEventListener('click', function () {
        setOpen(!mobileMenu.classList.contains('open'));
      });
    });

    mobileMenu.querySelectorAll('.rx-mobile-nav-link, .rx-mobile-menu-cta a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) setOpen(false);
    });
  }

  /* ==================== ACTIVE LINK ============================= */

  function setActiveLink(nav) {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    var hash = window.location.hash;

    function matches(href) {
      var file = href.split('/').pop();
      if (file.indexOf('#') !== -1) {
        var parts = file.split('#');
        return parts[0] === page && ('#' + parts[1]) === hash;
      }
      return file === page && !hash;
    }

    nav.querySelectorAll('.rx-nav-link[href]').forEach(function (a) {
      if (matches(a.getAttribute('href'))) a.classList.add('active');
    });
  }

  /* ==================== NAV SCROLL STATE ======================== */

  function initNavScroll(nav) {
    var last = -1;
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY > 20 ? 1 : 0;
      if (scrolled !== last) {
        nav.classList.toggle('scrolled', scrolled === 1);
        last = scrolled;
      }
    }, { passive: true });
  }

  /* ==================== INIT ==================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShell);
  } else {
    initShell();
  }
})();
