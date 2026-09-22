/**
 * ResourceX: Enhanced RBAC System (Frontend)
 * Handles role-based access control, permissions, and UI gating
 */

(function () {
  'use strict';

  window.RX_RBAC = window.RX_RBAC || {};

  // ============================================================
  // ROLE CONFIGURATION
  // ============================================================

  const ROLE_CONFIG = {
    seller: {
      displayName: '🏭 Material Generator / Seller',
      description: 'Source and sell industrial byproducts',
      icon: '🏭',
      color: '#2D7050',
      pages: ['home', 'marketplace', 'net-value', 'material-bank', 'material-journey', 'dashboard', 'negotiations'],
      features: {
        canListMaterial: true,
        canViewBids: true,
        canManageMaterialBank: true,
        canViewDashboard: true,
        canNegotiate: true
      }
    },
    buyer: {
      displayName: '🔄 Processor / Buyer',
      description: 'Procure secondary materials for your facility',
      icon: '🔄',
      color: '#1A73E8',
      pages: ['home', 'marketplace', 'net-value', 'material-journey', 'dashboard', 'negotiations'],
      features: {
        canPlaceBid: true,
        canNegotiate: true,
        canViewSellerProfiles: true,
        canViewDashboard: true,
        canExportAnalytics: true
      }
    },
    logistics: {
      displayName: '🚚 Logistics Partner',
      description: 'Transport and logistics services',
      icon: '🚚',
      color: '#C4AD7A',
      pages: ['home', 'marketplace', 'material-journey', 'dashboard'],
      features: {
        canTrackShipment: true,
        canUpdateDeliveryStatus: true,
        canViewRouteOptimization: true,
        canViewDashboard: true
      }
    }
  };

  // ============================================================
  // PERMISSION CHECKING
  // ============================================================

  window.RX_RBAC.canPerformAction = function (user, action) {
    if (!user || !user.primaryRole) return false;
    const role = user.primaryRole;
    return ROLE_CONFIG[role]?.features?.[action] ?? false;
  };

  window.RX_RBAC.getPageAccess = function (user) {
    if (!user || !user.primaryRole) return ['home'];
    return ROLE_CONFIG[user.primaryRole]?.pages ?? ['home'];
  };

  window.RX_RBAC.getRoleConfig = function (role) {
    return ROLE_CONFIG[role] || ROLE_CONFIG.seller;
  };

  // ============================================================
  // ROLE SELECTION MODAL
  // ============================================================

  window.RX_RBAC.showRoleSelectionModal = function (tempUser) {
    const modal = document.createElement('div');
    modal.id = 'rbac-role-selection-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(4px);
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: linear-gradient(135deg, #0f1210 0%, #141c18 100%);
      border: 1px solid rgba(196, 173, 122, 0.3);
      border-radius: 16px;
      padding: 2.5rem;
      max-width: 700px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.4s ease-out;
    `;

    let rolesHTML = '';
    for (const [roleKey, config] of Object.entries(ROLE_CONFIG)) {
      rolesHTML += `
        <div class="rbac-role-card" onclick="window.RX_RBAC.selectRole('${roleKey}')" style="
          cursor: pointer;
          background: rgba(21, 26, 23, 0.6);
          border: 2px solid rgba(196, 173, 122, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        " onmouseover="this.style.borderColor='rgba(196, 173, 122, 0.6)'; this.style.background='rgba(21, 26, 23, 0.9)';"
           onmouseout="this.style.borderColor='rgba(196, 173, 122, 0.2)'; this.style.background='rgba(21, 26, 23, 0.6)';">
          <div style="font-size: 2rem;">${config.icon}</div>
          <div style="flex: 1;">
            <div style="color: #F2EFE7; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.3rem;">
              ${config.displayName}
            </div>
            <div style="color: #A8A5A0; font-size: 0.9rem;">
              ${config.description}
            </div>
          </div>
          <div style="color: #C4AD7A; font-size: 1.4rem;">→</div>
        </div>
      `;
    }

    content.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h2 style="color: #F2EFE7; font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem; margin: 0 0 0.5rem; font-weight: 700;">
          Complete Your Profile
        </h2>
        <p style="color: #A8A5A0; margin: 0; font-size: 0.95rem;">
          Welcome, ${tempUser.name}! What best describes your business role?
        </p>
      </div>

      <div style="margin-bottom: 2rem;">
        ${rolesHTML}
      </div>

      <div style="
        background: rgba(196, 173, 122, 0.08);
        border: 1px solid rgba(196, 173, 122, 0.2);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1.5rem;
      ">
        <label style="
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          color: #A8A5A0;
          font-size: 0.9rem;
        ">
          <input type="checkbox" id="rbac-multi-role-interest" style="cursor: pointer;">
          <span>I'm interested in multiple roles (can be enabled later in settings)</span>
        </label>
      </div>

      <div style="
        background: rgba(45, 112, 80, 0.1);
        border-left: 3px solid #2D7050;
        border-radius: 4px;
        padding: 1rem;
        margin-bottom: 2rem;
      ">
        <div style="color: #3A8D65; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.3rem;">
          💡 You can change your role anytime
        </div>
        <div style="color: #A8A5A0; font-size: 0.85rem;">
          Your role determines which features and pages you can access. You're not locked in!
        </div>
      </div>

      <div style="display: flex; gap: 1rem;">
        <button onclick="window.RX_RBAC.cancelRoleSelection()" style="
          flex: 1;
          background: transparent;
          border: 1px solid rgba(196, 173, 122, 0.3);
          color: #F2EFE7;
          padding: 0.9rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        " onmouseover="this.style.borderColor='rgba(196, 173, 122, 0.6)'; this.style.background='rgba(196, 173, 122, 0.05)';"
           onmouseout="this.style.borderColor='rgba(196, 173, 122, 0.3)'; this.style.background='transparent';">
          Exit
        </button>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  };

  window.RX_RBAC.selectRole = function (role) {
    const modal = document.getElementById('rbac-role-selection-modal');
    if (modal) modal.remove();

    const tempUser = JSON.parse(localStorage.getItem('rx_temp_user') || '{}');
    const multiRoleInterest = document.getElementById('rbac-multi-role-interest')?.checked || false;

    const profileData = {
      role: role,
      organizationName: tempUser.company || tempUser.name,
      organizationId: null,
      facilities: [tempUser.name],
      location: tempUser.location || 'Unknown',
      multiRoleInterest: multiRoleInterest
    };

    // Show loading
    const loadingMsg = document.createElement('div');
    loadingMsg.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(20, 24, 22, 0.95);
      color: #F2EFE7;
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid rgba(196, 173, 122, 0.3);
      z-index: 10001;
      font-weight: 600;
      backdrop-filter: blur(4px);
    `;
    loadingMsg.textContent = 'Setting up your profile...';
    document.body.appendChild(loadingMsg);

    // Send to backend
    fetch('/api/auth/setup-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          localStorage.setItem('rx_user', JSON.stringify(data.user));
          localStorage.removeItem('rx_temp_user');
          loadingMsg.remove();

          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = '/#dashboard';
          }, 500);
        } else {
          loadingMsg.textContent = 'Error: ' + (data.error || 'Setup failed');
          setTimeout(() => window.location.reload(), 2000);
        }
      })
      .catch(err => {
        console.error('Profile setup error:', err);
        loadingMsg.textContent = 'Error setting up profile';
        setTimeout(() => window.location.reload(), 2000);
      });
  };

  window.RX_RBAC.cancelRoleSelection = function () {
    const modal = document.getElementById('rbac-role-selection-modal');
    if (modal) modal.remove();
    window.RX && window.RX.logout && window.RX.logout();
  };

  // ============================================================
  // PERMISSION GATE HELPER
  // ============================================================

  window.RX_RBAC.gateElement = function (element, user, permission) {
    if (!element) return;

    if (window.RX_RBAC.canPerformAction(user, permission)) {
      element.style.display = '';
      element.removeAttribute('data-permission-hidden');
    } else {
      element.style.display = 'none';
      element.setAttribute('data-permission-hidden', permission);
    }
  };

  window.RX_RBAC.gateElements = function (selector, user, permission) {
    document.querySelectorAll(selector).forEach(el => {
      window.RX_RBAC.gateElement(el, user, permission);
    });
  };

  // ============================================================
  // FACILITY SWITCHER
  // ============================================================

  window.RX_RBAC.switchFacility = function (facilityId) {
    fetch('/api/auth/switch-facility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ facilityId: facilityId }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          localStorage.setItem('rx_user', JSON.stringify(data.user));
          location.reload();
        }
      })
      .catch(err => console.error('Facility switch error:', err));
  };

  // ============================================================
  // LOAD PERMISSIONS FROM BACKEND
  // ============================================================

  window.RX_RBAC.loadPermissions = async function () {
    try {
      const res = await fetch('/api/auth/permissions', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('rx_permissions', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.error('Error loading permissions:', err);
    }
    return null;
  };

  // Auto-load permissions on page load
  document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem('rx_user') || 'null');
    if (user && user.authenticated) {
      window.RX_RBAC.loadPermissions();
    }
  });
})();
