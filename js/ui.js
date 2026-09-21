/* ============================================================
   RESOURCEX — SHARED UI UTILITIES
   Reveal-on-scroll, count-up, bars, toasts, tabs, copy, tabs.
   Loaded on every page. No dependencies.
   ============================================================ */

(function () {
  'use strict';

  window.RX = window.RX || {};

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.RX.reducedMotion = prefersReducedMotion;

  /* ---------------- Reveal on scroll ---------------- */

  function initReveal() {
    var els = document.querySelectorAll('.rx-reveal, .rx-reveal-left, .rx-reveal-right');
    if (!els.length) return;

    if (prefersReducedMotion || !window.IntersectionObserver) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  // Re-scan for reveal elements injected after initial load (e.g. by page renderers)
  window.RX.rescanReveals = initReveal;

  /* ---------------- Count-up ---------------- */

  function initCountUp() {
    var els = document.querySelectorAll('[data-count-up]');
    if (!els.length) return;

    if (prefersReducedMotion) {
      els.forEach(function (el) {
        el.textContent = formatCount(el, parseInt(el.getAttribute('data-count-up'), 10));
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count-up'), 10);
        var duration = parseInt(el.getAttribute('data-count-duration') || '1400', 10);
        observer.unobserve(el);
        animateCount(el, target, duration);
      });
    }, { threshold: 0.5 });

    els.forEach(function (el) { observer.observe(el); });
  }

  function formatCount(el, value) {
    var prefix = el.getAttribute('data-count-prefix') || '';
    var suffix = el.getAttribute('data-count-suffix') || '';
    return prefix + value.toLocaleString('en-IN') + suffix;
  }

  function animateCount(el, target, duration) {
    var startTime = performance.now();
    (function update(now) {
      var progress = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(el, Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(update);
    })(startTime);
  }

  /* ---------------- Animated bars (value / compatibility) ---------------- */

  function initBars(selector, attr) {
    var bars = document.querySelectorAll(selector);
    if (!bars.length) return;

    if (prefersReducedMotion) {
      bars.forEach(function (bar) {
        bar.style.width = (bar.getAttribute(attr) || 0) + '%';
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var bar = entry.target;
        observer.unobserve(bar);
        setTimeout(function () {
          bar.style.width = (bar.getAttribute(attr) || 0) + '%';
        }, parseInt(bar.getAttribute('data-delay') || '120', 10));
      });
    }, { threshold: 0.3 });

    bars.forEach(function (bar) {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }

  /* ---------------- Toasts ---------------- */

  var TOAST_ICONS = {
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    success: '<polyline points="20 6 9 17 4 12"/>',
    error: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
  };

  window.RX.toast = function (message, type) {
    type = type || 'info';
    var container = document.querySelector('.rx-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'rx-toast-container';
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'rx-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      '<span class="rx-toast-icon" aria-hidden="true">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      (TOAST_ICONS[type] || TOAST_ICONS.info) + '</svg></span>' +
      '<span class="rx-toast-text"></span>';
    toast.querySelector('.rx-toast-text').textContent = message;
    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('rx-toast-out');
      setTimeout(function () { toast.remove(); }, 350);
    }, 3500);
  };

  /* ---------------- Copy-to-clipboard ---------------- */

  function initCopyIds() {
    document.querySelectorAll('[data-copy]').forEach(function (el) {
      el.classList.add('rx-copyable');
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', 'Copy ' + el.getAttribute('data-copy'));

      function copy() {
        var text = el.getAttribute('data-copy') || el.textContent;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () {
            window.RX.toast('Copied ' + text, 'success');
          });
        }
      }

      el.addEventListener('click', copy);
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(); }
      });
    });
  }

  /* ---------------- Tabs ---------------- */

  window.RX.initTabs = function (tabsEl, onSwitch) {
    if (!tabsEl) return;
    var tabs = tabsEl.querySelectorAll('.rx-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        var panel = tab.getAttribute('data-panel');
        if (panel) {
          document.querySelectorAll('[data-panel-content]').forEach(function (el) {
            el.style.display = el.getAttribute('data-panel-content') === panel ? '' : 'none';
          });
        }
        if (onSwitch) onSwitch(tab);
      });
    });
  };

  /* ---------------- Formatting helpers ---------------- */

  window.RX.formatINR = function (amount, decimals) {
    return '₹' + Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: decimals || 0,
      maximumFractionDigits: decimals == null ? 2 : decimals
    });
  };

  window.RX.formatQty = function (qty, unit) {
    return Number(qty).toLocaleString('en-IN') + ' ' + (unit || 'kg');
  };

  window.RX.escapeHTML = function (str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------------- Init ---------------- */

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initCountUp();
    initBars('.rx-value-bar[data-width]', 'data-width');
    initBars('.rx-compat-bar-fill[data-pct]', 'data-pct');
    initCopyIds();
  });
})();
