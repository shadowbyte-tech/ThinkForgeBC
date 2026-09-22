/**
 * ResourceX: Role-Specific Dashboards
 * Renders different dashboard layouts based on user role
 */

(function () {
  'use strict';

  window.RX_DASHBOARDS = window.RX_DASHBOARDS || {};

  // ============================================================
  // SELLER DASHBOARD (Material Generators)
  // ============================================================

  window.RX_DASHBOARDS.renderSellerDashboard = function (user) {
    return `
      <div class="role-dashboard seller-dashboard">
        <div style="max-width: 1440px; margin: 0 auto; padding: 2rem 6%;">
          
          <!-- Header -->
          <div style="margin-bottom: 3rem;">
            <h1 style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; margin: 0 0 0.5rem; font-weight: 700;">
              Generator Dashboard
            </h1>
            <p style="color: #A8A5A0; margin: 0; font-size: 0.95rem;">
              Manage your material listings, monitor bids, and track sales
            </p>
          </div>

          <!-- Key Metrics -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
            
            <div class="metric-card" style="
              background: linear-gradient(135deg, rgba(45, 112, 80, 0.2) 0%, rgba(45, 112, 80, 0.05) 100%);
              border: 1px solid rgba(45, 112, 80, 0.3);
              border-radius: 12px;
              padding: 1.5rem;
            ">
              <div style="color: #2D7050; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">
                📋 Active Listings
              </div>
              <div style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3rem;">
                12
              </div>
              <div style="color: #A8A5A0; font-size: 0.85rem;">
                Across ${user.facilities?.length || 1} facilities
              </div>
            </div>

            <div class="metric-card" style="
              background: linear-gradient(135deg, rgba(26, 115, 232, 0.2) 0%, rgba(26, 115, 232, 0.05) 100%);
              border: 1px solid rgba(26, 115, 232, 0.3);
              border-radius: 12px;
              padding: 1.5rem;
            ">
              <div style="color: #1A73E8; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">
                💰 Incoming Bids
              </div>
              <div style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3rem;">
                5
              </div>
              <div style="color: #A8A5A0; font-size: 0.85rem;">
                Awaiting your review
              </div>
            </div>

            <div class="metric-card" style="
              background: linear-gradient(135deg, rgba(196, 173, 122, 0.2) 0%, rgba(196, 173, 122, 0.05) 100%);
              border: 1px solid rgba(196, 173, 122, 0.3);
              border-radius: 12px;
              padding: 1.5rem;
            ">
              <div style="color: #C4AD7A; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">
                ₹ Total Revenue
              </div>
              <div style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3rem;">
                ₹4.5L
              </div>
              <div style="color: #A8A5A0; font-size: 0.85rem;">
                This month
              </div>
            </div>

            <div class="metric-card" style="
              background: linear-gradient(135deg, rgba(200, 100, 100, 0.2) 0%, rgba(200, 100, 100, 0.05) 100%);
              border: 1px solid rgba(200, 100, 100, 0.3);
              border-radius: 12px;
              padding: 1.5rem;
            ">
              <div style="color: #C86464; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">
                ⚠️ Rejected Lots
              </div>
              <div style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3rem;">
                2
              </div>
              <div style="color: #A8A5A0; font-size: 0.85rem;">
                Need attention
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div style="
            background: rgba(21, 26, 23, 0.5);
            border: 1px solid rgba(196, 173, 122, 0.2);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 3rem;
          ">
            <h3 style="color: #F2EFE7; font-weight: 700; margin: 0 0 1.5rem; font-size: 1.1rem;">
              Quick Actions
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <button class="rx-btn rx-btn-primary" style="width: 100%;">
                + List New Material
              </button>
              <button class="rx-btn" style="width: 100%; background: transparent; border: 1px solid rgba(196, 173, 122, 0.3);">
                📋 Review Bids
              </button>
              <button class="rx-btn" style="width: 100%; background: transparent; border: 1px solid rgba(196, 173, 122, 0.3);">
                🏪 Material Bank
              </button>
              <button class="rx-btn" style="width: 100%; background: transparent; border: 1px solid rgba(196, 173, 122, 0.3);">
                📊 Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // ============================================================
  // BUYER DASHBOARD (Processors/Purchasers)
  // ============================================================

  window.RX_DASHBOARDS.renderBuyerDashboard = function (user) {
    return `
      <div class="role-dashboard buyer-dashboard">
        <div style="max-width: 1440px; margin: 0 auto; padding: 2rem 6%;">
          
          <!-- Header -->
          <div style="margin-bottom: 3rem;">
            <h1 style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; margin: 0 0 0.5rem; font-weight: 700;">
              Buyer Dashboard
            </h1>
            <p style="color: #A8A5A0; margin: 0; font-size: 0.95rem;">
              Source materials, negotiate deals, and track inventory
            </p>
          </div>

          <!-- Key Metrics -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
            
            <div class="metric-card" style="
              background: linear-gradient(135deg, rgba(26, 115, 232, 0.2) 0%, rgba(26, 115, 232, 0.05) 100%);
              border: 1px solid rgba(26, 115, 232, 0.3);
              border-radius: 12px;
              padding: 1.5rem;
            ">
              <div style="color: #1A73E8; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">
                📦 Sourced Materials
              </div>
              <div style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3rem;">
                28
              </div>
              <div style="color: #A8A5A0; font-size: 0.85rem;">
                Active sourcing streams
              </div>
            </div>

            <div class="metric-card" style="
              background: linear-gradient(135deg, rgba(196, 173, 122, 0.2) 0%, rgba(196, 173, 122, 0.05) 100%);
              border: 1px solid rgba(196, 173, 122, 0.3);
              border-radius: 12px;
              padding: 1.5rem;
            ">
              <div style="color: #C4AD7A; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">
                💬 Active Negotiations
              </div>
              <div style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3rem;">
                3
              </div>
              <div style="color: #A8A5A0; font-size: 0.85rem;">
                In progress
              </div>
            </div>

            <div class="metric-card" style="
              background: linear-gradient(135deg, rgba(45, 112, 80, 0.2) 0%, rgba(45, 112, 80, 0.05) 100%);
              border: 1px solid rgba(45, 112, 80, 0.3);
              border-radius: 12px;
              padding: 1.5rem;
            ">
              <div style="color: #2D7050; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">
                🏭 Inventory Utilization
              </div>
              <div style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3rem;">
                78%
              </div>
              <div style="color: #A8A5A0; font-size: 0.85rem;">
                Current capacity
              </div>
            </div>

            <div class="metric-card" style="
              background: linear-gradient(135deg, rgba(45, 180, 120, 0.2) 0%, rgba(45, 180, 120, 0.05) 100%);
              border: 1px solid rgba(45, 180, 120, 0.3);
              border-radius: 12px;
              padding: 1.5rem;
            ">
              <div style="color: #2DB478; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">
                💰 Net Value Savings
              </div>
              <div style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3rem;">
                ₹1.25L
              </div>
              <div style="color: #A8A5A0; font-size: 0.85rem;">
                vs market rates
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div style="
            background: rgba(21, 26, 23, 0.5);
            border: 1px solid rgba(196, 173, 122, 0.2);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 3rem;
          ">
            <h3 style="color: #F2EFE7; font-weight: 700; margin: 0 0 1.5rem; font-size: 1.1rem;">
              Quick Actions
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <button class="rx-btn rx-btn-primary" style="width: 100%;">
                🔍 Search Materials
              </button>
              <button class="rx-btn" style="width: 100%; background: transparent; border: 1px solid rgba(196, 173, 122, 0.3);">
                📊 Place Bid
              </button>
              <button class="rx-btn" style="width: 100%; background: transparent; border: 1px solid rgba(196, 173, 122, 0.3);">
                💬 Negotiations
              </button>
              <button class="rx-btn" style="width: 100%; background: transparent; border: 1px solid rgba(196, 173, 122, 0.3);">
                📦 My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // ============================================================
  // LOGISTICS DASHBOARD (Transport Partners)
  // ============================================================

  window.RX_DASHBOARDS.renderLogisticsDashboard = function (user) {
    return `
      <div class="role-dashboard logistics-dashboard">
        <div style="max-width: 1440px; margin: 0 auto; padding: 2rem 6%;">
          
          <!-- Header -->
          <div style="margin-bottom: 3rem;">
            <h1 style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; margin: 0 0 0.5rem; font-weight: 700;">
              Logistics Dashboard
            </h1>
            <p style="color: #A8A5A0; margin: 0; font-size: 0.95rem;">
              Track shipments, manage fleet, and optimize routes
            </p>
          </div>

          <!-- Key Metrics -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
            
            <div class="metric-card" style="
              background: linear-gradient(135deg, rgba(196, 173, 122, 0.2) 0%, rgba(196, 173, 122, 0.05) 100%);
              border: 1px solid rgba(196, 173, 122, 0.3);
              border-radius: 12px;
              padding: 1.5rem;
            ">
              <div style="color: #C4AD7A; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">
                🚚 Active Shipments
              </div>
              <div style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3rem;">
                8
              </div>
              <div style="color: #A8A5A0; font-size: 0.85rem;">
                In-transit now
              </div>
            </div>

            <div class="metric-card" style="
              background: linear-gradient(135deg, rgba(45, 112, 80, 0.2) 0%, rgba(45, 112, 80, 0.05) 100%);
              border: 1px solid rgba(45, 112, 80, 0.3);
              border-radius: 12px;
              padding: 1.5rem;
            ">
              <div style="color: #2D7050; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">
                ✅ On-Time Rate
              </div>
              <div style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3rem;">
                96%
              </div>
              <div style="color: #A8A5A0; font-size: 0.85rem;">
                This month
              </div>
            </div>

            <div class="metric-card" style="
              background: linear-gradient(135deg, rgba(26, 115, 232, 0.2) 0%, rgba(26, 115, 232, 0.05) 100%);
              border: 1px solid rgba(26, 115, 232, 0.3);
              border-radius: 12px;
              padding: 1.5rem;
            ">
              <div style="color: #1A73E8; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">
                🏎️ Fleet Utilization
              </div>
              <div style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3rem;">
                85%
              </div>
              <div style="color: #A8A5A0; font-size: 0.85rem;">
                Vehicles deployed
              </div>
            </div>

            <div class="metric-card" style="
              background: linear-gradient(135deg, rgba(196, 173, 122, 0.2) 0%, rgba(196, 173, 122, 0.05) 100%);
              border: 1px solid rgba(196, 173, 122, 0.3);
              border-radius: 12px;
              padding: 1.5rem;
            ">
              <div style="color: #C4AD7A; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">
                ₹ Monthly Revenue
              </div>
              <div style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3rem;">
                ₹3.8L
              </div>
              <div style="color: #A8A5A0; font-size: 0.85rem;">
                Current month
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div style="
            background: rgba(21, 26, 23, 0.5);
            border: 1px solid rgba(196, 173, 122, 0.2);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 3rem;
          ">
            <h3 style="color: #F2EFE7; font-weight: 700; margin: 0 0 1.5rem; font-size: 1.1rem;">
              Quick Actions
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <button class="rx-btn rx-btn-primary" style="width: 100%;">
                📍 Track Shipment
              </button>
              <button class="rx-btn" style="width: 100%; background: transparent; border: 1px solid rgba(196, 173, 122, 0.3);">
                ✅ Accept Delivery
              </button>
              <button class="rx-btn" style="width: 100%; background: transparent; border: 1px solid rgba(196, 173, 122, 0.3);">
                🛣️ Route Optim.
              </button>
              <button class="rx-btn" style="width: 100%; background: transparent; border: 1px solid rgba(196, 173, 122, 0.3);">
                📊 Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // ============================================================
  // UNIVERSAL DASHBOARD RENDERER
  // ============================================================

  window.RX_DASHBOARDS.renderDashboard = function (user) {
    if (!user || !user.primaryRole) return '';

    const dashboardFunctions = {
      seller: window.RX_DASHBOARDS.renderSellerDashboard,
      buyer: window.RX_DASHBOARDS.renderBuyerDashboard,
      logistics: window.RX_DASHBOARDS.renderLogisticsDashboard
    };

    const renderer = dashboardFunctions[user.primaryRole];
    if (renderer) {
      return renderer(user);
    }

    return '<div>Unknown role dashboard</div>';
  };
})();
