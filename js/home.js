/* ============================================================
   RESOURCEX — HOMEPAGE
   Renders the flow rail and marketplace preview from the
   demo data layer. Hero + network handled by hero-network.js.
   ============================================================ */

(function () {
  'use strict';

  window.RX = window.RX || {};

  function esc(str) {
    return window.RX.escapeHTML(str);
  }

  /* ---------------- Material card (technical fingerprint) ---------------- */

  function fingerprintGlyphs(id) {
    // Deterministic glyph heights from the ID — same ID, same fingerprint.
    var seed = 0;
    for (var i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) % 99991;
    var glyphs = '';
    for (var j = 0; j < 14; j++) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      var h = 5 + (seed % 14);
      glyphs += '<span style="height:' + h + 'px"></span>';
      seed = (seed / 2147483648) * 99991;
    }
    return glyphs;
  }

  function materialCard(m) {
    var apps = m.applications.slice(0, 3).map(function (a) {
      return '<span class="rx-app-chip">' + esc(a) + '</span>';
    }).join('');

    return (
      '<a class="rx-material-card rx-card-technical" href="material-detail.html?id=' + encodeURIComponent(m.id) + '" aria-label="View material ' + esc(m.name) + '">' +
        '<div class="rx-material-card-body">' +
          '<div class="rx-material-card-id">' +
            '<span class="rx-mono-sm rx-text-brass">' + esc(m.id) + '</span>' +
            (m.status === 'banked' ? '<span class="rx-badge-status banked">Banked</span>' : '<span class="rx-badge-status active">Active</span>') +
          '</div>' +
          '<h3 class="rx-material-card-name">' + esc(m.name) + '</h3>' +
          '<div class="rx-fingerprint" aria-hidden="true">' +
            '<div class="rx-fingerprint-glyphs">' + fingerprintGlyphs(m.id) + '</div>' +
            '<span class="rx-fingerprint-caption">Material fingerprint · ' + esc(m.grade) + ' · ' + esc(m.category) + '</span>' +
          '</div>' +
          '<div class="rx-material-card-specs">' +
            spec('Grade', m.grade, true) +
            spec('Quantity', window.RX.formatQty(m.quantity, m.unit), true) +
            spec('Condition', m.condition) +
            spec('Location', m.location) +
          '</div>' +
          '<div class="rx-material-card-apps">' +
            '<span class="rx-material-spec-label">Applications</span>' +
            '<div class="rx-app-chips">' + apps + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="rx-material-card-footer">' +
          '<span class="rx-material-price">' + m.currency + m.askingPrice.toFixed(2) +
            '<span class="rx-material-price-unit">' + esc(m.priceUnit) + '</span></span>' +
          '<span class="rx-material-card-hint">View listing →</span>' +
          '</div>' +
      '</a>'
    );
  }

  function spec(label, value, mono) {
    return '<div class="rx-material-spec">' +
      '<span class="rx-material-spec-label">' + esc(label) + '</span>' +
      '<span class="rx-material-spec-value' + (mono ? ' rx-mono-value' : '') + '">' + esc(value) + '</span>' +
      '</div>';
  }

  /* ---------------- Flow rail ---------------- */

  function flowStage(s, i) {
    return (
      '<div class="rx-flow-stage rx-reveal rx-delay-' + ((i % 6) + 1) + '">' +
        '<div class="rx-flow-stage-num">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div class="rx-flow-stage-label">' + esc(s.label) + '</div>' +
        '<p class="rx-flow-stage-desc">' + esc(s.desc) + '</p>' +
      '</div>'
    );
  }

  /* ---------------- Init ---------------- */

  document.addEventListener('DOMContentLoaded', function () {
    // Flow stages
    var rail = document.getElementById('rx-flow-rail');
    if (rail && window.RX_DATA && window.RX_DATA.flowStages) {
      rail.innerHTML = window.RX_DATA.flowStages.map(flowStage).join('');
    }

    // Material preview
    var grid = document.getElementById('rx-material-grid');
    if (grid && window.RX_DATA && window.RX_DATA.materials) {
      grid.innerHTML = window.RX_DATA.materials.slice(0, 6).map(materialCard).join('');
    }

    // Categories Grid
    var catGrid = document.getElementById('home-categories-container');
    if (catGrid && window.RX_DATA && window.RX_DATA.categories) {
      catGrid.innerHTML = window.RX_DATA.categories.map(function (c) {
        return (
          '<a href="marketplace.html?category=' + encodeURIComponent(c.slug || c.name.toLowerCase()) + '" class="rx-cat-card">' +
            '<div class="rx-cat-head">' +
              '<span class="rx-cat-icon">' + (c.icon || '⬡') + '</span>' +
              '<span class="rx-cat-count">' + c.count + ' lots</span>' +
            '</div>' +
            '<div>' +
              '<h3 class="rx-cat-name">' + esc(c.name) + '</h3>' +
              '<p class="rx-cat-desc">' + esc(c.desc || '') + '</p>' +
            '</div>' +
          '</a>'
        );
      }).join('');
    }

    // Re-observe reveal elements added after initial ui.js scan
    if (window.RX.rescanReveals) window.RX.rescanReveals();
  });
})();
