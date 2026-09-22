/* ============================================================
   RESOURCEX — HERO NETWORK VISUALIZATION
   Conceptual diagram: FACTORY → MATERIAL → PROCESSOR →
   MANUFACTURER → NEW PRODUCT. SVG based, no dependencies.
   - Not a live view: illustrative topology, labeled as such.
   - Respects prefers-reduced-motion (renders a static diagram).
   - Animation loop pauses when offscreen or tab hidden.
   ============================================================ */

(function () {
  'use strict';

  window.RX = window.RX || {};

  var NS = 'http://www.w3.org/2000/svg';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOBILE_MQ = window.matchMedia('(max-width: 860px)');

  function svgEl(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'text') el.textContent = attrs[k];
        else el.setAttribute(k, attrs[k]);
      });
    }
    return el;
  }

  function pad(n, w) {
    n = String(Math.max(0, Math.round(n)));
    while (n.length < w) n = '0' + n;
    return n;
  }

  /* --------- Curved edge path between two points --------- */

  function edgePath(a, b, bend) {
    var mx = (a.x + b.x) / 2;
    var my = (a.y + b.y) / 2;
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var len = Math.hypot(dx, dy) || 1;
    var nx = -dy / len;
    var ny = dx / len;
    var off = bend || 18;
    return 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) +
      ' Q' + (mx + nx * off).toFixed(1) + ' ' + (my + ny * off).toFixed(1) +
      ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
  }

  /* ----------------- Diagram builder --------------------- */

  function buildDiagram(host, readout, compact) {
    var net = window.RX_DATA && window.RX_DATA.network;
    if (!net) return null;

    var W = compact ? 380 : 720;
    var H = compact ? 620 : 560;
    var PADX = compact ? 34 : 46;
    var PADY = compact ? 46 : 40;

    var positions = {};
    net.stages.forEach(function (s) {
      positions[s.id] = {
        x: PADX + (s.x / 100) * (W - PADX * 2),
        y: PADY + (s.y / 100) * (H - PADY * 2)
      };
    });

    var svg = svgEl('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      class: 'rx-net-svg',
      role: 'img',
      'aria-label': 'Conceptual ResourceX network: factory produces material, which flows through a processor and manufacturer into a new product.'
    });

    // ---- Ruler ticks (top + left) ----
    var rulers = svgEl('g', { class: 'rx-net-rulers' });
    var step = compact ? 40 : 60;
    for (var tx = step; tx < W - step / 2; tx += step) {
      rulers.appendChild(svgEl('line', { x1: tx, y1: 0, x2: tx, y2: 5, class: 'rx-net-tick' }));
    }
    for (var ty = step; ty < H - step / 2; ty += step) {
      rulers.appendChild(svgEl('line', { x1: 0, y1: ty, x2: 5, y2: ty, class: 'rx-net-tick' }));
    }
    svg.appendChild(rulers);

    // ---- Edges ----
    var edgesG = svgEl('g', { class: 'rx-net-edges' });
    var edgeMeta = [];
    net.edges.forEach(function (e) {
      var a = positions[e.from];
      var b = positions[e.to];
      if (!a || !b) return;
      var isAlt = e.label === 'alt';
      var bend = isAlt ? (compact ? 26 : 34) : (compact ? 16 : 22);
      var path = svgEl('path', {
        d: edgePath(a, b, bend),
        class: 'rx-net-edge' + (isAlt ? ' rx-net-edge-alt' : '')
      });
      edgesG.appendChild(path);
      edgeMeta.push({ path: path, isAlt: isAlt });
    });
    svg.appendChild(edgesG);

    // ---- Nodes ----
    var nodesG = svgEl('g', { class: 'rx-net-nodes' });
    var nodeMeta = [];

    net.stages.forEach(function (s, i) {
      var p = positions[s.id];
      var g = svgEl('g', {
        class: 'rx-net-node rx-net-node-' + s.role,
        tabindex: '0',
        transform: 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')'
      });

      g.appendChild(svgEl('circle', { r: 15, class: 'rx-net-ring' }));
      g.appendChild(svgEl('circle', { r: 15, class: 'rx-net-pulse', style: 'animation-delay:' + (i * 0.9) + 's' }));
      g.appendChild(svgEl('rect', { x: -5.5, y: -5.5, width: 11, height: 11, class: 'rx-net-core' }));

      // index chip
      g.appendChild(svgEl('text', {
        x: 0, y: compact ? 26 : 30,
        'text-anchor': 'middle',
        class: 'rx-net-index',
        text: 'N' + (i + 1)
      }));

      // label — placed toward the nearest horizontal edge of the canvas
      var labelAnchor = p.x > W * 0.72 ? 'end' : (p.x < W * 0.28 ? 'start' : 'middle');
      var lx = labelAnchor === 'end' ? -(compact ? 14 : 20) : (labelAnchor === 'start' ? (compact ? 14 : 20) : 0);
      var ly = p.y > H * 0.75 ? -(compact ? 26 : 30) : (compact ? 26 : 30);

      g.appendChild(svgEl('text', {
        x: lx, y: ly,
        'text-anchor': labelAnchor,
        class: 'rx-net-label',
        text: s.label
      }));

      var roleText = svgEl('text', {
        x: lx, y: ly + (ly < 0 ? -14 : 14),
        'text-anchor': labelAnchor,
        class: 'rx-net-role',
        text: s.roleLabel
      });
      g.appendChild(roleText);

      g.setAttribute('aria-label', s.label + ' — ' + s.roleLabel);
      nodesG.appendChild(g);
      nodeMeta.push({ id: s.id, stage: s, g: g });
    });
    svg.appendChild(nodesG);

    // ---- Corner registration marks ----
    var corners = svgEl('g', { class: 'rx-net-corners' });
    var c = compact ? 10 : 16;
    [
      [c, c, 1, 1], [W - c, c, -1, 1], [c, H - c, 1, -1], [W - c, H - c, -1, -1]
    ].forEach(function (k) {
      corners.appendChild(svgEl('path', {
        d: 'M' + (k[0] + k[2] * 12) + ' ' + k[1] + ' L' + k[0] + ' ' + k[1] + ' L' + k[0] + ' ' + (k[1] + k[3] * 12),
        class: 'rx-net-corner'
      }));
    });
    svg.appendChild(corners);

    host.innerHTML = '';
    host.appendChild(svg);

    /* ---------------- Readout behavior ---------------- */

    function setActive(meta) {
      nodeMeta.forEach(function (n) { n.g.classList.toggle('active', n === meta); });
      edgeMeta.forEach(function (em) {
        var connected = meta && em.path.getAttribute('data-from') === meta.id;
        // simple highlight: edges touching this node
        if (meta) {
          var touches =
            (em.fromId === meta.id || em.toId === meta.id);
          em.path.classList.toggle('rx-net-edge-hot', !!touches);
        } else {
          em.path.classList.remove('rx-net-edge-hot');
        }
      });
      if (meta && readout) {
        readout.innerHTML =
          '<span class="rx-readout-chip rx-mono-sm">' + meta.stage.label + '</span>' +
          '<span class="rx-readout-body"><strong>' + meta.stage.roleLabel + '</strong>' +
          '<span>' + (meta.stage.desc || '') + '</span></span>';
      } else if (readout) {
        readout.innerHTML =
          '<span class="rx-readout-chip rx-mono-sm">READOUT</span>' +
          '<span class="rx-readout-body"><strong>Network idle</strong>' +
          '<span>Select a node to inspect its role in the flow.</span></span>';
      }
    }

    nodeMeta.forEach(function (meta) {
      ['mouseenter', 'focus', 'click'].forEach(function (evt) {
        meta.g.addEventListener(evt, function () { setActive(meta); });
      });
      meta.g.addEventListener('blur', function () { setActive(null); });
    });
    setActive(null);

    // attach edge endpoints for highlight logic
    edgeMeta.forEach(function (em, i) {
      var e = net.edges[i];
      em.fromId = e.from;
      em.toId = e.to;
      em.path.setAttribute('data-from', e.from);
    });

    return { svg: svg, edgeMeta: edgeMeta, nodeMeta: nodeMeta };
  }

  /* ----------------- Entrance + particles ---------------- */

  function startAnimation(built) {
    if (!built) return;

    var edges = built.edgeMeta;
    var nodes = built.nodeMeta;

    // Edge draw-in
    edges.forEach(function (em, i) {
      var len = em.path.getTotalLength();
      if (REDUCED) return; // leave fully drawn
      em.path.style.strokeDasharray = String(len);
      em.path.style.strokeDashoffset = String(len);
      em.path.getBoundingClientRect(); // force layout
      em.path.style.transition =
        'stroke-dashoffset ' + (1.1 + i * 0.18) + 's cubic-bezier(0.45, 0, 0.55, 1) ' + (0.25 + i * 0.28) + 's';
      em.path.style.strokeDashoffset = '0';
    });

    // Node entrance
    nodes.forEach(function (n, i) {
      if (REDUCED) return;
      n.g.style.opacity = '0';
      n.g.style.transition = 'opacity 0.7s ease ' + (0.5 + i * 0.3) + 's';
      requestAnimationFrame(function () { n.g.style.opacity = '1'; });
    });

    if (REDUCED) return;

    // Particles traveling along primary edges
    var particles = [];
    edges.forEach(function (em) {
      if (em.isAlt) return;
      var dot = svgEl('circle', { r: 2.4, class: 'rx-net-particle' });
      built.svg.appendChild(dot);
      particles.push({
        el: dot,
        path: em.path,
        len: em.path.getTotalLength(),
        t: Math.random() * 0.8,
        dur: 2.6 + Math.random() * 1.6
      });
    });

    var running = false;
    var last = 0;

    function tick(ts) {
      if (!running) return;
      if (!last) last = ts;
      var dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;

      particles.forEach(function (p) {
        p.t = (p.t + dt / p.dur) % 1;
        var pt = p.path.getPointAtLength(p.t * p.len);
        var fade = p.t < 0.08 ? p.t / 0.08 : p.t > 0.92 ? (1 - p.t) / 0.08 : 1;
        p.el.setAttribute('cx', pt.x.toFixed(1));
        p.el.setAttribute('cy', pt.y.toFixed(1));
        p.el.setAttribute('opacity', (fade * 0.85).toFixed(2));
      });

      requestAnimationFrame(tick);
    }

    function setRunning(on) {
      if (on === running) return;
      running = on;
      last = 0;
      if (on) requestAnimationFrame(tick);
    }

    // Pause offscreen + hidden tab
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        setRunning(entries[0].isIntersecting && !document.hidden);
      }, { threshold: 0 }).observe(built.svg);
    }
    document.addEventListener('visibilitychange', function () {
      setRunning(!document.hidden);
    });

    setRunning(true);
  }

  /* ----------------- Public init ------------------------- */

  window.RX.initHeroNetwork = function (hostId, readoutId) {
    var host = document.getElementById(hostId);
    var readout = document.getElementById(readoutId);
    if (!host || !window.RX_DATA || !window.RX_DATA.network) return;

    var built = null;
    var currentCompact = null;

    function render() {
      var compact = MOBILE_MQ.matches;
      if (compact === currentCompact && built) return;
      currentCompact = compact;
      built = buildDiagram(host, readout, compact);
      if (built) startAnimation(built);
    }

    render();

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(render, 220);
    }, { passive: true });
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('rx-network')) {
      window.RX.initHeroNetwork('rx-network', 'rx-readout');
    }
  });
})();
