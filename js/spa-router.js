/* ============================================================
   RESOURCEX — UNIFIED CONTINUOUS SCROLLING SINGLE PAGE APPLICATION
   Entire Web Page Stood Up in One Fluid, Interactive Scroll
   ============================================================ */

(function () {
  'use strict';

  window.RX_SPA = window.RX_SPA || {};

  const appEl = () => document.getElementById('spa-app');

  /* ---- MASTER CONTINUOUS SCROLL LAYOUT ---- */
  function renderCompletePage() {
    const data = window.RX_DATA || {};
    let activeUser = null;

    try {
      const u = JSON.parse(localStorage.getItem('rx_user') || 'null');
      if (u && u.name) {
        activeUser = u;
      }
    } catch (e) {}

    function getHeroAuthSlotHTML(u) {
      if (u && u.name) {
        const avatarHtml = u.picture
          ? `<img src="${u.picture}" alt="${u.name}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1.5px solid #C4AD7A;display:inline-block;" referrerpolicy="no-referrer">`
          : `<span style="width:28px;height:28px;border-radius:50%;background:#1A73E8;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">${u.avatar || u.name.charAt(0)}</span>`;

        return `
          <div id="hero-user-profile-badge" style="display:inline-flex; align-items:center; gap:10px; padding:6px 14px 6px 8px; border-radius:30px; background:rgba(20,24,22,0.85); border:1px solid rgba(196,173,122,0.35); box-shadow:0 4px 16px rgba(0,0,0,0.3); backdrop-filter:blur(8px);">
            ${avatarHtml}
            <div style="display:flex; flex-direction:column; text-align:left;">
              <span style="font-weight:600; color:#F2EFE7; font-size:0.92rem; line-height:1.2;">${u.name}</span>
              <span style="font-size:0.75rem; color:#A8A5A0; font-family:'JetBrains Mono',monospace;">${u.email || 'Verified Partner'}</span>
            </div>
            <button type="button" onclick="window.RX && window.RX.logout && window.RX.logout()" title="Sign Out" style="background:transparent; border:none; color:#C4AD7A; font-size:0.8rem; cursor:pointer; padding:3px 8px; margin-left:6px; text-decoration:underline; font-family:'JetBrains Mono',monospace;">Sign Out</button>
          </div>
        `;
      }
      return `
        <button type="button" id="hero-google-auth-btn" onclick="window.RX_SPA.openLoginModal()" class="rx-btn" style="background:transparent; border:1px solid rgba(201,196,184,0.25); color:#F2EFE7; padding: 0.85rem 1.4rem;">
          <span>Sign In with Google</span>
        </button>
      `;
    }

    function renderConduit(moduleNum, nextId, nextTitle) {
      const marketClass = moduleNum === '2' ? 'module-conduit-market' : '';
      return `
        <div class="module-conduit ${marketClass}" aria-hidden="true" data-conduit="${moduleNum}">
          <div class="conduit-track">
            <div class="rx-slide-beam"></div>
          </div>
          <div class="conduit-node" onclick="window.RX_SPA.scrollToId('${nextId}')" title="Transition to ${nextTitle}">
            <div class="conduit-gyro">
              <div class="gyro-ring-outer"></div>
              <div class="gyro-ring-inner"></div>
              <div class="gyro-core"></div>
            </div>
            <div class="conduit-label">
              <span class="rx-roll-cylinder">CONDUIT &bull; 0${moduleNum}</span>
              <span class="conduit-next-name">${nextTitle}</span>
            </div>
            <span class="conduit-arrow">↓</span>
          </div>
        </div>
      `;
    }

    return `
    <div class="master-spa-scroller">

      <!-- ============================================================
           SECTION 1: HERO & VALUE PROPOSITION (#home)
           ============================================================ -->
      <section id="home" class="scroll-section rx-reveal-item slide-up visible" style="padding: 2.5rem 6% 3.5rem; max-width: 1440px; margin: 0 auto; position:relative; scroll-margin-top: calc(var(--rx-nav-height, 76px) + 1rem);">
        <!-- Ambient Lights & Particles -->
        <div class="ambient-glow" style="top:10%; right:5%; width:550px; height:550px; background:radial-gradient(circle, rgba(45,112,80,0.18), transparent 70%);"></div>
        <div class="ambient-glow" style="bottom:10%; left:5%; width:500px; height:500px; background:radial-gradient(circle, rgba(196,173,122,0.12), transparent 70%);"></div>

        <!-- Subtle Ambient Dust Particles -->
        <div class="hero-dust-field" aria-hidden="true">
          <span class="dust-particle dp-1"></span>
          <span class="dust-particle dp-2"></span>
          <span class="dust-particle dp-3"></span>
          <span class="dust-particle dp-4"></span>
          <span class="dust-particle dp-5"></span>
          <span class="dust-particle dp-6"></span>
        </div>

        <div class="hero-split-container">
          <div class="hero-split-content">
            <div class="hero-seq-1" style="display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border:1px solid rgba(196,173,122,0.3); border-radius:20px; background:rgba(196,173,122,0.08); color:#C4AD7A; font-family:'JetBrains Mono',monospace; font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:1.5rem;">
              <span style="width:6px; height:6px; border-radius:50%; background:#2D7050; box-shadow:0 0 8px #2D7050;"></span>
              01 &bull; ONE INDUSTRY'S WASTE &rarr; ANOTHER INDUSTRY'S RESOURCE
            </div>

            <h1 class="hero-seq-2" style="font-family:'Space Grotesk',sans-serif; font-size: clamp(2.3rem, 4.2vw, 3.8rem); font-weight:700; line-height:1.08; color:#F2EFE7; margin:0 0 1.25rem; letter-spacing:-0.03em;">
              Where industrial byproducts discover <span class="rx-gold-shimmer">landed value</span>.
            </h1>

            <p class="hero-seq-3" style="font-size:1.08rem; color:#A8A5A0; max-width:580px; line-height:1.6; margin:0 0 2rem;">
              ResourceX connects material generators with vetted secondary processors. Compare true landed economics, track chain-of-custody, and eliminate industrial waste in a single unified exchange.
            </p>

            <div class="hero-seq-4" style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
              <button type="button" onclick="window.RX_SPA.scrollToId('marketplace')" class="rx-btn rx-btn-primary" style="padding: 0.85rem 1.75rem; font-size: 0.95rem;">
                <span>Explore Marketplace ↓</span>
              </button>
              <button type="button" onclick="window.RX_SPA.scrollToId('dashboard')" class="rx-btn rx-btn-secondary" style="padding: 0.85rem 1.75rem; font-size: 0.95rem;">
                <span>Operations Dashboard ↓</span>
              </button>
              <div id="hero-auth-slot" style="display:inline-flex; align-items:center;">
                ${getHeroAuthSlotHTML(activeUser)}
              </div>
            </div>
          </div>

          <!-- Hero Right Visual with Continuous 3D Floating & Energy Flow -->
          <div class="hero-split-visual hero-seq-visual">
            <div class="hero-visual-container">
              <div class="hero-visual-glow"></div>
              <img class="hero-visual-img" src="assets/hero-illustration.png" alt="Industrial byproducts circular economy illustration" />
              <!-- Revolving & Pulsing Energy Flow Indicators -->
              <div class="hero-orbit-node orbit-1" aria-hidden="true"></div>
              <div class="hero-orbit-node orbit-2" aria-hidden="true"></div>
            </div>
          </div>
        </div>

        <!-- Metrics Strip with Highlight Sweep & Animated Counters -->
        <div class="rx-reveal-item slide-up hero-seq-stats stat-sweep" style="margin-top: 3.5rem; background: rgba(18,22,20,0.85); border:1px solid rgba(201,196,184,0.12); border-radius: 16px; padding: 2rem 2.5rem; display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:2rem;">
          <div>
            <div class="stat-number-counter" data-target="12850" data-format="+,standard" style="font-family:'Space Grotesk',sans-serif; font-size:2.2rem; font-weight:700; color:#F2EFE7;">12,850+</div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#A8A5A0; text-transform:uppercase;">Tonnes Diverted</div>
          </div>
          <div>
            <div class="stat-number-counter" data-target="4.2" data-format="₹,Cr,1" style="font-family:'Space Grotesk',sans-serif; font-size:2.2rem; font-weight:700; color:#C4AD7A;">₹4.2 Cr</div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#A8A5A0; text-transform:uppercase;">Landed Value Unlocked</div>
          </div>
          <div>
            <div class="stat-number-counter" data-target="94.8" data-format="%,1" style="font-family:'Space Grotesk',sans-serif; font-size:2.2rem; font-weight:700; color:#3A8D65;">94.8%</div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#A8A5A0; text-transform:uppercase;">Algorithm Compatibility Match</div>
          </div>
          <div>
            <div class="stat-number-counter" data-target="100" data-format="%" style="font-family:'Space Grotesk',sans-serif; font-size:2.2rem; font-weight:700; color:#F2EFE7;">100%</div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#A8A5A0; text-transform:uppercase;">Chain of Custody Traced</div>
          </div>
        </div>
      </section>

      ${renderConduit('2', 'marketplace', 'Material Marketplace')}

      <!-- ============================================================
           SECTION 2: MATERIAL MARKETPLACE (#marketplace)
           ============================================================ -->
      <section id="marketplace" class="scroll-section rx-marketplace-section" style="padding: 3rem 6% 4rem; max-width: 1440px; margin: 0 auto; position:relative; scroll-margin-top: calc(var(--rx-nav-height, 76px) + 1rem); display:none;" data-rx-role="seller buyer logistics">
        <!-- Continuous Ambient Background Motion (Dual-Layer Lattice, Glow & Atmospheric Particles) -->
        <div class="marketplace-ambient-grid-1" aria-hidden="true"></div>
        <div class="marketplace-ambient-grid-2" aria-hidden="true"></div>
        <div class="marketplace-ambient-glow" aria-hidden="true"></div>
        <div class="marketplace-particles-field" aria-hidden="true">
          <div class="market-particle p-1"></div>
          <div class="market-particle p-2"></div>
          <div class="market-particle p-3"></div>
          <div class="market-particle p-4"></div>
          <div class="market-particle p-5"></div>
        </div>

        <div class="rx-reveal-item slide-up marketplace-header" style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:1.5rem; margin-bottom:2rem; padding-bottom:1.5rem; border-bottom:1px solid rgba(201,196,184,0.1); position:relative; z-index:1;">
          <div class="marketplace-title-group">
            <div class="market-conduit-badge rx-float-subtle-a" style="font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#C4AD7A; margin-bottom:0.4rem;">
              02 &bull; VERIFIED INDUSTRIAL FEEDSTOCKS
            </div>
            <h2 class="marketplace-title" style="font-family:'Space Grotesk',sans-serif; font-size:2.4rem; font-weight:700; color:#F2EFE7; margin:0;">
              Material Marketplace
            </h2>
            <p class="marketplace-subtitle" style="font-size:0.95rem; color:#A8A5A0; margin:0.35rem 0 0;">
              Browse industrial lots with landed net-value economics, grades, and distance calculations.
            </p>
          </div>

          <div class="marketplace-controls" style="display:flex; gap:1rem; align-items:center;">
            <div class="market-search-wrapper" style="position:relative; overflow:hidden; border-radius:10px;">
              <input type="text" id="market-search" placeholder="Search materials, grades, IDs..." style="background:rgba(21,26,23,0.8); border:1px solid rgba(201,196,184,0.18); border-radius:10px; color:#F2EFE7; padding:0.7rem 1.2rem; font-size:0.9rem; outline:none; min-width:260px;">
              <div class="market-search-reflection" aria-hidden="true"></div>
            </div>
            <button type="button" onclick="window.RX_SPA.openListModal()" class="rx-btn rx-btn-primary">+ List Material</button>
          </div>
        </div>

        <!-- Category Ribbon with Switch Animation -->
        <div class="tabs-nav rx-reveal-item slide-up" style="margin-bottom:2rem; gap:0.5rem; position:relative; z-index:1;" id="market-category-ribbon">
          <button class="tab-btn active" data-cat="all">All Materials (12)</button>
          <button class="tab-btn" data-cat="metals">Metals</button>
          <button class="tab-btn" data-cat="polymers">Polymers</button>
          <button class="tab-btn" data-cat="industrial-plastics">Industrial Plastics</button>
          <button class="tab-btn" data-cat="textile-fibre">Textile / Fibre</button>
          <button class="tab-btn" data-cat="glass">Glass</button>
          <button class="tab-btn" data-cat="mineral-byproducts">Minerals</button>
        </div>

        <!-- Materials Grid with Dynamic Switching Animation -->
        <div class="rx-switch-animate" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:1.75rem; position:relative; z-index:1;" id="marketplace-cards-grid">
          <!-- Populated dynamically via JS -->
        </div>
      </section>

      ${renderConduit('3', 'net-value', 'Net Value Match Explorer')}

      <!-- ============================================================
           SECTION 3: NET VALUE MATCH EXPLORER (#net-value)
           ============================================================ -->
      <section id="net-value" class="scroll-section" style="padding: 3rem 6% 4rem; max-width: 1440px; margin: 0 auto; position:relative; scroll-margin-top: calc(var(--rx-nav-height, 76px) + 1rem); display:none;" data-rx-role="seller buyer">
        
        <div class="rx-reveal-item slide-up" style="margin-bottom:2rem; padding-bottom:1.5rem; border-bottom:1px solid rgba(201,196,184,0.1);">
          <div style="font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#C4AD7A; margin-bottom:0.4rem;">
            03 &bull; ALGORITHMIC LANDED VALUATION
          </div>
          <h2 style="font-family:'Space Grotesk',sans-serif; font-size:2.4rem; font-weight:700; color:#F2EFE7; margin:0;">
            Net Value Match Explorer
          </h2>
          <p style="color:#A8A5A0; font-size:0.95rem; margin:0.35rem 0 0;">
            Compare gross purchase bids against true landed economics factoring freight distance, purification yields, and purity discounts.
          </p>
        </div>

        <!-- Live Landed Economics Interactive Simulator -->
        <div class="table-card rx-reveal-item roll-in" style="margin-bottom: 2rem; padding: 2rem; border: 1px solid rgba(196,173,122,0.3); background: linear-gradient(180deg, rgba(21,26,23,0.95) 0%, rgba(15,18,16,0.98) 100%);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid rgba(201,196,184,0.1);">
            <div>
              <span class="tech-id" style="color:#C4AD7A;">LIVE ALGORITHMIC SIMULATOR</span>
              <h3 style="font-family:'Space Grotesk',sans-serif; font-size:1.35rem; color:#F2EFE7; margin:0.3rem 0 0.1rem;">
                True Landed Economics vs Raw Scrap Ask
              </h3>
              <p style="color:#A8A5A0; font-size:0.85rem; margin:0;">
                Move the sliders to demonstrate in real-time how freight distance and purity tolerance unlock true secondary value.
              </p>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="rx-badge-demo" style="background:rgba(45,112,80,0.25); border-color:#2D7050; color:#3A8D65;">DYNAMIC ALGORITHM READY</span>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:2rem; align-items:center;">
            <!-- Controls -->
            <div style="display:flex; flex-direction:column; gap:1.25rem;">
              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.85rem;">
                  <span style="color:#F2EFE7; font-weight:600;">Scrap Ask Price (FOB):</span>
                  <span style="color:#C4AD7A; font-family:'JetBrains Mono',monospace;" id="calc-out-ask">₹92.0/kg</span>
                </div>
                <input type="range" id="calc-ask" min="70" max="140" step="1" value="92" oninput="window.RX_SPA.updateLandedCalc()" style="width:100%; accent-color:#C4AD7A; cursor:pointer;">
              </div>

              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.85rem;">
                  <span style="color:#F2EFE7; font-weight:600;">Logistics Transport Distance:</span>
                  <span style="color:#3A8D65; font-family:'JetBrains Mono',monospace;" id="calc-out-dist">45 km</span>
                </div>
                <input type="range" id="calc-dist" min="10" max="200" step="5" value="45" oninput="window.RX_SPA.updateLandedCalc()" style="width:100%; accent-color:#3A8D65; cursor:pointer;">
              </div>

              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.85rem;">
                  <span style="color:#F2EFE7; font-weight:600;">Material Stream Purity:</span>
                  <span style="color:#C4AD7A; font-family:'JetBrains Mono',monospace;" id="calc-out-purity">94.8%</span>
                </div>
                <input type="range" id="calc-purity" min="80" max="100" step="0.5" value="94.8" oninput="window.RX_SPA.updateLandedCalc()" style="width:100%; accent-color:#C4AD7A; cursor:pointer;">
              </div>
            </div>

            <!-- Dynamic Landed Valuation Card -->
            <div style="background:rgba(15,18,16,0.85); border:1px solid rgba(196,173,122,0.25); border-radius:12px; padding:1.5rem; text-align:center;">
              <div style="font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:#A8A5A0; text-transform:uppercase; margin-bottom:0.3rem;">Algorithmic Net Realized Landed Value</div>
              <div id="calc-out-net" style="font-family:'Space Grotesk',sans-serif; font-size:2.4rem; font-weight:700; color:#F2EFE7; margin-bottom:0.25rem;">₹94,380/T</div>
              <div id="calc-out-perkg" style="font-family:'JetBrains Mono',monospace; font-size:0.88rem; color:#3A8D65; margin-bottom:1rem;">Effective: ₹94.38/kg (+2.6% vs Raw FOB)</div>
              <p style="font-size:0.78rem; color:#A8A5A0; line-height:1.4; margin:0 0 1rem;">
                Freight optimized at ₹32/ton-km. 94.8% purity yield matches secondary remelt specs without virgin dilution penalty.
              </p>
              <button type="button" onclick="window.RX_SPA.openDetailModal('RX-AL-9402')" class="rx-btn rx-btn-primary rx-btn-sm" style="width:100%;">Inspect Algorithm Breakdown &rarr;</button>
            </div>
          </div>
        </div>

        <div class="table-card rx-reveal-item roll-in">
          <div class="table-card-header">
            <h3 class="table-card-title">
              <span class="tech-id">COMPATIBILITY MATRIX</span>
              <span>Direct Match Opportunities</span>
            </h3>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Stream</th>
                  <th>Compatible Buyer</th>
                  <th>Match Score</th>
                  <th>Est. Net Value</th>
                  <th>Distance</th>
                  <th style="text-align:right;">Action</th>
                </tr>
              </thead>
              <tbody id="spa-matches-table"></tbody>
            </table>
          </div>
        </div>
      </section>

      ${renderConduit('4', 'material-journey', '5-Stage Circular Traceability')}

      <!-- ============================================================
           SECTION 4: MATERIAL JOURNEY (#material-journey)
           ============================================================ -->
      <section id="material-journey" class="scroll-section" style="padding: 3rem 6% 4rem; max-width: 1440px; margin: 0 auto; position:relative; scroll-margin-top: calc(var(--rx-nav-height, 76px) + 1rem); display:none;" data-rx-role="seller buyer logistics">
        
        <div class="rx-reveal-item slide-up" style="margin-bottom:2rem; padding-bottom:1.5rem; border-bottom:1px solid rgba(201,196,184,0.1);">
          <div style="font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#3A8D65; margin-bottom:0.4rem;">
            04 &bull; TRACEABILITY & REUSE PIPELINE
          </div>
          <h2 style="font-family:'Space Grotesk',sans-serif; font-size:2.4rem; font-weight:700; color:#F2EFE7; margin:0;">
            Material Journey
          </h2>
          <p style="color:#A8A5A0; font-size:0.95rem; margin:0.35rem 0 0;">
            End-to-end chain of custody from generation to secondary product manufacturing with verified lifecycle emissions.
          </p>
        </div>

        <!-- Interactive 5-Stage Circular Pipeline Flow (Core Hackathon Innovation) -->
        <div class="table-card rx-reveal-item roll-in" style="margin-bottom: 2rem; padding: 2rem; border: 1px solid rgba(45,112,80,0.35); background: linear-gradient(180deg, rgba(21,26,23,0.92) 0%, rgba(15,18,16,0.95) 100%);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid rgba(201,196,184,0.1);">
            <div>
              <span class="tech-id" style="color:#C4AD7A;">CIRCULAR VALUE CHAIN</span>
              <h3 style="font-family:'Space Grotesk',sans-serif; font-size:1.35rem; color:#F2EFE7; margin:0.3rem 0 0.1rem;">
                From Waste Generator to New Product
              </h3>
              <p style="color:#A8A5A0; font-size:0.85rem; margin:0;">
                “One Industry's Waste &rarr; Another Industry's Resource” &bull; Live Chain-of-Custody Simulation
              </p>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <span class="rx-badge-demo" style="background:rgba(45,112,80,0.25); border-color:#2D7050; color:#3A8D65;">100% LANDFILL DIVERTED</span>
              <span class="rx-badge-demo" style="background:rgba(196,173,122,0.15); border-color:#C4AD7A; color:#C4AD7A;">-42% CO2 EMISSIONS</span>
            </div>
          </div>

          <!-- 5 Pipeline Steps Grid -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1rem; position:relative;" id="pipeline-steps-container">
            
            <!-- Step 1 -->
            <div class="pipeline-step active" onclick="window.RX_SPA.selectPipelineStep(1)" style="background:rgba(45,112,80,0.2); border:1px solid #3A8D65; border-radius:12px; padding:1.25rem 1rem; cursor:pointer; transition:all 0.3s ease; position:relative;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <span style="width:26px; height:26px; border-radius:50%; background:rgba(45,112,80,0.3); border:1px solid #3A8D65; display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:#FFF; font-weight:700;">01</span>
                <span style="font-size:1.4rem;">🏭</span>
              </div>
              <h4 style="font-family:'Space Grotesk',sans-serif; font-size:0.95rem; color:#F2EFE7; margin:0 0 0.25rem;">Factory A</h4>
              <p style="color:#A8A5A0; font-size:0.78rem; margin:0; line-height:1.4;">Automotive OEM generating high-spec 6063 aluminium scrap</p>
              <div style="margin-top:0.75rem; font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:#C4AD7A;">Byproduct: 12.5 T/mo</div>
            </div>

            <!-- Step 2 -->
            <div class="pipeline-step" onclick="window.RX_SPA.selectPipelineStep(2)" style="background:rgba(18,22,20,0.8); border:1px solid rgba(201,196,184,0.12); border-radius:12px; padding:1.25rem 1rem; cursor:pointer; transition:all 0.3s ease; position:relative;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <span style="width:26px; height:26px; border-radius:50%; background:rgba(196,173,122,0.2); border:1px solid rgba(196,173,122,0.4); display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:#C4AD7A; font-weight:700;">02</span>
                <span style="font-size:1.4rem;">📦</span>
              </div>
              <h4 style="font-family:'Space Grotesk',sans-serif; font-size:0.95rem; color:#F2EFE7; margin:0 0 0.25rem;">Industrial Waste</h4>
              <p style="color:#A8A5A0; font-size:0.78rem; margin:0; line-height:1.4;">Landed value matching algorithm computes optimal secondary route</p>
              <div style="margin-top:0.75rem; font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:#3A8D65;">Match: 94.8% Pure</div>
            </div>

            <!-- Step 3 -->
            <div class="pipeline-step" onclick="window.RX_SPA.selectPipelineStep(3)" style="background:rgba(18,22,20,0.8); border:1px solid rgba(201,196,184,0.12); border-radius:12px; padding:1.25rem 1rem; cursor:pointer; transition:all 0.3s ease; position:relative;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <span style="width:26px; height:26px; border-radius:50%; background:rgba(196,173,122,0.2); border:1px solid rgba(196,173,122,0.4); display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:#C4AD7A; font-weight:700;">03</span>
                <span style="font-size:1.4rem;">♻️</span>
              </div>
              <h4 style="font-family:'Space Grotesk',sans-serif; font-size:0.95rem; color:#F2EFE7; margin:0 0 0.25rem;">Vetted Recycler</h4>
              <p style="color:#A8A5A0; font-size:0.78rem; margin:0; line-height:1.4;">Secondary sorting, shredding, and chemical decontamination</p>
              <div style="margin-top:0.75rem; font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:#C4AD7A;">Yield: 96.2% Recovery</div>
            </div>

            <!-- Step 4 -->
            <div class="pipeline-step" onclick="window.RX_SPA.selectPipelineStep(4)" style="background:rgba(18,22,20,0.8); border:1px solid rgba(201,196,184,0.12); border-radius:12px; padding:1.25rem 1rem; cursor:pointer; transition:all 0.3s ease; position:relative;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <span style="width:26px; height:26px; border-radius:50%; background:rgba(196,173,122,0.2); border:1px solid rgba(196,173,122,0.4); display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:#C4AD7A; font-weight:700;">04</span>
                <span style="font-size:1.4rem;">⚙️</span>
              </div>
              <h4 style="font-family:'Space Grotesk',sans-serif; font-size:0.95rem; color:#F2EFE7; margin:0 0 0.25rem;">Processor / Smelter</h4>
              <p style="color:#A8A5A0; font-size:0.78rem; margin:0; line-height:1.4;">Refining and casting into standardized industrial ingots</p>
              <div style="margin-top:0.75rem; font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:#3A8D65;">Quality: ISO 9001</div>
            </div>

            <!-- Step 5 -->
            <div class="pipeline-step" onclick="window.RX_SPA.selectPipelineStep(5)" style="background:rgba(18,22,20,0.8); border:1px solid rgba(201,196,184,0.12); border-radius:12px; padding:1.25rem 1rem; cursor:pointer; transition:all 0.3s ease; position:relative;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <span style="width:26px; height:26px; border-radius:50%; background:rgba(45,112,80,0.3); border:1px solid #3A8D65; display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:#FFF; font-weight:700;">05</span>
                <span style="font-size:1.4rem;">🏭</span>
              </div>
              <h4 style="font-family:'Space Grotesk',sans-serif; font-size:0.95rem; color:#F2EFE7; margin:0 0 0.25rem;">Factory B (New Product)</h4>
              <p style="color:#A8A5A0; font-size:0.78rem; margin:0; line-height:1.4;">Hardware casings and structural automotive enclosures</p>
              <div style="margin-top:0.75rem; font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:#C4AD7A;">Result: 0kg Landfill</div>
            </div>

          </div>

          <!-- Live Step Detail Callout -->
          <div id="pipeline-detail-box" style="margin-top:1.5rem; padding:1rem 1.25rem; background:rgba(15,18,16,0.85); border-radius:8px; border-left:3px solid #3A8D65; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div style="font-size:0.85rem; color:#E8E4DB;">
              <strong style="color:#C4AD7A;">Current Selected Node:</strong> <span id="pipeline-node-name">Stage 1 — Factory A (Automobile Component Facility)</span>
              <div style="color:#A8A5A0; font-size:0.78rem; margin-top:0.2rem;" id="pipeline-node-desc">Raw byproduct generation point: CNC turning scrap accumulated under digital ledger tracking.</div>
            </div>
            <button type="button" onclick="window.RX_SPA.openDetailModal('RX-AL-9402')" class="rx-btn rx-btn-primary rx-btn-sm">Inspect Material Lot &rarr;</button>
          </div>
        </div>

        <div class="table-card rx-reveal-item roll-in">
          <div class="table-card-header">
            <h3 class="table-card-title">
              <span class="dock-icon" style="animation: rxSpinCW 10s linear infinite; display:inline-block; color:#3A8D65;">⟳</span>
              <span>Active Traceability Chains</span>
            </h3>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Material Stream</th>
                  <th>Generator Facility</th>
                  <th>Current Node</th>
                  <th>Verification</th>
                </tr>
              </thead>
              <tbody id="spa-journey-table"></tbody>
            </table>
          </div>
        </div>
      </section>

      ${renderConduit('5', 'material-bank', 'Material Bank Escrow')}

      <!-- ============================================================
           SECTION 5: MATERIAL BANK (#material-bank)
           ============================================================ -->
      <section id="material-bank" class="scroll-section" style="padding: 3rem 6% 4rem; max-width: 1440px; margin: 0 auto; position:relative; scroll-margin-top: calc(var(--rx-nav-height, 76px) + 1rem); display:none;" data-rx-role="seller">
        
        <div class="rx-reveal-item slide-up" style="margin-bottom:2rem; padding-bottom:1.5rem; border-bottom:1px solid rgba(201,196,184,0.1);">
          <div style="font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#C4AD7A; margin-bottom:0.4rem;">
            05 &bull; VOLUME AGGREGATION & ESCROW
          </div>
          <h2 style="font-family:'Space Grotesk',sans-serif; font-size:2.4rem; font-weight:700; color:#F2EFE7; margin:0;">
            Material Bank
          </h2>
          <p style="color:#A8A5A0; font-size:0.95rem; margin:0.35rem 0 0;">
            Pool and accumulate small generator batches into truckload volumes to unlock institutional procurement pricing.
          </p>
        </div>

        <!-- Continuous Horizontal Stream Carousel (Infinite Seamless 60FPS) -->
        <div class="rx-reveal-item slide-up" style="margin-bottom: 2.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="live-pulse-dot"></span>
              <span style="font-family:'JetBrains Mono',monospace; font-size:0.76rem; color:#C4AD7A; text-transform:uppercase; letter-spacing:0.08em;">Live Aggregation Stream &bull; Real-Time Volume Pooling</span>
            </div>
            <span style="font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:#A8A5A0;">Continuous Stream &bull; Hover to Inspect &bull; 60 FPS</span>
          </div>
          <div class="rx-infinite-carousel" id="rx-bank-carousel">
            <div class="rx-carousel-track" id="rx-bank-carousel-track">
              <!-- Populated dynamically via JS -->
            </div>
          </div>
        </div>

        <div class="table-card rx-reveal-item roll-in">
          <div class="table-card-header">
            <h3 class="table-card-title">
              <span class="dock-icon" style="color:#C4AD7A;">🏛</span>
              <span>Banked Aggregations in Escrow</span>
            </h3>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Stream ID</th>
                  <th>Material Type</th>
                  <th>Accumulated Volume</th>
                  <th>Target Threshold</th>
                  <th>Reserve Ask</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="spa-bank-table"></tbody>
            </table>
          </div>
        </div>
      </section>

      ${renderConduit('6', 'about', 'About ResourceX Framework')}

      <!-- ============================================================
           SECTION 6: ABOUT RESOURCE X (#about)
           ============================================================ -->
      <section id="about" class="scroll-section" style="padding: 3rem 6% 5rem; max-width: 1440px; margin: 0 auto; position:relative; scroll-margin-top: calc(var(--rx-nav-height, 76px) + 1rem); display:none;" data-rx-role="seller buyer logistics">
        
        <div style="max-width: 900px; margin:0 auto;">
          <div class="table-card rx-reveal-item roll-in" style="padding: 2.75rem;">
            <span class="tech-id">ARCHITECTURE & APPROACH</span>
            <h2 style="font-family:'Space Grotesk',sans-serif; font-size:2.4rem; font-weight:700; color:#F2EFE7; margin:0.5rem 0 1rem;">About ResourceX</h2>
            <p style="color:#A8A5A0; font-size:1.05rem; line-height:1.7; margin-bottom:1.5rem;">
              ResourceX is an industrial circular economy exchange engineered to eliminate the financial friction that forces valuable industrial byproducts into landfills.
            </p>
            <h3 style="font-family:'Space Grotesk',sans-serif; color:#C4AD7A; font-size:1.3rem; margin-top:2rem;">Landed Net Value Matching</h3>
            <p style="color:#E8E4DB; font-size:0.95rem; line-height:1.6;">
              Traditional brokers focus solely on FOB prices, ignoring freight burdens and purity tolerances. ResourceX models logistics freight, purification yields, and purity discounts in real-time, matching industrial generators with buyers whose process tolerances naturally accommodate the stream.
            </p>
            <div style="margin-top:2.5rem; display:flex; gap:1rem; flex-wrap:wrap;">
              <button type="button" onclick="window.RX_SPA.scrollToId('marketplace')" class="rx-btn rx-btn-primary">Browse Materials</button>
              <button type="button" onclick="window.RX_SPA.scrollToId('dashboard')" class="rx-btn rx-btn-secondary">Open Operations Dashboard &darr;</button>
            </div>
          </div>
        </div>
      </section>

      ${renderConduit('7', 'dashboard', 'Operations Console & Generator Dashboard')}

      <!-- ============================================================
           SECTION 7: GENERATOR DASHBOARD (#dashboard)
           ============================================================ -->
      <section id="dashboard" class="scroll-section rx-reveal-item slide-up" style="padding: 3rem 6% 4rem; max-width: 1440px; margin: 0 auto; position:relative; scroll-margin-top: calc(var(--rx-nav-height, 76px) + 1rem); display:none;" data-rx-role="seller buyer logistics">
        
        <!-- Live Ledger Notice -->
        <div class="sim-banner rx-reveal-item slide-up" style="background:linear-gradient(90deg, rgba(23,58,43,0.7), rgba(32,73,54,0.8), rgba(23,58,43,0.7)); border:1px solid rgba(45,112,80,0.35); border-radius:10px; color:#C9C4B8; font-family:'JetBrains Mono',monospace; font-size:0.76rem; padding:0.5rem 1rem; display:flex; align-items:center; justify-content:center; gap:0.6rem; margin-bottom:1.75rem;">
          <span style="width:7px; height:7px; background:#2D7050; border-radius:50%; box-shadow:0 0 8px #3A8D65;"></span>
          <span>256-BIT CRYPTOGRAPHIC LEDGER ACTIVE &bull; INDUSTRIAL TRACEABILITY NETWORK</span>
        </div>

        <!-- Dashboard Header -->
        <header class="dashboard-header" style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:1.5rem; margin-bottom:2rem; padding-bottom:1.5rem; border-bottom:1px solid rgba(201,196,184,0.1);">
          <div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#C4AD7A; margin-bottom:0.4rem;">
              07 &bull; INDUSTRIAL OPERATIONS CONSOLE
            </div>
            <div style="display:flex; align-items:center; gap:0.85rem;" id="dash-user-header">
              <div id="dash-user-avatar" style="width:44px; height:44px; border-radius:12px; overflow:hidden; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(26,115,232,0.35);">
                ${activeUser && activeUser.picture
                  ? `<img src="${activeUser.picture}" alt="${activeUser.name}" style="width:44px; height:44px; border-radius:12px; object-fit:cover; border:2px solid #C4AD7A; display:block;" referrerpolicy="no-referrer">`
                  : activeUser
                    ? `<div style="width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg, #1A73E8, #0D47A1); color:#FFF; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:1.3rem; display:flex; align-items:center; justify-content:center;">${activeUser.avatar || activeUser.name.charAt(0)}</div>`
                    : `<div style="width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg, rgba(201,196,184,0.15), rgba(201,196,184,0.05)); color:#C9C4B8; display:flex; align-items:center; justify-content:center; font-size:1.3rem;">⚡</div>`
                }
              </div>
              <div>
                <h2 id="dash-user-title" style="font-family:'Space Grotesk',sans-serif; font-size:2.2rem; font-weight:700; color:#F2EFE7; margin:0;">
                  ${activeUser ? `Welcome back, ${activeUser.name}` : `Operations Console`}
                </h2>
                <p id="dash-user-subtitle" style="margin:0; font-size:0.88rem; color:#A8A5A0;">
                  ${activeUser ? `${activeUser.email} &bull; Industrial Feedstock Facility <span class="rx-badge-demo" style="margin-left:6px;">VERIFIED</span>` : `Industrial Circular Corridor &bull; Traceability Network <span class="rx-badge-demo" style="margin-left:6px;">VERIFIED</span>`}
                </p>
              </div>
            </div>
          </div>

          <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;">
            <button type="button" onclick="window.RX_SPA.scrollToId('home')" class="rx-btn rx-btn-secondary" style="display:inline-flex; align-items:center; gap:6px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Back to Top ↑</span>
            </button>
            <button type="button" onclick="window.RX_SPA.scrollToId('marketplace')" class="rx-btn rx-btn-secondary">Browse Market ↑</button>
            <button type="button" onclick="window.RX_SPA.openListModal()" class="rx-btn rx-btn-primary">+ List a Material</button>
          </div>
        </header>

        <!-- 4 Stats Cards -->
        <div class="stats-grid" id="spa-stats-container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1.25rem; margin-bottom:2.25rem;">
          <!-- Populated by JS -->
        </div>

        <!-- Dashboard Layout: Continuous Tables + Sidebar -->
        <div style="display:grid; grid-template-columns:minmax(0, 1fr) 320px; gap:2rem; align-items:start;">
          
          <div style="display:flex; flex-direction:column; gap:2rem;">

            <!-- Section 7.1: Active Lots Table -->
            <div id="dash-sec-listings" class="table-card" style="scroll-margin-top: calc(var(--rx-nav-height, 76px) + 1.25rem);">
              <div class="table-card-header">
                <h3 class="table-card-title">
                  <span>Active Material Streams</span>
                  <span class="rx-badge-demo">VERIFIED</span>
                </h3>
                <button type="button" onclick="window.RX_SPA.openListModal()" class="rx-btn rx-btn-secondary rx-btn-sm">+ Add Lot</button>
              </div>
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr><th>Stream ID</th><th>Material Name</th><th>Quantity</th><th>Status</th><th style="text-align:right;">Action</th></tr>
                  </thead>
                  <tbody id="dash-listings-tbody"></tbody>
                </table>
              </div>
            </div>

            <!-- Section 7.2: Incoming Purchase Offers -->
            <div id="dash-sec-offers" class="table-card" style="scroll-margin-top: calc(var(--rx-nav-height, 76px) + 1.25rem);">
              <div class="table-card-header">
                <h3 class="table-card-title">
                  <span>Incoming Purchase Offers</span>
                  <span class="rx-badge-demo">COMMERCIAL INTAKE</span>
                </h3>
              </div>
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr><th>Stream</th><th>Buyer Facility</th><th>Offered Price</th><th>Status</th><th style="text-align:right;">Actions</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span class="tech-id">RX-AL-9402</span><br><strong style="color:#F2EFE7;">6063 Aluminium Turnings</strong></td>
                      <td>Apex Alloy Casters</td>
                      <td><strong style="color:#C4AD7A;">₹94.20/kg</strong></td>
                      <td><span class="status-pill pending">Pending Review</span></td>
                      <td style="text-align:right;">
                        <button class="table-action-btn primary" onclick="window.RX_SPA.acceptOffer(this, 'RX-AL-9402', 'Apex Alloy Casters')">Accept</button>
                        <button class="table-action-btn" onclick="window.RX_SPA.counterOffer(this, 'RX-AL-9402', 'Apex Alloy Casters')">Counter</button>
                      </td>
                    </tr>
                    <tr>
                      <td><span class="tech-id">RX-PE-5218</span><br><strong style="color:#F2EFE7;">HDPE Regrind — Natural</strong></td>
                      <td>EcoPolymers Recycling</td>
                      <td><strong style="color:#C4AD7A;">₹49.00/kg</strong></td>
                      <td><span class="status-pill pending">Pending Review</span></td>
                      <td style="text-align:right;">
                        <button class="table-action-btn primary" onclick="window.RX_SPA.acceptOffer(this, 'RX-PE-5218', 'EcoPolymers Recycling')">Accept</button>
                        <button class="table-action-btn" onclick="window.RX_SPA.counterOffer(this, 'RX-PE-5218', 'EcoPolymers Recycling')">Counter</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Section 7.3: Direct Commercial Comms -->
            <div id="dash-sec-negotiations" class="table-card" style="scroll-margin-top: calc(var(--rx-nav-height, 76px) + 1.25rem);">
              <div class="table-card-header">
                <h3 class="table-card-title">
                  <span>Commercial Encrypted Comms</span>
                  <span class="rx-badge-demo">DIRECT THREADS</span>
                </h3>
              </div>
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr><th>Stream</th><th>Counterparty</th><th>Last Transmitted Message</th><th>Status</th><th style="text-align:right;">Action</th></tr>
                  </thead>
                  <tbody id="dash-negotiations-tbody"></tbody>
                </table>
              </div>
            </div>

          </div>

          <!-- Sticky Sidebar -->
          <aside style="position:sticky; top:calc(var(--rx-nav-height, 76px) + 2rem); display:flex; flex-direction:column; gap:1.5rem;">
            <div class="table-card">
              <h4 style="font-family:'Space Grotesk',sans-serif; font-size:1.05rem; color:#F2EFE7; margin:0 0 1rem; display:flex; justify-content:space-between;">
                <span>Quick Navigation</span>
                <span class="rx-badge-demo">ANCHORS</span>
              </h4>
              <div style="display:flex; flex-direction:column; gap:0.55rem;">
                <button type="button" onclick="window.RX_SPA.scrollToId('home')" class="action-link" style="width:100%; border:none; text-align:left; cursor:pointer; display:flex; justify-content:space-between; padding:0.75rem 1rem; background:rgba(45,112,80,0.18); border:1px solid rgba(45,112,80,0.35); border-radius:8px; color:#F2EFE7; font-size:0.88rem; font-weight:600;">
                  <span style="display:inline-flex; align-items:center; gap:7px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>Back to Top / Home</span>
                  </span>
                  <span>↑</span>
                </button>
                <button type="button" onclick="window.RX_SPA.scrollToId('marketplace')" class="action-link" style="width:100%; border:none; text-align:left; cursor:pointer; display:flex; justify-content:space-between; padding:0.75rem 1rem; background:rgba(15,18,16,0.6); border:1px solid rgba(201,196,184,0.1); border-radius:8px; color:#F2EFE7; font-size:0.88rem;">
                  <span>Browse Marketplace</span>
                  <span>↑</span>
                </button>
                <button type="button" onclick="window.RX_SPA.scrollToId('net-value')" class="action-link" style="width:100%; border:none; text-align:left; cursor:pointer; display:flex; justify-content:space-between; padding:0.75rem 1rem; background:rgba(15,18,16,0.6); border:1px solid rgba(201,196,184,0.1); border-radius:8px; color:#F2EFE7; font-size:0.88rem;">
                  <span>Net-Value Match Explorer</span>
                  <span>↑</span>
                </button>
                <button type="button" onclick="window.RX_SPA.scrollToId('material-journey')" class="action-link" style="width:100%; border:none; text-align:left; cursor:pointer; display:flex; justify-content:space-between; padding:0.75rem 1rem; background:rgba(15,18,16,0.6); border:1px solid rgba(201,196,184,0.1); border-radius:8px; color:#F2EFE7; font-size:0.88rem;">
                  <span>5-Stage Circular Pipeline</span>
                  <span>↑</span>
                </button>
                <button type="button" onclick="window.RX_SPA.scrollToId('material-bank')" class="action-link" style="width:100%; border:none; text-align:left; cursor:pointer; display:flex; justify-content:space-between; padding:0.75rem 1rem; background:rgba(15,18,16,0.6); border:1px solid rgba(201,196,184,0.1); border-radius:8px; color:#F2EFE7; font-size:0.88rem;">
                  <span>Material Bank Escrow</span>
                  <span>↑</span>
                </button>
                <button type="button" onclick="window.RX_SPA.scrollToId('about')" class="action-link" style="width:100%; border:none; text-align:left; cursor:pointer; display:flex; justify-content:space-between; padding:0.75rem 1rem; background:rgba(15,18,16,0.6); border:1px solid rgba(201,196,184,0.1); border-radius:8px; color:#F2EFE7; font-size:0.88rem;">
                  <span>About Framework</span>
                  <span>↑</span>
                </button>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="table-card">
              <h4 style="font-family:'Space Grotesk',sans-serif; font-size:1.05rem; color:#F2EFE7; margin:0 0 1rem;">Recent Activity</h4>
              <div class="activity-timeline">
                <div class="timeline-item">
                  <div class="timeline-dot gold"></div>
                  <div class="timeline-text">New match found for <span class="tech-id">RX-AL-9402</span></div>
                  <div class="timeline-time">2 hours ago &bull; Apex Casters</div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-text">Offer received from EcoPolymers</div>
                  <div class="timeline-time">Yesterday &bull; ₹49.00/kg</div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot blue"></div>
                  <div class="timeline-text">Stream placed into Material Bank</div>
                  <div class="timeline-time">2 days ago &bull; Aggregating</div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </section>

    </div>

    <!-- ============================================================
         MODALS (INTERACTIVE DIALOGS THAT DO NOT LEAVE THE PAGE)
         ============================================================ -->

        <!-- 1. OFFICIAL GOOGLE IDENTITY SERVICES & RESOURCE-X B2B MODAL -->
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
            <label style="display: block; font-size: 0.85rem; color: var(--rx-stone-300); margin-bottom: 0.5rem;">Select your organizational role(s)</label>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 0.75rem; background: #141c18; border: 1px solid rgba(196,173,122,0.35); border-radius: 8px;">
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; color: #F2EFE7; font-size: 0.9rem;">
                    <input type="checkbox" id="rx-role-seller" class="rx-role-checkbox" value="seller" style="accent-color: #C4AD7A; width: 1.1rem; height: 1.1rem; cursor: pointer;">
                    <span>🏭 Generator / Seller (Source Material)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; color: #F2EFE7; font-size: 0.9rem;">
                    <input type="checkbox" id="rx-role-buyer" class="rx-role-checkbox" value="buyer" style="accent-color: #C4AD7A; width: 1.1rem; height: 1.1rem; cursor: pointer;">
                    <span>🔄 Processor / Buyer (Procure Material)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; color: #F2EFE7; font-size: 0.9rem;">
                    <input type="checkbox" id="rx-role-logistics" class="rx-role-checkbox" value="logistics" style="accent-color: #C4AD7A; width: 1.1rem; height: 1.1rem; cursor: pointer;">
                    <span>🚚 Logistics / Transport Partner</span>
                </label>
                <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid rgba(201,196,184,0.1);">
                    <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; color: #C4AD7A; font-size: 0.85rem; font-weight: 600;">
                        <input type="checkbox" id="rx-select-all" style="accent-color: #C4AD7A; width: 1.1rem; height: 1.1rem; cursor: pointer;" onclick="window.RX_SPA.toggleAllRoles()">
                        <span>Select All Roles (Demo Mode)</span>
                    </label>
                </div>
            </div>
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
    </div>

    <!-- 2. MATERIAL DETAIL MODAL -->
    <div id="spa-detail-modal" class="modal-overlay" role="dialog" aria-modal="true" style="position:fixed; inset:0; background:rgba(0,0,0,0.75); backdrop-filter:blur(12px); z-index:3000; display:none; align-items:center; justify-content:center; padding:1.5rem;">
      <div class="table-card" style="width:100%; max-width:640px; position:relative;" id="spa-detail-modal-body">
        <!-- Dynamically injected -->
      </div>
    </div>

    <!-- 3. LIST MATERIAL MODAL -->
    <div id="spa-list-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-label="List Byproduct Stream" style="position:fixed; inset:0; background:rgba(0,0,0,0.75); backdrop-filter:blur(12px); z-index:3000; display:none; align-items:center; justify-content:center; padding:1.5rem;">
      <div class="table-card" style="width:100%; max-width:540px; position:relative;">
        <button type="button" onclick="window.RX_SPA.closeListModal()" aria-label="Close" style="position:absolute; top:1.25rem; right:1.25rem; background:none; border:none; font-size:1.4rem; color:#A8A5A0; cursor:pointer;">&times;</button>
        <span class="tech-id">GENERATOR REGISTRATION</span>
        <h3 style="font-family:'Space Grotesk',sans-serif; font-size:1.6rem; color:#F2EFE7; margin:0.4rem 0 1.25rem;">List Byproduct Stream</h3>
        
        <form onsubmit="event.preventDefault(); window.RX_SPA.handleListSubmit();" novalidate>
          <div style="margin-bottom:1rem;">
            <label for="stream-name" style="display:block; font-size:0.75rem; color:#C4AD7A; font-family:'JetBrains Mono',monospace; margin-bottom:0.3rem;">STREAM NAME</label>
            <input type="text" id="stream-name" required placeholder="e.g. 6063 Aluminium Offcuts" aria-required="true" style="width:100%; padding:0.75rem 1rem; background:rgba(15,18,16,0.8); border:1px solid rgba(201,196,184,0.2); border-radius:8px; color:#F2EFE7; outline:none; box-sizing:border-box;">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div>
              <label for="stream-cat" style="display:block; font-size:0.75rem; color:#C4AD7A; font-family:'JetBrains Mono',monospace; margin-bottom:0.3rem;">CATEGORY</label>
              <select id="stream-cat" aria-required="true" style="width:100%; padding:0.75rem; background:rgba(15,18,16,0.8); border:1px solid rgba(201,196,184,0.2); border-radius:8px; color:#F2EFE7;">
                <option value="Metals">Metals</option>
                <option value="Polymers">Polymers</option>
                <option value="Industrial Plastics">Industrial Plastics</option>
                <option value="Glass">Glass</option>
              </select>
            </div>
            <div>
              <label for="stream-qty" style="display:block; font-size:0.75rem; color:#C4AD7A; font-family:'JetBrains Mono',monospace; margin-bottom:0.3rem;">QUANTITY (KG)</label>
              <input type="number" id="stream-qty" required min="1" placeholder="5000" aria-required="true" style="width:100%; padding:0.75rem; background:rgba(15,18,16,0.8); border:1px solid rgba(201,196,184,0.2); border-radius:8px; color:#F2EFE7; box-sizing:border-box;">
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
            <div>
              <label for="stream-ask" style="display:block; font-size:0.75rem; color:#C4AD7A; font-family:'JetBrains Mono',monospace; margin-bottom:0.3rem;">RESERVE ASK (₹/KG)</label>
              <input type="number" id="stream-ask" required min="1" step="0.01" placeholder="85.00" aria-required="true" style="width:100%; padding:0.75rem; background:rgba(15,18,16,0.8); border:1px solid rgba(201,196,184,0.2); border-radius:8px; color:#F2EFE7; box-sizing:border-box;">
            </div>
            <div>
              <label for="stream-loc" style="display:block; font-size:0.75rem; color:#C4AD7A; font-family:'JetBrains Mono',monospace; margin-bottom:0.3rem;">LOCATION</label>
              <input type="text" id="stream-loc" required placeholder="Hyderabad" aria-required="true" style="width:100%; padding:0.75rem; background:rgba(15,18,16,0.8); border:1px solid rgba(201,196,184,0.2); border-radius:8px; color:#F2EFE7; box-sizing:border-box;">
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
            <button type="button" onclick="window.RX_SPA.closeListModal()" class="rx-btn rx-btn-secondary rx-btn-sm">Cancel</button>
            <button type="submit" class="rx-btn rx-btn-primary rx-btn-sm">Publish Stream &rarr;</button>
          </div>
        </form>
      </div>
    </div>

    </div>
    `;
  }

  /* ---- POPULATE ALL DATA AND ATTACH LISTENERS ---- */
  function initializeAllSections() {
    const data = window.RX_DATA || {};

    // 1. POPULATE MARKETPLACE CARDS
    const grid = document.getElementById('marketplace-cards-grid');
    const searchInput = document.getElementById('market-search');
    const catRibbon = document.getElementById('market-category-ribbon');

    let selectedCat = 'all';
    let searchQuery = '';

    function filterAndRenderMarket() {
      if (!grid) return;
      const mats = data.materials || [];
      const filtered = mats.filter(m => {
        const matchesCat = selectedCat === 'all' || 
          (m.category && m.category.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(selectedCat));
        const matchesSearch = !searchQuery || 
          m.name.toLowerCase().includes(searchQuery) || 
          m.id.toLowerCase().includes(searchQuery) ||
          (m.category && m.category.toLowerCase().includes(searchQuery));
        return matchesCat && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:3rem; color:#A8A5A0;">No materials match the filter criteria.</div>';
      } else {
        grid.classList.remove('rx-switch-animate');
        void grid.offsetWidth;
        grid.classList.add('rx-switch-animate');
        grid.innerHTML = filtered.map((m, idx) => createMaterialCard(m, idx)).join('');
      }
    }

    if (catRibbon) {
      catRibbon.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          catRibbon.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedCat = btn.getAttribute('data-cat') || 'all';
          filterAndRenderMarket();
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.toLowerCase().trim();
        filterAndRenderMarket();
      });
    }

    filterAndRenderMarket();

    // 2. POPULATE DASHBOARD STATS & TABLES
    const statsContainer = document.getElementById('spa-stats-container');
    if (statsContainer) {
      const stats = [
        { label: 'Active Listings', val: (data.materials || []).length || 12, target: 'dash-sec-listings', icon: '⬡' },
        { label: 'Potential Matches', val: (data.matches || []).length || 8, target: 'net-value', icon: '◈' },
        { label: 'Incoming Offers', val: 4, target: 'dash-sec-offers', icon: '⚡' },
        { label: 'Active Negotiations', val: (data.negotiations || []).length || 3, target: 'dash-sec-negotiations', icon: '💬' }
      ];

      statsContainer.innerHTML = stats.map(s => `
        <div class="stat-card rx-reveal-item slide-up visible" onclick="window.RX_SPA.scrollToId('${s.target}')" onmousemove="window.RX_SPA && window.RX_SPA.handleCard3DParallax(event, this)" onmouseleave="window.RX_SPA && window.RX_SPA.resetCard3DParallax(this)">
          <div class="rx-card-glare"></div>
          <div class="stat-top">
            <span class="stat-label">${s.label}</span>
            <div class="stat-icon" style="transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);">${s.icon}</div>
          </div>
          <div class="stat-value">${s.val}</div>
          <div class="stat-trend">↓ Scroll to section</div>
        </div>
      `).join('');
    }

    // Dashboard Listings
    const dashListings = document.getElementById('dash-listings-tbody');
    if (dashListings) {
      const mats = (data.materials || []).slice(0, 5);
      dashListings.innerHTML = mats.map(m => `
        <tr>
          <td><span class="tech-id">${m.id}</span></td>
          <td>
            <strong style="color:#F2EFE7;">${m.name}</strong><br>
            <span style="font-size:0.75rem; color:#A8A5A0;">${m.category || 'Industrial'} &bull; ${m.location || 'India'}</span>
          </td>
          <td><strong style="color:#C4AD7A;">${Number(m.quantity || 0).toLocaleString()}</strong> ${m.unit || 'kg'}</td>
          <td><span class="status-pill active">${m.status || 'Active'}</span></td>
          <td style="text-align:right;">
            <button type="button" class="table-action-btn" onclick="window.RX_SPA.openDetailModal('${m.id}')">View Details &rarr;</button>
          </td>
        </tr>
      `).join('');
    }

    // Dashboard Negotiations
    const dashNeg = document.getElementById('dash-negotiations-tbody');
    if (dashNeg) {
      const negs = data.negotiations || [];
      dashNeg.innerHTML = negs.map(n => {
        const msgs = n.messages || [];
        const lastMsg = msgs.length > 0 ? (msgs[msgs.length - 1].text || '') : 'Inquiry initialized';
        const preview = lastMsg.length > 40 ? lastMsg.substring(0, 40) + '...' : lastMsg;
        return `
          <tr>
            <td><span class="tech-id">${n.materialId || 'RX-AL-9402'}</span></td>
            <td><strong style="color:#F2EFE7;">${n.buyerName || n.buyer || 'Buyer Facility'}</strong></td>
            <td><span style="color:#A8A5A0; font-style:italic;">"${preview}"</span></td>
            <td><span class="status-pill pending">${n.status || 'Active Negotiation'}</span></td>
            <td style="text-align:right;">
              <button class="table-action-btn" onclick="window.RX_SPA.viewNegotiation('${n.buyerName || 'Buyer'}', '${n.materialId || 'RX-AL-9402'}')">View Thread</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // 3. POPULATE NET-VALUE MATCHES TABLE
    const matchesTable = document.getElementById('spa-matches-table');
    if (matchesTable) {
      const matches = Array.isArray(data.matches) ? data.matches : [];
      matchesTable.innerHTML = matches.map(m => `
        <tr>
          <td><span class="tech-id">${m.materialId || 'RX-AL-9402'}</span></td>
          <td><strong>${m.buyerName || m.buyer || 'Secondary Smelter'}</strong></td>
          <td><span style="color:#3A8D65; font-weight:700;">${m.compatibility || 90}%</span></td>
          <td><strong style="color:#C4AD7A;">₹${Number(m.estimatedNetValue || 185000).toLocaleString('en-IN')}</strong></td>
          <td>${m.distance || 45} km</td>
          <td style="text-align:right;">
            <button type="button" class="table-action-btn primary" onclick="window.RX_SPA.openDetailModal('${m.materialId || 'RX-AL-9402'}')">View Specs</button>
          </td>
        </tr>
      `).join('');
    }

    // 4. POPULATE MATERIAL BANK TABLE
    const bankTable = document.getElementById('spa-bank-table');
    if (bankTable) {
      const entries = data.bankEntries || [];
      bankTable.innerHTML = entries.map(b => `
        <tr>
          <td><span class="tech-id">${b.materialId}</span></td>
          <td><strong>${b.materialName || b.materialType}</strong></td>
          <td><strong style="color:#C4AD7A;">${Number(b.quantity || 0).toLocaleString()}</strong> ${b.unit || 'kg'}</td>
          <td>50,000 kg</td>
          <td>₹${b.currentAsk || 90}/${b.unit || 'kg'}</td>
          <td><span class="status-pill banked">Listed in Bank</span></td>
        </tr>
      `).join('');
    }

    // 4b. POPULATE CONTINUOUS SEAMLESS BANK CAROUSEL (60 FPS)
    const carouselTrack = document.getElementById('rx-bank-carousel-track');
    if (carouselTrack) {
      const carouselItems = [
        { id: 'RX-BK-01', name: '6063 Aluminium Extrusion Scrap', category: 'Metals', vol: 34200, target: 50000, ask: 94, purity: '94.8%' },
        { id: 'RX-BK-02', name: 'Recycled PP Polymer Pellets', category: 'Polymers', vol: 18500, target: 25000, ask: 68, purity: '98.2%' },
        { id: 'RX-BK-03', name: 'Clear Float Glass Cullet', category: 'Glass', vol: 82000, target: 100000, ask: 18, purity: '99.1%' },
        { id: 'RX-BK-04', name: 'Electrolytic Copper Busbar Scrap', category: 'Metals', vol: 12800, target: 15000, ask: 420, purity: '99.5%' },
        { id: 'RX-BK-05', name: 'Post-Industrial Cotton Yarn Waste', category: 'Textile', vol: 24500, target: 30000, ask: 42, purity: '92.0%' },
        { id: 'RX-BK-06', name: 'Granulated Blast Furnace Slag', category: 'Minerals', vol: 145000, target: 200000, ask: 6.5, purity: '96.4%' }
      ];

      function renderCarouselCard(item) {
        const pct = Math.min(Math.round((item.vol / item.target) * 100), 100);
        return `
          <div class="rx-carousel-card" onmousemove="window.RX_SPA && window.RX_SPA.handleCard3DParallax(event, this)" onmouseleave="window.RX_SPA && window.RX_SPA.resetCard3DParallax(this)" onclick="window.RX_SPA.openDetailModal('${item.id}')">
            <div class="rx-card-glare"></div>
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                <span class="tech-id">${item.id}</span>
                <span class="status-pill active" style="font-size:0.7rem; padding:2px 8px;">Pooling: ${pct}%</span>
              </div>
              <h4 style="font-family:'Space Grotesk',sans-serif; font-size:1.05rem; font-weight:700; color:#F2EFE7; margin:0 0 0.35rem; line-height:1.3;">${item.name}</h4>
              <p style="color:#A8A5A0; font-size:0.78rem; margin:0; font-family:'JetBrains Mono',monospace;">${item.category} &bull; Purity: <span style="color:#3A8D65; font-weight:600;">${item.purity}</span></p>
              
              <div class="carousel-progress-track">
                <div class="carousel-progress-fill" style="width: ${pct}%;"></div>
              </div>

              <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#A8A5A0; font-family:'JetBrains Mono',monospace; margin-bottom:0.75rem;">
                <span>${(item.vol / 1000).toFixed(1)}T / ${(item.target / 1000).toFixed(0)}T</span>
                <span style="color:#C4AD7A;">Escrow Target</span>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; padding-top:0.75rem; border-top:1px solid rgba(201,196,184,0.08);">
              <div>
                <div style="font-size:0.68rem; color:#A8A5A0; font-family:'JetBrains Mono',monospace;">Reserve Ask</div>
                <div style="font-family:'Space Grotesk',sans-serif; font-size:1.15rem; font-weight:700; color:#C4AD7A;">₹${item.ask}/kg</div>
              </div>
              <span class="table-action-btn primary" style="padding:4px 10px; font-size:0.75rem; display:inline-flex; align-items:center; gap:4px;">
                Inspect <span class="rx-arrow">&rarr;</span>
              </span>
            </div>
          </div>
        `;
      }

      // Seamless infinite loop: duplicate items list side-by-side
      const fullList = [...carouselItems, ...carouselItems];
      carouselTrack.innerHTML = fullList.map(renderCarouselCard).join('');
    }

    // 5. POPULATE JOURNEYS TABLE
    const journeyTable = document.getElementById('spa-journey-table');
    if (journeyTable) {
      const journeys = data.journeys || [];
      journeyTable.innerHTML = journeys.map(j => {
        const stages = j.stages || [];
        const current = stages[stages.length - 1]?.label || 'In Transit';
        return `
          <tr>
            <td><span class="tech-id">${j.materialId || j.id}</span></td>
            <td><strong>Aluminium Stream</strong></td>
            <td>Precision CNC Works</td>
            <td><strong style="color:#F2EFE7;">${current}</strong></td>
            <td><span class="status-pill active">Verified Custody</span></td>
          </tr>
        `;
      }).join('');
    }

    // 6. SETUP SCROLLSPY, SCROLL REVEALS, STATISTICS COUNTER & PARALLAX
    setupScrollSpy();
    setupScrollReveals();
    setupStatisticsCounter();
    setupParallax();
  }

  // Material Card Template with Staggered Entrance, Continuous Floating & 3D Depth Parallax
  function createMaterialCard(m, idx = 0) {
    const delay = Math.min(idx * 45, 360);
    const floatClass = `market-card-float-${idx % 4}`;
    return `
    <div class="table-card rx-reveal-item visible market-card-seq ${floatClass}" style="animation-delay: ${delay}ms; display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden;" onmousemove="window.RX_SPA && window.RX_SPA.handleCard3DParallax(event, this)" onmouseleave="window.RX_SPA && window.RX_SPA.resetCard3DParallax(this)">
      <div class="rx-card-glare"></div>
      <div class="market-card-internal-scan" aria-hidden="true"></div>
      <div class="market-card-inner">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span class="tech-id">${m.id}</span>
          <span class="status-pill active">${m.status === 'banked' ? 'Banked' : 'Available'}</span>
        </div>
        <h3 style="font-family:'Space Grotesk',sans-serif; font-size:1.25rem; font-weight:700; color:#F2EFE7; margin:0 0 0.4rem;">${m.name}</h3>
        <p style="color:#A8A5A0; font-size:0.82rem; margin:0 0 1.25rem;">${m.category || 'Industrial'} &bull; ${m.location || 'India'}</p>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; background:rgba(15,18,16,0.6); padding:0.75rem; border-radius:8px; margin-bottom:1.25rem; font-size:0.8rem;">
          <div><span style="color:#A8A5A0;">Quantity:</span> <strong class="market-data-live" style="color:#F2EFE7;">${Number(m.quantity || 0).toLocaleString()} ${m.unit || 'kg'}</strong></div>
          <div><span style="color:#A8A5A0;">Condition:</span> <strong class="market-data-live" style="color:#F2EFE7;">${m.condition || 'Sorted'}</strong></div>
        </div>
      </div>

      <div class="market-card-footer" style="display:flex; justify-content:space-between; align-items:center; padding-top:1rem; border-top:1px solid rgba(201,196,184,0.08);">
        <div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:#A8A5A0;">Landed Ref</div>
          <div class="market-price-val" style="font-family:'Space Grotesk',sans-serif; font-size:1.25rem; font-weight:700; color:#C4AD7A;">₹${m.askingPrice || 92}/${m.unit || 'kg'}</div>
        </div>
        <button type="button" onclick="window.RX_SPA.openDetailModal('${m.id}')" class="table-action-btn primary market-card-btn">
          <span>View Details</span> <span class="btn-arrow" style="display:inline-block; transition:transform 0.2s ease; margin-left:4px;">&rarr;</span>
        </button>
      </div>
    </div>
    `;
  }

  /* 3D Mouse-Follow Tilt, Glare, & Depth Parallax (60 FPS with RAF) */
  let cardRaf = null;
  window.RX_SPA.handleCard3DParallax = function (e, card) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    if (cardRaf) cancelAnimationFrame(cardRaf);
    cardRaf = requestAnimationFrame(() => {
      card.style.setProperty('--mouse-x', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${(y * 100).toFixed(1)}%`);
      const rotX = (-(y - 0.5) * 10).toFixed(2);
      const rotY = ((x - 0.5) * 10).toFixed(2);
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale3d(1.025, 1.025, 1.025)`;

      const tiltX = ((x - 0.5) * 4).toFixed(2);
      const tiltY = ((y - 0.5) * 4).toFixed(2);
      card.style.setProperty('--card-tilt-x', `${tiltX}px`);
      card.style.setProperty('--card-tilt-y', `${tiltY}px`);
    });
  };

  window.RX_SPA.resetCard3DParallax = function (card) {
    if (cardRaf) cancelAnimationFrame(cardRaf);
    card.style.transform = '';
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
    card.style.removeProperty('--card-tilt-x');
    card.style.removeProperty('--card-tilt-y');
  };

  // Backwards compatibility alias
  window.RX_SPA.handleCardParallax = window.RX_SPA.handleCard3DParallax;
  window.RX_SPA.resetCardParallax = window.RX_SPA.resetCard3DParallax;

  /* ---- DYNAMIC 3D CONTENT SWITCHER ENGINE (SLIDING, ROLLING & SPINNING) ---- */
  const MODULES = ['home', 'marketplace', 'net-value', 'material-journey', 'material-bank', 'about', 'dashboard'];
  let currentModule = 'home';
  let isSwitching = false;

  function ensureSwitchMode() {
    if (document.body.classList.contains('switch-mode')) return;
    document.body.classList.add('switch-mode');
    document.querySelectorAll('.scroll-section').forEach(s => {
      s.classList.toggle('active-module', s.id === currentModule);
    });
  }

  window.RX_SPA.switchToModule = function (targetId) {
    if (!targetId) return;
    targetId = targetId.replace('#', '').replace('/', '');
    if (!MODULES.includes(targetId)) targetId = 'home';

    if (isSwitching) return;

    const oldId = currentModule;
    const oldEl = document.getElementById(oldId);
    const newEl = document.getElementById(targetId);
    if (!newEl) return;

    ensureSwitchMode();

    const oldIdx = MODULES.indexOf(oldId);
    const newIdx = MODULES.indexOf(targetId);
    const isForward = newIdx >= oldIdx;

    const portal = document.getElementById('rx-spin-portal');

    // If in switch-mode (default 3D content switcher)
    if (document.body.classList.contains('switch-mode')) {
      if (oldId === targetId && oldEl && oldEl.classList.contains('active-module')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      isSwitching = true;
      if (portal) portal.classList.add('active');

      if (oldEl) {
        oldEl.classList.remove('rx-content-entering-forward', 'rx-content-entering-backward');
        oldEl.classList.add(isForward ? 'rx-content-exiting-forward' : 'rx-content-exiting-backward');
      }

      setTimeout(() => {
        if (oldEl) {
          oldEl.classList.remove('active-module', 'rx-content-exiting-forward', 'rx-content-exiting-backward');
        }

        newEl.classList.add('active-module', isForward ? 'rx-content-entering-forward' : 'rx-content-entering-backward');
        window.scrollTo({ top: 0, behavior: 'instant' });

        currentModule = targetId;
        window.history.replaceState(null, '', '#' + targetId);

        // Update nav active indicators
        document.querySelectorAll('[data-scroll]').forEach(l => {
          l.classList.toggle('active', l.getAttribute('data-scroll') === targetId);
        });

        setTimeout(() => {
          if (portal) portal.classList.remove('active');
          newEl.classList.remove('rx-content-entering-forward', 'rx-content-entering-backward');
          isSwitching = false;
        }, 360);
      }, 200);

    } else {
      // Continuous Scroll Mode
      currentModule = targetId;
      newEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelectorAll('[data-scroll]').forEach(l => {
        l.classList.toggle('active', l.getAttribute('data-scroll') === targetId);
      });
      window.history.replaceState(null, '', '#' + targetId);
    }
  };

  window.RX_SPA.switchStep = function (delta) {
    const idx = MODULES.indexOf(currentModule);
    let nextIdx = idx + delta;
    if (nextIdx < 0) nextIdx = MODULES.length - 1;
    if (nextIdx >= MODULES.length) nextIdx = 0;
    window.RX_SPA.switchToModule(MODULES[nextIdx]);
  };

  window.RX_SPA.toggleMode = function () {
    const isSwitch = document.body.classList.toggle('switch-mode');
    if (!isSwitch) {
      document.querySelectorAll('.scroll-section').forEach(s => s.classList.add('active-module'));
      const activeSec = document.getElementById(currentModule);
      if (activeSec) activeSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.RX && window.RX.toast) {
        window.RX.toast('Continuous Scroll Mode Active', 'info');
      }
    } else {
      document.querySelectorAll('.scroll-section').forEach(s => {
        s.classList.toggle('active-module', s.id === currentModule);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.RX && window.RX.toast) {
        window.RX.toast('3D Content Switching Mode Active', 'success');
      }
    }
  };

  // scrollToId smoothly scrolls to target section in continuous mode or switches in switch mode
  window.RX_SPA.scrollToId = function (id) {
    if (!id) return;
    id = id.replace('#', '').replace('/', '');
    if (!MODULES.includes(id)) id = 'home';
    ensureSwitchMode();
    window.RX_SPA.switchToModule(id);
  };

  /* ---- SCROLLSPY (Highlights active navbar links during scrolling) ---- */
  function setupScrollSpy() {
    if (document.body.classList.contains('switch-mode')) return;

    const sections = ['home', 'marketplace', 'net-value', 'material-journey', 'material-bank', 'about', 'dashboard'];
    
    function onScroll() {
      const scrollPos = window.scrollY + 160;
      let current = sections[0];

      for (let i = 0; i < sections.length; i++) {
        const sec = document.getElementById(sections[i]);
        if (sec) {
          const top = sec.getBoundingClientRect().top + window.scrollY;
          if (top <= scrollPos) {
            current = sections[i];
          }
        }
      }

      document.querySelectorAll('[data-scroll]').forEach(link => {
        const target = link.getAttribute('data-scroll');
        link.classList.toggle('active', target === current);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- SCROLL REVEALS (SLIDING & ROLLING 3D REVEALS) ---- */
  function setupScrollReveals() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.rx-reveal-item').forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.rx-reveal-item').forEach(el => observer.observe(el));
  }

  /* ---- STATISTICS COUNTER WITH SMOOTH EASING & INTERSECTION OBSERVER ---- */
  function setupStatisticsCounter() {
    const counters = document.querySelectorAll('.stat-number-counter');
    if (!counters.length) return;

    let hasAnimated = false;

    function runCounters() {
      if (hasAnimated) return;
      hasAnimated = true;

      counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target') || '0');
        const format = counter.getAttribute('data-format') || '';
        const duration = 1600;
        const startTime = performance.now();

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic for smooth deceleration
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = target * easeProgress;

          let formatted = '';
          if (format === '+,standard') {
            formatted = Math.round(currentVal).toLocaleString('en-IN') + '+';
          } else if (format === '₹,Cr,1') {
            formatted = '₹' + currentVal.toFixed(1) + ' Cr';
          } else if (format === '%,1') {
            formatted = currentVal.toFixed(1) + '%';
          } else if (format === '%') {
            formatted = Math.round(currentVal) + '%';
          } else {
            formatted = Math.round(currentVal).toString();
          }

          counter.textContent = formatted;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            if (format === '+,standard') counter.textContent = Number(target).toLocaleString('en-IN') + '+';
            else if (format === '₹,Cr,1') counter.textContent = '₹' + target.toFixed(1) + ' Cr';
            else if (format === '%,1') counter.textContent = target.toFixed(1) + '%';
            else if (format === '%') counter.textContent = Math.round(target) + '%';
          }
        }

        requestAnimationFrame(update);
      });
    }

    const statsContainer = document.querySelector('.hero-seq-stats') || counters[0].parentElement.parentElement;
    if (statsContainer && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            runCounters();
            observer.disconnect();
          }
        });
      }, { threshold: 0.15 });
      observer.observe(statsContainer);
    } else {
      setTimeout(runCounters, 500);
    }
  }

  /* ---- AMBIENT BACKGROUND PARALLAX ON SCROLL ---- */
  function setupParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          document.querySelectorAll('.ambient-glow').forEach((glow, i) => {
            const speed = (i + 1) * 0.05;
            glow.style.transform = `translateY(${scrolled * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---- API BACKEND CONFIGURATION ---- */
  function getApiBase() {
    if (window.location.port === '5000' || (!window.location.port && window.location.protocol.startsWith('http'))) {
      return '';
    }
    return 'http://localhost:5000';
  }

  /* ---- MODAL HANDLERS & OFFICIAL GOOGLE IDENTITY SERVICES (GIS) ---- */
  window.RX_GOOGLE_CLIENT_ID = window.RX_GOOGLE_CLIENT_ID || localStorage.getItem('rx_google_client_id') || '';

  window.RX_SPA.openLoginModal = function () {
    const userStr = localStorage.getItem('rx_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u && u.name) {
          if (window.RX && window.RX.toast) {
            window.RX.toast(`Already signed in as ${u.name}`, 'info');
          }
          return;
        }
      } catch (e) {}
    }
    const m = document.getElementById('spa-login-modal');
    if (m) {
      m.style.display = 'flex';
      void m.offsetHeight; // trigger reflow for smooth opacity/scale entrance
      m.classList.add('active');
      
      // Preselect all roles for demo by default
      setTimeout(() => {
        const selectAll = document.getElementById('rx-select-all');
        const checkboxes = document.querySelectorAll('.rx-role-checkbox');
        if (selectAll && checkboxes.length === 3) {
          selectAll.checked = true;
          checkboxes.forEach(cb => {
            cb.checked = true;
          });
        }
        
        // Set demo email if empty
        const emailInput = document.getElementById('rx-demo-email');
        if (emailInput && !emailInput.value) {
          emailInput.value = 'demo@resourcex.com';
        }
      }, 50);
    }
    const status = document.getElementById('google-auth-status');
    if (status) status.textContent = '';
    window.RX_SPA.initOfficialGoogleGIS();
  };

  window.RX_SPA.closeLoginModal = function () {
    const m = document.getElementById('spa-login-modal');
    if (m) {
      m.classList.remove('active');
      setTimeout(() => {
        if (!m.classList.contains('active')) {
          m.style.display = 'none';
        }
      }, 250);
    }
  };

  // Toggle all role checkboxes
  window.RX_SPA.toggleAllRoles = function () {
    const selectAll = document.getElementById('rx-select-all');
    const checkboxes = document.querySelectorAll('.rx-role-checkbox');
    if (selectAll && checkboxes) {
      const isChecked = selectAll.checked;
      checkboxes.forEach(cb => {
        cb.checked = isChecked;
      });
    }
  };

  // Demo email login function
  window.RX_SPA.executeDemoEmailLogin = function () {
    const email = document.getElementById('rx-demo-email')?.value || 'demo@resourcex.com';
    const name = email.split('@')[0];
    
    // Get selected roles
    const selectedRoles = [];
    if (document.getElementById('rx-role-seller')?.checked) selectedRoles.push('seller');
    if (document.getElementById('rx-role-buyer')?.checked) selectedRoles.push('buyer');
    if (document.getElementById('rx-role-logistics')?.checked) selectedRoles.push('logistics');
    
    // If no roles selected, select all for demo
    if (selectedRoles.length === 0) {
      selectedRoles.push('seller', 'buyer', 'logistics');
    }
    
    // Create role description text
    const roleText = selectedRoles.map(role => {
      switch(role) {
        case 'seller': return 'Generator/Seller';
        case 'buyer': return 'Processor/Buyer';
        case 'logistics': return 'Logistics Partner';
        default: return role;
      }
    }).join(', ');
    
    // Create the session based on selected roles
    const user = { 
      name: name.charAt(0).toUpperCase() + name.slice(1), 
      email, 
      avatar: name.charAt(0).toUpperCase(), 
      provider: 'Email Demo', 
      authenticated: true,
      roles: selectedRoles,
      role: selectedRoles.length > 1 ? 'Multi-Role Partner' : roleText,
      role_key: selectedRoles.length > 1 ? 'multi' : selectedRoles[0],
      facility: name.charAt(0).toUpperCase() + name.slice(1) + " Industrial Corp",
      location: "Global Logistics Hub",
      has_all_roles: selectedRoles.length === 3
    };
    
    localStorage.setItem('rx_user', JSON.stringify(user));
    window.RX_SPA.closeLoginModal();

    if (window.RX && window.RX.refreshNavUser) {
      window.RX.refreshNavUser();
    }
    if (window.RX && window.RX.toast) {
      const roleMessage = selectedRoles.length === 3 ? 
        'with ALL roles (Seller, Buyer, Logistics)' : 
        `with ${selectedRoles.length} role(s): ${roleText}`;
      window.RX.toast(`Signed in successfully as ${user.name} ${roleMessage}`, 'success');
    }
    
    // Apply RBAC if available
    if (window.RX_RBAC) {
      window.RX_RBAC.applyAccess(user);
    }
  };

  // Keyboard shortcut: Escape closes modal
  if (!window._rxModalEscBound) {
    window._rxModalEscBound = true;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const m = document.getElementById('spa-login-modal');
        if (m && (m.style.display === 'flex' || m.classList.contains('active'))) {
          window.RX_SPA.closeLoginModal();
        }
      }
    });
  }

  // UI state updaters for Hero and Dashboard
  window.RX_SPA.updateHeroAuthSlot = function (user) {
    const slot = document.getElementById('hero-auth-slot');
    if (!slot) return;
    if (user && user.name) {
      const avatarHtml = user.picture
        ? `<img src="${user.picture}" alt="${user.name}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1.5px solid #C4AD7A;display:inline-block;" referrerpolicy="no-referrer">`
        : `<span style="width:28px;height:28px;border-radius:50%;background:#1A73E8;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">${user.avatar || user.name.charAt(0)}</span>`;

      slot.innerHTML = `
        <div id="hero-user-profile-badge" style="display:inline-flex; align-items:center; gap:10px; padding:6px 14px 6px 8px; border-radius:30px; background:rgba(20,24,22,0.85); border:1px solid rgba(196,173,122,0.35); box-shadow:0 4px 16px rgba(0,0,0,0.3); backdrop-filter:blur(8px);">
          ${avatarHtml}
          <div style="display:flex; flex-direction:column; text-align:left;">
            <span style="font-weight:600; color:#F2EFE7; font-size:0.92rem; line-height:1.2;">${user.name}</span>
            <span style="font-size:0.75rem; color:#A8A5A0; font-family:'JetBrains Mono',monospace;">${user.email || 'Verified Partner'}</span>
          </div>
          <button type="button" onclick="window.RX && window.RX.logout && window.RX.logout()" title="Sign Out" style="background:transparent; border:none; color:#C4AD7A; font-size:0.8rem; cursor:pointer; padding:3px 8px; margin-left:6px; text-decoration:underline; font-family:'JetBrains Mono',monospace;">Sign Out</button>
        </div>
      `;
    } else {
      slot.innerHTML = `
        <button type="button" id="hero-google-auth-btn" onclick="window.RX_SPA.openLoginModal()" class="rx-btn" style="background:transparent; border:1px solid rgba(201,196,184,0.25); color:#F2EFE7; padding: 0.85rem 1.4rem;">
          <span>Sign In with Google</span>
        </button>
      `;
    }
  };

  window.RX_SPA.updateDashboardUser = function (user) {
    const avatarEl = document.getElementById('dash-user-avatar');
    const titleEl = document.getElementById('dash-user-title');
    const subEl = document.getElementById('dash-user-subtitle');

    if (user && user.name) {
      if (avatarEl) {
        avatarEl.innerHTML = user.picture
          ? `<img src="${user.picture}" alt="${user.name}" style="width:44px; height:44px; border-radius:12px; object-fit:cover; border:2px solid #C4AD7A; display:block;" referrerpolicy="no-referrer">`
          : `<div style="width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg, #1A73E8, #0D47A1); color:#FFF; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:1.3rem; display:flex; align-items:center; justify-content:center;">${user.avatar || user.name.charAt(0)}</div>`;
      }
      if (titleEl) titleEl.textContent = `Welcome back, ${user.name}`;
      if (subEl) subEl.innerHTML = `${user.email} &bull; Industrial Feedstock Facility <span class="rx-badge-demo" style="margin-left:6px;">VERIFIED</span>`;
    } else {
      if (avatarEl) {
        avatarEl.innerHTML = `<div style="width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg, rgba(201,196,184,0.15), rgba(201,196,184,0.05)); color:#C9C4B8; display:flex; align-items:center; justify-content:center; font-size:1.3rem;">⚡</div>`;
      }
      if (titleEl) titleEl.textContent = `Operations Console`;
      if (subEl) subEl.innerHTML = `Industrial Circular Corridor &bull; Traceability Network <span class="rx-badge-demo" style="margin-left:6px;">VERIFIED</span>`;
    }
  };

  // Load public auth configuration from app.py backend
  window.RX_SPA.loadAuthConfig = async function () {
    try {
      const resp = await fetch(getApiBase() + '/api/auth/config');
      const data = await resp.json();
      if (data && data.googleClientId) {
        window.RX_GOOGLE_CLIENT_ID = data.googleClientId;
      }
    } catch (e) {
      console.warn('Could not load auth config from backend:', e);
    }
    window.RX_SPA.initOfficialGoogleGIS();
  };

  // Official Google Identity Services initialization & renderButton
  window.RX_SPA.initOfficialGoogleGIS = function () {
    const mount = document.getElementById('g_id_signin_mount');
    const statusEl = document.getElementById('google-auth-status');
    const setupNotice = document.getElementById('gis-setup-notice');

    if (!mount) return;

    // Check if Google Identity Services library is loaded
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      if (statusEl) {
        statusEl.style.color = '#5F6368';
        statusEl.textContent = 'Loading Google Identity Services...';
      }
      setTimeout(window.RX_SPA.initOfficialGoogleGIS, 250);
      return;
    }

    const clientId = (window.RX_GOOGLE_CLIENT_ID || '').trim();

    // If Client ID is not yet provided
    if (!clientId || clientId.startsWith('YOUR_GOOGLE_CLIENT_ID')) {
      if (setupNotice) setupNotice.style.display = 'block';
      if (statusEl) statusEl.textContent = '';
      mount.innerHTML = `
        <div style="font-size:0.88rem; color:#5F6368; text-align:center; padding:0.5rem 0;">
          Awaiting Google Client ID configuration...
        </div>
      `;
      return;
    }

    if (setupNotice) setupNotice.style.display = 'none';
    if (statusEl) statusEl.textContent = '';

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: window.handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      mount.innerHTML = '';
      window.google.accounts.id.renderButton(mount, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        logo_alignment: 'left',
        width: 320
      });

      // Prompt One-Tap if allowed
      try {
        window.google.accounts.id.prompt();
      } catch (promptErr) {}

    } catch (err) {
      console.error('Failed to render official Google button:', err);
      if (statusEl) {
        statusEl.style.color = '#D93025';
        statusEl.textContent = 'Google Identity error: ' + err.message;
      }
    }
  };

  // Save Client ID directly from modal setup input
  window.RX_SPA.saveAndInitClientId = function () {
    const input = document.getElementById('gis-input-client-id');
    const status = document.getElementById('google-auth-status');
    const val = input ? input.value.trim() : '';
    if (!val || val.startsWith('YOUR_')) {
      if (status) {
        status.style.color = '#D93025';
        status.textContent = 'Please enter a valid Google Web Client ID.';
      }
      return;
    }
    window.RX_GOOGLE_CLIENT_ID = val;
    localStorage.setItem('rx_google_client_id', val);
    if (status) {
      status.style.color = '#0F9D58';
      status.textContent = 'Client ID saved! Initializing Google Sign-In...';
    }
    setTimeout(window.RX_SPA.initOfficialGoogleGIS, 300);
  };

  // Official GIS Credential Response Callback (Receives Google ID Token)
  window.handleGoogleCredentialResponse = async function (response) {
    const statusEl = document.getElementById('google-auth-status');
    if (statusEl) {
      statusEl.style.color = '#1A73E8';
      statusEl.textContent = 'Verifying Google credentials with backend...';
    }

    if (!response || !response.credential) {
      if (statusEl) {
        statusEl.style.color = '#D93025';
        statusEl.textContent = 'Authentication was cancelled or no ID token received.';
      }
      return;
    }

    try {
      const resp = await fetch(getApiBase() + '/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: response.credential })
      });

      const data = await resp.json();
      if (!resp.ok || !data.success || !data.user) {
        throw new Error(data.error || 'Backend failed to verify Google ID token.');
      }

      const user = data.user;
      
      // Handle new flow: needs profile setup (role selection)
      if (data.needsProfileSetup) {
        localStorage.setItem('rx_temp_user', JSON.stringify(user));
        window.RX_SPA.closeLoginModal();
        
        // Show role selection modal
        if (window.RX_RBAC && window.RX_RBAC.showRoleSelectionModal) {
          setTimeout(() => {
            window.RX_RBAC.showRoleSelectionModal(user);
          }, 300);
        }
        if (statusEl) {
          statusEl.style.color = '#0F9D58';
          statusEl.textContent = 'Please select your role to continue...';
        }
      } else {
        // User already has role/org set up - direct login
        localStorage.setItem('rx_user', JSON.stringify(user));
        window.RX_SPA.closeLoginModal();

        if (window.RX && window.RX.refreshNavUser) {
          window.RX.refreshNavUser();
        }
        if (window.RX && window.RX.toast) {
          window.RX.toast(`Signed in with Google as ${user.name}`, 'success');
        }

        // Refresh greeting text in dashboard section
        const title = document.querySelector('#dashboard h2');
        if (title) title.textContent = `Welcome back, ${user.name}`;

        // Smooth scroll down to dashboard
        window.RX_SPA.scrollToId('dashboard');
      }

    } catch (err) {
      console.error('Google verification error:', err);
      if (statusEl) {
        statusEl.style.color = '#D93025';
        statusEl.textContent = err.message;
      }
    }
  };

  // Synchronize session on load with app.py backend
  async function checkBackendSession() {
    try {
      const res = await fetch(getApiBase() + '/api/auth/session', { credentials: 'include' });
      const data = await res.json();
      
      if (data.authenticated && data.user) {
        // User is fully authenticated
        localStorage.setItem('rx_user', JSON.stringify(data.user));
        if (window.RX && window.RX.refreshNavUser) {
          window.RX.refreshNavUser();
        }
      } else if (data.needsProfileSetup && data.tempUser) {
        // User authenticated with Google but needs to complete profile (role selection)
        localStorage.setItem('rx_temp_user', JSON.stringify(data.tempUser));
        if (window.RX_RBAC && window.RX_RBAC.showRoleSelectionModal) {
          setTimeout(() => {
            window.RX_RBAC.showRoleSelectionModal(data.tempUser);
          }, 500);
        }
      } else if (!data.authenticated) {
        if (localStorage.getItem('rx_user')) {
          localStorage.removeItem('rx_user');
          if (window.RX && window.RX.refreshNavUser) {
            window.RX.refreshNavUser();
          }
        }
      }
    } catch (e) {
      // Offline / fallback mode
    }
  }

  window.RX_SPA.openListModal = function () {
    const m = document.getElementById('spa-list-modal');
    if (m) m.style.display = 'flex';
  };
  window.RX_SPA.closeListModal = function () {
    const m = document.getElementById('spa-list-modal');
    if (m) m.style.display = 'none';
  };

  window.RX_SPA.handleListSubmit = function () {
    const nameEl = document.getElementById('stream-name');
    const catEl = document.getElementById('stream-cat');
    const qtyEl = document.getElementById('stream-qty');
    const askEl = document.getElementById('stream-ask');
    const locEl = document.getElementById('stream-loc');

    const name = nameEl?.value?.trim();
    const cat = catEl?.value;
    const qty = parseFloat(qtyEl?.value);
    const ask = parseFloat(askEl?.value);
    const loc = locEl?.value?.trim();

    if (!name || !cat || !qty || qty <= 0 || !ask || ask <= 0 || !loc) {
      if (window.RX && window.RX.toast) {
        window.RX.toast('Please fill all required fields with valid values.', 'error');
      }
      return;
    }

    const newMaterial = {
      id: 'RX-NEW-' + Math.floor(1000 + Math.random() * 9000),
      name: name,
      category: cat,
      quantity: qty,
      unit: 'kg',
      askingPrice: ask,
      condition: 'Sorted',
      location: loc,
      status: 'active',
      demo: true
    };

    if (window.RX_DATA && window.RX_DATA.materials) {
      window.RX_DATA.materials.unshift(newMaterial);
    }

    window.RX_SPA.closeListModal();

    if (window.RX && window.RX.toast) {
      window.RX.toast(`Stream ${newMaterial.id} registered! (Demo)`, 'success');
    }

    initializeAllSections();
    window.RX_SPA.scrollToId('marketplace');
  };

  window.RX_SPA.openDetailModal = function (materialId) {
    const data = window.RX_DATA || {};
    const mats = data.materials || [];
    const mat = mats.find(m => m.id === materialId) || mats[0];
    const modal = document.getElementById('spa-detail-modal');
    const body = document.getElementById('spa-detail-modal-body');
    if (!modal || !body || !mat) return;

    const specs = mat.specifications || {};
    const specsHtml = Object.keys(specs).map(k =>
      `<div style="display:flex; justify-content:space-between; padding:0.35rem 0; border-bottom:1px solid rgba(201,196,184,0.06);">
        <span style="color:#A8A5A0; font-size:0.8rem; text-transform:capitalize;">${k.replace(/([A-Z])/g, ' $1')}</span>
        <span style="color:#E8E4DB; font-size:0.8rem; font-family:'JetBrains Mono',monospace;">${specs[k]}</span>
      </div>`
    ).join('');

    const appsHtml = (mat.applications || []).map(a =>
      `<span style="display:inline-block; padding:2px 8px; background:rgba(45,112,80,0.15); border:1px solid rgba(45,112,80,0.25); border-radius:4px; font-size:0.75rem; color:#3A8D65; font-family:'JetBrains Mono',monospace;">${a}</span>`
    ).join(' ');

    body.innerHTML = `
      <button type="button" onclick="window.RX_SPA.closeDetailModal()" aria-label="Close material detail" style="position:absolute; top:1.25rem; right:1.25rem; background:none; border:none; font-size:1.5rem; color:#A8A5A0; cursor:pointer; z-index:10;">&times;</button>
      
      <div style="margin-bottom:1.25rem;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="tech-id">${mat.id}</span>
          <span class="status-pill ${mat.status === 'banked' ? 'banked' : 'active'}">${mat.status === 'banked' ? 'Banked' : 'Verified Stream'}</span>
          ${mat.demo ? '<span class="rx-badge-demo">Demo Data</span>' : ''}
        </div>
        <h2 style="font-family:'Space Grotesk',sans-serif; font-size:1.8rem; font-weight:700; color:#F2EFE7; margin:0.5rem 0 0.2rem;">${mat.name}</h2>
        <p style="color:#A8A5A0; font-size:0.88rem; margin:0;">${mat.category} &bull; ${mat.location}</p>
      </div>

      ${mat.description ? `<p style="color:#C9C4B8; font-size:0.88rem; line-height:1.6; margin-bottom:1.25rem;">${mat.description}</p>` : ''}

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; padding:1rem; background:rgba(15,18,16,0.6); border-radius:10px; margin-bottom:1.25rem; font-size:0.85rem;">
        <div><span style="color:#A8A5A0;">Grade:</span> <strong style="color:#F2EFE7;">${mat.grade || 'N/A'}</strong></div>
        <div><span style="color:#A8A5A0;">Form:</span> <strong style="color:#F2EFE7;">${mat.form || 'N/A'}</strong></div>
        <div><span style="color:#A8A5A0;">Quantity:</span> <strong style="color:#F2EFE7;">${Number(mat.quantity || 0).toLocaleString()} ${mat.unit || 'kg'}</strong></div>
        <div><span style="color:#A8A5A0;">Condition:</span> <strong style="color:#F2EFE7;">${mat.condition || 'Sorted'}</strong></div>
        <div><span style="color:#A8A5A0;">Asking Price:</span> <strong style="color:#C4AD7A;">${mat.currency || '₹'}${mat.askingPrice || 0}${mat.priceUnit || '/kg'}</strong></div>
        <div><span style="color:#A8A5A0;">Availability:</span> <strong style="color:#3A8D65;">${mat.availability || 'Immediate'}</strong></div>
        <div><span style="color:#A8A5A0;">Contamination:</span> <strong style="color:#F2EFE7;">${mat.contamination || 'Low'}</strong></div>
        <div><span style="color:#A8A5A0;">Seller:</span> <strong style="color:#F2EFE7;">${mat.seller ? mat.seller.name : 'Demo Industrial Facility'}</strong></div>
      </div>

      ${appsHtml ? `<div style="margin-bottom:1.25rem;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:#A8A5A0; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:0.5rem;">Applications</div>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">${appsHtml}</div>
      </div>` : ''}

      ${specsHtml ? `<div style="margin-bottom:1.5rem;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:#A8A5A0; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:0.5rem;">Specifications</div>
        <div style="background:rgba(15,18,16,0.6); border-radius:8px; padding:0.75rem;">${specsHtml}</div>
      </div>` : ''}

      <div style="display:flex; justify-content:flex-end; gap:0.75rem; padding-top:1rem; border-top:1px solid rgba(201,196,184,0.08);">
        <button type="button" onclick="window.RX_SPA.closeDetailModal();" class="rx-btn rx-btn-secondary rx-btn-sm">Close</button>
        <button type="button" onclick="window.RX_SPA.closeDetailModal(); window.RX_SPA.scrollToId('net-value');" class="rx-btn rx-btn-primary rx-btn-sm">View Matches &rarr;</button>
      </div>
    `;
    modal.style.display = 'flex';
  };

  window.RX_SPA.closeDetailModal = function () {
    const modal = document.getElementById('spa-detail-modal');
    if (modal) modal.style.display = 'none';
  };

  /* ---- LIVE HACKATHON DEMO INTERACTIVE SIMULATORS & HANDLERS ---- */
  window.RX_SPA.acceptOffer = function (btn, streamId, buyer) {
    const row = btn.closest('tr');
    const pill = row ? row.querySelector('.status-pill') : null;
    if (pill) {
      pill.className = 'status-pill active';
      pill.textContent = 'Accepted & Escrowed';
    }
    btn.parentElement.innerHTML = '<span style="color:#3A8D65; font-size:0.8rem; font-weight:600; display:inline-flex; align-items:center; gap:4px;"><span>✓</span> In Escrow</span>';
    if (window.RX && window.RX.toast) {
      window.RX.toast(`Offer accepted for ${streamId} from ${buyer}! Smart contracts dispatched to escrow.`, 'success');
    }
  };

  window.RX_SPA.counterOffer = function (btn, streamId, buyer) {
    const counterAsk = prompt(`Enter counter-offer price per kg for ${buyer} (Current: ₹94.20/kg):`, '96.50');
    if (counterAsk) {
      const row = btn.closest('tr');
      const pill = row ? row.querySelector('.status-pill') : null;
      if (pill) {
        pill.className = 'status-pill pending';
        pill.textContent = `Countered: ₹${counterAsk}/kg`;
      }
      if (window.RX && window.RX.toast) {
        window.RX.toast(`Counter-offer of ₹${counterAsk}/kg transmitted to ${buyer}.`, 'info');
      }
    }
  };

  window.RX_SPA.viewNegotiation = function (buyer, streamId) {
    if (window.RX && window.RX.toast) {
      window.RX.toast(`Encrypted message channel active with ${buyer} (${streamId}) &bull; Verified zero-knowledge handshake.`, 'info');
    }
  };

  window.RX_SPA.selectPipelineStep = function (stepNum) {
    const container = document.getElementById('pipeline-steps-container');
    if (!container) return;
    const steps = container.querySelectorAll('.pipeline-step');
    steps.forEach((s, idx) => {
      const isActive = (idx + 1 === stepNum);
      s.classList.toggle('active', isActive);
      if (isActive) {
        s.style.borderColor = '#3A8D65';
        s.style.background = 'rgba(45, 112, 80, 0.25)';
      } else {
        s.style.borderColor = 'rgba(201, 196, 184, 0.12)';
        s.style.background = 'rgba(18, 22, 20, 0.8)';
      }
    });

    const nodeName = document.getElementById('pipeline-node-name');
    const nodeDesc = document.getElementById('pipeline-node-desc');
    if (!nodeName || !nodeDesc) return;

    const data = [
      {
        name: 'Stage 1 — Factory A (Waste Generator)',
        desc: 'Automobile component manufacturing plant generating CNC aluminium turnings and scrap offcuts. Verified at source.'
      },
      {
        name: 'Stage 2 — ResourceX Byproduct Listing',
        desc: 'Stream cataloged with purity verification (94.8%) and algorithmic landed net-value matching across buyers within 50km.'
      },
      {
        name: 'Stage 3 — Secondary Processor',
        desc: 'EcoRecovery hub performs precision magnetic sorting, shredding, and chemical decontamination with 96.2% yield.'
      },
      {
        name: 'Stage 4 — Secondary Smelter & Processor',
        desc: 'Refining secondary metal, fluxing, and casting into standardized 6063 alloy ingots with zero virgin bauxite.'
      },
      {
        name: 'Stage 5 — Factory B (New Product Manufacturing)',
        desc: 'Consumer hardware manufacturer transforms secondary alloy into lightweight laptop chassis and EV heat spreaders. 100% circular!'
      }
    ];

    const current = data[stepNum - 1] || data[0];
    nodeName.textContent = current.name;
    nodeDesc.textContent = current.desc;
  };

  window.RX_SPA.updateLandedCalc = function () {
    const ask = parseFloat(document.getElementById('calc-ask')?.value || '92');
    const dist = parseFloat(document.getElementById('calc-dist')?.value || '45');
    const purity = parseFloat(document.getElementById('calc-purity')?.value || '94.8');

    const freightPerTon = dist * 80;
    const grossValPerTon = ask * 1000;
    const purityBonusPerTon = (purity - 90) * 1100;
    const trueLandedPerTon = grossValPerTon - freightPerTon + purityBonusPerTon;
    const netPerKg = (trueLandedPerTon / 1000).toFixed(2);
    const diffPct = (((netPerKg - ask) / ask) * 100).toFixed(1);

    const outAsk = document.getElementById('calc-out-ask');
    const outDist = document.getElementById('calc-out-dist');
    const outPurity = document.getElementById('calc-out-purity');
    const outNet = document.getElementById('calc-out-net');
    const outPerKg = document.getElementById('calc-out-perkg');

    if (outAsk) outAsk.textContent = `₹${ask.toFixed(1)}/kg`;
    if (outDist) outDist.textContent = `${dist} km`;
    if (outPurity) outPurity.textContent = `${purity}%`;
    if (outNet) outNet.textContent = `₹${Math.round(trueLandedPerTon).toLocaleString('en-IN')}/T`;
    if (outPerKg) {
      const sign = diffPct >= 0 ? '+' : '';
      outPerKg.textContent = `Effective: ₹${netPerKg}/kg (${sign}${diffPct}% vs Raw FOB)`;
    }
  };

  /* ---- MOUNT MASTER SCROLLER ON LOAD ---- */


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
      seller:    ['home', 'marketplace', 'net-value', 'material-bank', 'material-journey', 'dashboard', 'about'],
      buyer:     ['home', 'marketplace', 'net-value', 'material-journey', 'dashboard', 'about'],
      logistics: ['home', 'marketplace', 'material-journey', 'dashboard', 'about'],
      guest:     ['home', 'marketplace', 'net-value', 'material-journey', 'material-bank', 'about', 'dashboard']
    },

    navByRole: {
      seller:    ['Marketplace', 'Net Value', 'Material Bank', 'Journey', 'Dashboard'],
      buyer:     ['Marketplace', 'Net Value', 'Journey', 'Dashboard'],
      logistics: ['Marketplace', 'Journey', 'Dashboard'],
      guest:     []
    },

    getAllRoles(user) {
      if (!user || !user.name) return ['guest'];
      const roles = [];

      // Check roles array first (multi-role support)
      if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
        user.roles.forEach(r => {
          if (!roles.includes(r)) roles.push(r);
        });
      }

      // Also check role_key
      const roleVal = user.role_key || '';
      if (roleVal && roleVal !== 'multi' && !roles.includes(roleVal)) {
        roles.push(roleVal);
      }

      // Fallback: match by role text
      if (roles.length === 0) {
        const roleText = (user.role || '').toLowerCase();
        if (roleText.includes('buyer') || roleText.includes('processor')) roles.push('buyer');
        if (roleText.includes('logistic') || roleText.includes('transport')) roles.push('logistics');
        if (roleText.includes('seller') || roleText.includes('generator')) roles.push('seller');
      }

      if (roles.length === 0) roles.push('guest');
      return roles;
    },

    getRole(user) {
      return this.getAllRoles(user)[0] || 'guest';
    },

    applyAccess(user) {
      const roles = this.getAllRoles(user);

      // Merge allowed sections from ALL assigned roles
      const allowedSet = new Set();
      roles.forEach(role => {
        const allowed = this.sectionsByRole[role] || this.sectionsByRole.guest;
        allowed.forEach(id => allowedSet.add(id));
      });
      const allowed = Array.from(allowedSet);

      document.querySelectorAll('section.scroll-section').forEach(sec => {
        const id = sec.id;
        if (!id) return;

        if (allowed.includes(id)) {
          sec.removeAttribute('data-rbac-hidden');
          sec.style.removeProperty('display');
          sec.style.opacity = '1';
        } else {
          sec.setAttribute('data-rbac-hidden', '1');
          sec.classList.remove('active-module');
          sec.style.display = 'none';
          sec.style.opacity = '0';
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

      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.style.display = '';
      });

      const existingBanner = document.getElementById('rx-login-prompt-banner');
      if (existingBanner) existingBanner.remove();

      if (document.body.classList.contains('switch-mode')) {
        const activeEl = document.querySelector('.scroll-section.active-module');
        const activeId = activeEl && activeEl.id ? activeEl.id : currentModule;
        if (!allowed.includes(activeId)) {
          window.RX_SPA.scrollToId('home');
        } else {
          document.querySelectorAll('.scroll-section').forEach(sec => {
            if (sec.id) {
              sec.classList.toggle('active-module', sec.id === activeId);
            }
          });
        }
      }
    }
  };

  window.RX_RBAC = RX_RBAC;

  function mount() {
    const app = appEl();
    if (!app) return;
    app.innerHTML = renderCompletePage();

    document.body.classList.add('switch-mode');
    document.querySelectorAll('.scroll-section').forEach(s => {
      s.classList.toggle('active-module', s.id === 'home');
    });

    initializeAllSections();

    let bootUser = null;
    try { bootUser = JSON.parse(localStorage.getItem('rx_user') || 'null'); } catch (e) {}
    if (window.RX_RBAC) window.RX_RBAC.applyAccess(bootUser);

    if (window.RX && window.RX.refreshNavUser) {
      window.RX.refreshNavUser();
    }
    checkBackendSession();
    if (window.RX_SPA.loadAuthConfig) {
      window.RX_SPA.loadAuthConfig();
    }

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const initialHash = (window.location.hash || '').replace('#', '').replace('/', '') || 'home';
    const targetModule = MODULES.includes(initialHash) ? initialHash : 'home';
    currentModule = targetModule;

    document.querySelectorAll('.scroll-section').forEach(s => {
      s.classList.toggle('active-module', s.id === targetModule);
    });

    document.querySelectorAll('[data-scroll]').forEach(l => {
      l.classList.toggle('active', l.getAttribute('data-scroll') === targetModule);
    });

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    window.history.replaceState(null, '', '#' + targetModule);

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    if (!window._rxHashNavBound) {
      window._rxHashNavBound = true;
      window.addEventListener('hashchange', function () {
        const hashId = (window.location.hash || '').replace('#', '').replace('/', '');
        if (hashId && MODULES.includes(hashId) && hashId !== currentModule) {
          window.RX_SPA.scrollToId(hashId);
        }
      });
    }

    // Close modals on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        window.RX_SPA.closeDetailModal();
        window.RX_SPA.closeListModal();
        var loginModal = document.getElementById('spa-login-modal');
        if (loginModal) loginModal.style.display = 'none';
      }
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          overlay.style.display = 'none';
        }
      });
    });
  }

  window.addEventListener('DOMContentLoaded', mount);
  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
  });
  if (document.readyState !== 'loading') mount();

})();
