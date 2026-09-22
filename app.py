#!/usr/bin/env python3
"""
ResourceX — Industrial Resources. Reimagined.
Backend Server (app.py)

Provides:
- Google OAuth2 / Identity Services token verification & authentication
- Enhanced Role-Based Access Control (RBAC) system
- Multi-role & organization support
- Session management & current user profile API
- Audit logging for compliance
- Static asset serving (HTML, CSS, JS, Assets)
- Byproduct materials & matches API
"""

import os
import sys
import json
import base64
import secrets
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv
from functools import wraps
from flask import Flask, request, jsonify, session, send_from_directory, send_file
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Load environment variables from .env
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Google Auth Library (if available)
try:
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    GOOGLE_AUTH_AVAILABLE = True
except ImportError:
    GOOGLE_AUTH_AVAILABLE = False

STATIC_DIR = BASE_DIR

# Setup logging
log_dir = os.path.join(BASE_DIR, 'logs')
os.makedirs(log_dir, exist_ok=True)
logging.basicConfig(
    filename=os.path.join(log_dir, 'audit.log'),
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
audit_logger = logging.getLogger('audit')

app = Flask(__name__, static_folder=STATIC_DIR)
app.secret_key = os.environ.get('SECRET_KEY') or secrets.token_hex(32)
app.config['SESSION_COOKIE_NAME'] = 'resourcex_session'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)
app.config['SESSION_REFRESH_EACH_REQUEST'] = True

# Enable CORS to allow requests from port 3000 (npx serve) or port 5000 (direct Flask)
CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5000", "http://127.0.0.1:5000"])

# Configurable Google Client ID from .env
GOOGLE_CLIENT_ID = (os.environ.get('GOOGLE_CLIENT_ID') or os.environ.get('VITE_GOOGLE_CLIENT_ID') or '').strip()

# In-memory session store & database demo storage
USERS_DB = {}

# ============================================================
# ROLE-BASED ACCESS CONTROL (RBAC) CONFIGURATION
# ============================================================

ROLE_PERMISSIONS = {
    'seller': {
        'canListMaterial': True,
        'canEditListing': True,
        'canDeleteListing': True,
        'canViewBids': True,
        'canAcceptBid': True,
        'canCancelSale': True,
        'canViewNegotiations': True,
        'canManageMaterialBank': True,
        'canViewDashboard': True,
        'canExportAnalytics': False,
        'canViewBuyerProfiles': False,
        'canApiAccess': True
    },
    'buyer': {
        'canListMaterial': False,
        'canEditListing': False,
        'canDeleteListing': False,
        'canViewBids': False,
        'canAcceptBid': False,
        'canPlaceBid': True,
        'canNegotiate': True,
        'canViewSellerProfiles': True,
        'canViewDashboard': True,
        'canExportAnalytics': True,
        'canApiAccess': True,
        'canTrackShipment': True
    },
    'logistics': {
        'canListMaterial': False,
        'canPlaceBid': False,
        'canTrackShipment': True,
        'canUpdateDeliveryStatus': True,
        'canViewRouteOptimization': True,
        'canViewDashboard': True,
        'canExportAnalytics': False,
        'canApiAccess': True
    }
}

# Default pages visible per role
ROLE_PAGES = {
    'seller': ['home', 'marketplace', 'net-value', 'material-bank', 'material-journey', 'dashboard', 'negotiations'],
    'buyer': ['home', 'marketplace', 'net-value', 'material-journey', 'dashboard', 'negotiations'],
    'logistics': ['home', 'marketplace', 'material-journey', 'dashboard'],
    'guest': ['home']
}

def log_action(user_id, user_email, user_role, action, details=None, status='success'):
    """Log user actions for audit trail"""
    try:
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'userId': user_id,
            'userEmail': user_email,
            'userRole': user_role,
            'action': action,
            'details': details or {},
            'status': status,
            'ip': request.remote_addr
        }
        audit_logger.info(json.dumps(log_entry))
    except Exception as e:
        print(f"Error logging action: {e}", file=sys.stderr)

def get_user_role(user):
    """Extract role from user object"""
    if not user or not user.get('name'):
        return 'guest'
    
    role = user.get('primaryRole') or user.get('role_key', '')
    if role in ['seller', 'buyer', 'logistics']:
        return role
    
    # Fallback: try to detect from role string
    role_text = (user.get('role') or '').lower()
    if 'buyer' in role_text or 'processor' in role_text:
        return 'buyer'
    if 'logistic' in role_text or 'transport' in role_text:
        return 'logistics'
    if 'seller' in role_text or 'generator' in role_text:
        return 'seller'
    
    return 'guest'

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = session.get('user')
        if not user:
            return jsonify({'error': 'Unauthorized', 'code': 'NO_AUTH'}), 401
        return f(*args, **kwargs)
    return decorated_function

def require_role(*allowed_roles):
    """Decorator to require specific roles"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = session.get('user')
            if not user:
                return jsonify({'error': 'Unauthorized', 'code': 'NO_AUTH'}), 401
            
            user_role = get_user_role(user)
            if user_role not in allowed_roles:
                log_action(user.get('id'), user.get('email'), user_role, f.__name__, 
                          {'error': 'Insufficient permissions'}, 'failed')
                return jsonify({
                    'error': 'Insufficient permissions',
                    'code': 'FORBIDDEN',
                    'required_roles': allowed_roles,
                    'user_role': user_role
                }), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def require_permission(permission):
    """Decorator to require specific permission"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = session.get('user')
            if not user:
                return jsonify({'error': 'Unauthorized', 'code': 'NO_AUTH'}), 401
            
            user_role = get_user_role(user)
            permissions = ROLE_PERMISSIONS.get(user_role, {})
            
            if not permissions.get(permission, False):
                log_action(user.get('id'), user.get('email'), user_role, f.__name__,
                          {'error': f'Missing permission: {permission}'}, 'failed')
                return jsonify({
                    'error': 'Insufficient permissions',
                    'code': 'FORBIDDEN',
                    'required_permission': permission
                }), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator


# ============================================================
# STATIC FRONTEND ROUTES
# ============================================================

@app.route('/')
def serve_index():
    return send_file(os.path.join(STATIC_DIR, 'index.html'))

@app.route('/<path:path>')
def serve_static(path):
    full_path = os.path.join(STATIC_DIR, path)
    if os.path.exists(full_path) and not os.path.isdir(full_path):
        return send_from_directory(STATIC_DIR, path)
    # Serve 404 page if it exists, otherwise fallback to SPA index
    not_found_path = os.path.join(STATIC_DIR, '404.html')
    if os.path.exists(not_found_path):
        return send_file(not_found_path), 404
    return send_file(os.path.join(STATIC_DIR, 'index.html'))


# ============================================================
# DEMO LOGIN PAGE (FOR TESTING RBAC WITHOUT GOOGLE AUTH)
# ============================================================

@app.route('/demo-login')
def serve_demo_login():
    """Serve the RBAC demo login page for testing."""
    return send_file(os.path.join(STATIC_DIR, 'demo-login.html'))


# ============================================================
# AUTHENTICATION API (GOOGLE LOG IN)
# ============================================================

@app.route('/api/status', methods=['GET'])
def api_status():
    """Health check and backend status."""
    cid = GOOGLE_CLIENT_ID
    is_valid_cid = bool(cid and not cid.startswith('YOUR_GOOGLE_CLIENT_ID'))
    return jsonify({
        'status': 'online',
        'service': 'ResourceX Backend Engine',
        'timestamp': datetime.now().isoformat(),
        'python_version': sys.version.split()[0],
        'google_auth_ready': GOOGLE_AUTH_AVAILABLE,
        'google_client_id_configured': is_valid_cid,
        'active_session': bool(session.get('user'))
    })


@app.route('/api/auth/config', methods=['GET'])
def api_auth_config():
    """Provides public auth configuration to frontend."""
    cid = GOOGLE_CLIENT_ID
    valid_cid = cid if cid and not cid.startswith('YOUR_GOOGLE_CLIENT_ID') else ''
    return jsonify({
        'googleClientId': valid_cid,
        'googleAuthReady': GOOGLE_AUTH_AVAILABLE,
        'status': 'online'
    })


@app.route('/api/auth/google', methods=['POST'])
def api_auth_google():
    """
    Handles Google Identity Services ID Token authentication.
    Accepts:
      {"credential": "<GOOGLE_ID_TOKEN_JWT>"}
    Cryptographically verifies the token using Google's public keys.
    Returns needsProfileSetup: true if role/org not yet selected.
    """
    data = request.get_json(force=True, silent=True) or {}
    token = data.get('credential') or data.get('token')

    if not token:
        return jsonify({
            'success': False,
            'error': 'Missing Google ID token credential.'
        }), 400

    cid = GOOGLE_CLIENT_ID
    target_audience = cid if (cid and not cid.startswith('YOUR_GOOGLE_CLIENT_ID')) else None

    authenticated_user = None

    if GOOGLE_AUTH_AVAILABLE:
        try:
            # Cryptographically verify the Google ID token with Google's public keys
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                audience=target_audience
            )

            # Extract Google user profile claims
            sub = idinfo.get('sub')  # Stable Google Subject / User ID
            email = idinfo.get('email', '').lower()
            email_verified = idinfo.get('email_verified', False)
            name = idinfo.get('name') or email.split('@')[0].title()
            picture = idinfo.get('picture')  # Google Profile Picture URL
            given_name = idinfo.get('given_name')

            # Initial user object (needs role/org setup)
            authenticated_user = {
                'id': f"g_{sub}",
                'google_sub': sub,
                'name': name,
                'email': email,
                'email_verified': email_verified,
                'picture': picture,
                'avatar': (given_name[0] if given_name else name[0]).upper(),
                'provider': 'Google Identity Services',
                'authenticated': True,
                'verified': True,
                'login_time': datetime.now().isoformat(),
                'primaryRole': None,  # Not yet set
                'organizationName': None,  # Not yet set
                'organizationId': None,
                'facilities': [],
                'activeFacility': None,
                'lastActivity': datetime.now().isoformat()
            }
            
            # Store temporary user in session (needs completion)
            session['temp_user'] = authenticated_user
            session.permanent = True
            
            log_action(authenticated_user.get('id'), email, 'guest', 'GOOGLE_AUTH_INITIAL', 
                      {'status': 'needs_profile_setup'}, 'success')
            
        except ValueError as err:
            print(f"Google ID token verification failed: {err}", file=sys.stderr)
            log_action('unknown', 'unknown', 'guest', 'GOOGLE_AUTH_FAILED', 
                      {'error': str(err)}, 'failed')
            return jsonify({
                'success': False,
                'error': f'Google token verification error: {str(err)}'
            }), 401
        except Exception as err:
            print(f"Unexpected token error: {err}", file=sys.stderr)
            log_action('unknown', 'unknown', 'guest', 'GOOGLE_AUTH_ERROR', 
                      {'error': str(err)}, 'failed')
            return jsonify({
                'success': False,
                'error': f'Authentication service error: {str(err)}'
            }), 500

    if not authenticated_user:
        return jsonify({
            'success': False,
            'error': 'Could not verify Google ID token with Google Identity Services.'
        }), 401

    # Return user but indicate profile setup is needed
    return jsonify({
        'success': True,
        'needsProfileSetup': True,
        'message': f"Initial authentication successful. Please complete your profile.",
        'user': authenticated_user
    })


@app.route('/api/auth/setup-profile', methods=['POST'])
def api_auth_setup_profile():
    """
    Complete user profile after Google auth.
    Requires: role, organization, facilities
    """
    temp_user = session.get('temp_user')
    if not temp_user:
        return jsonify({
            'success': False,
            'error': 'No pending authentication. Please sign in with Google first.'
        }), 401
    
    data = request.get_json(force=True, silent=True) or {}
    primary_role = data.get('role', 'seller')
    org_name = data.get('organizationName', '')
    org_id = data.get('organizationId')
    facilities = data.get('facilities', [])
    location = data.get('location', '')
    
    # Validate role
    if primary_role not in ['seller', 'buyer', 'logistics']:
        return jsonify({
            'success': False,
            'error': f'Invalid role: {primary_role}. Must be seller, buyer, or logistics.'
        }), 400
    
    # Enhance user with role and org info
    temp_user['primaryRole'] = primary_role
    temp_user['organizationName'] = org_name
    temp_user['organizationId'] = org_id or f"ORG_{temp_user['id'][:8]}"
    temp_user['facilities'] = facilities or [f"FAC_{temp_user['id'][:8]}"]
    temp_user['activeFacility'] = facilities[0] if facilities else f"FAC_{temp_user['id'][:8]}"
    temp_user['location'] = location or 'Unknown'
    temp_user['permissions'] = ROLE_PERMISSIONS.get(primary_role, {})
    temp_user['pageAccess'] = ROLE_PAGES.get(primary_role, ['home'])
    temp_user['role'] = f"{primary_role.title()} - {org_name}"
    
    # Move from temp to permanent session
    session['user'] = temp_user
    session.pop('temp_user', None)
    session.permanent = True
    
    log_action(temp_user.get('id'), temp_user.get('email'), primary_role, 'PROFILE_SETUP',
              {'organization': org_name, 'role': primary_role}, 'success')
    
    return jsonify({
        'success': True,
        'message': f"Welcome {temp_user['name']}! Profile setup complete.",
        'user': temp_user
    })


@app.route('/api/auth/session', methods=['GET'])
def api_auth_session():
    """Returns currently authenticated user session with all role/org info."""
    user = session.get('user')
    if user:
        # Update last activity
        user['lastActivity'] = datetime.now().isoformat()
        session['user'] = user
        
        return jsonify({
            'authenticated': True,
            'user': user,
            'permissions': ROLE_PERMISSIONS.get(get_user_role(user), {}),
            'pageAccess': ROLE_PAGES.get(get_user_role(user), ['home'])
        })
    
    # Check for temp user (incomplete profile)
    temp_user = session.get('temp_user')
    if temp_user:
        return jsonify({
            'authenticated': False,
            'needsProfileSetup': True,
            'tempUser': temp_user
        })
    
    return jsonify({
        'authenticated': False,
        'needsProfileSetup': False
    })


@app.route('/api/auth/demo-login', methods=['POST'])
def api_auth_demo_login():
    """
    Demo login endpoint for testing RBAC without Google auth.
    Call this to test the role selection modal and dashboards.
    """
    data = request.get_json(force=True, silent=True) or {}
    role = data.get('role', 'seller').lower()
    
    if role not in ['seller', 'buyer', 'logistics']:
        return jsonify({'success': False, 'error': 'Invalid role'}), 400
    
    # Create demo user
    demo_user = {
        'id': f'demo_{role}_{secrets.token_hex(4)}',
        'google_sub': f'demo_{role}',
        'name': f'Demo {role.title()}',
        'email': f'demo-{role}@resourcex.local',
        'email_verified': True,
        'picture': None,
        'avatar': role[0].upper(),
        'provider': 'Demo Mode',
        'authenticated': True,
        'verified': True,
        'login_time': datetime.now().isoformat(),
        'primaryRole': role,
        'organizationName': 'Demo Company',
        'organizationId': 'demo_org_001',
        'facilities': [
            {'id': 'fac_01', 'name': 'Demo Facility A'},
            {'id': 'fac_02', 'name': 'Demo Facility B'}
        ],
        'activeFacility': {'id': 'fac_01', 'name': 'Demo Facility A'},
        'lastActivity': datetime.now().isoformat()
    }
    
    # Set permanent session
    session['user'] = demo_user
    session.permanent = True
    
    log_action(demo_user['id'], demo_user['email'], role, 'DEMO_LOGIN', 
              {'role': role}, 'success')
    
    return jsonify({
        'success': True,
        'user': demo_user,
        'message': f'Demo login as {role.title()} successful!'
    })


@app.route('/api/auth/logout', methods=['POST'])
def api_auth_logout():
    """Logs out user and destroys session."""
    user = session.pop('user', None)
    if user:
        log_action(user.get('id'), user.get('email'), get_user_role(user), 'LOGOUT', {}, 'success')
    session.clear()
    session.modified = True
    name = user.get('name') if user else 'User'
    return jsonify({
        'success': True,
        'message': f"{name} signed out successfully."
    })


@app.route('/api/auth/switch-facility', methods=['POST'])
@require_auth
def api_auth_switch_facility():
    """Switch active facility for the current user"""
    user = session.get('user')
    data = request.get_json(force=True, silent=True) or {}
    facility_id = data.get('facilityId')
    
    if not facility_id:
        return jsonify({'success': False, 'error': 'Missing facilityId'}), 400
    
    if facility_id not in user.get('facilities', []):
        log_action(user.get('id'), user.get('email'), get_user_role(user), 'FACILITY_SWITCH_DENIED',
                  {'facilityId': facility_id}, 'failed')
        return jsonify({'success': False, 'error': 'Access denied to this facility'}), 403
    
    user['activeFacility'] = facility_id
    session['user'] = user
    
    log_action(user.get('id'), user.get('email'), get_user_role(user), 'FACILITY_SWITCHED',
              {'facilityId': facility_id}, 'success')
    
    return jsonify({
        'success': True,
        'message': f'Switched to facility: {facility_id}',
        'user': user
    })


@app.route('/api/auth/permissions', methods=['GET'])
@require_auth
def api_get_permissions():
    """Get permissions for current user"""
    user = session.get('user')
    role = get_user_role(user)
    permissions = ROLE_PERMISSIONS.get(role, {})
    
    return jsonify({
        'success': True,
        'role': role,
        'permissions': permissions,
        'pageAccess': ROLE_PAGES.get(role, ['home'])
    })


@app.route('/api/auth/profile', methods=['PUT'])
@require_auth
def api_update_profile():
    """Update user profile information"""
    user = session.get('user')
    data = request.get_json(force=True, silent=True) or {}
    
    # Allow users to update certain fields
    updateable_fields = ['organizationName', 'location']
    for field in updateable_fields:
        if field in data:
            user[field] = data[field]
    
    session['user'] = user
    
    log_action(user.get('id'), user.get('email'), get_user_role(user), 'PROFILE_UPDATED',
              {'fields': list(data.keys())}, 'success')
    
    return jsonify({
        'success': True,
        'message': 'Profile updated successfully',
        'user': user
    })


@app.route('/api/auth/refresh-session', methods=['POST'])
@require_auth
def api_refresh_session():
    """Refresh session timeout"""
    user = session.get('user')
    user['lastActivity'] = datetime.now().isoformat()
    session['user'] = user
    session.permanent = True
    
    return jsonify({
        'success': True,
        'expiresIn': app.config['PERMANENT_SESSION_LIFETIME'].total_seconds(),
        'user': user
    })


# ============================================================
# MATERIALS & STREAM API (SUPPORTS PERSISTENT BYPRODUCTS)
# ============================================================

DATA_FILE = os.path.join(STATIC_DIR, 'js', 'data', 'materials.js')

@app.route('/api/materials', methods=['GET'])
def api_get_materials():
    """Return available verified feedstock materials (public)."""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                content = f.read()
                # Parse materials array from JS window.RX_DATA assignment
                start = content.find('[')
                end = content.rfind(']')
                if start != -1 and end != -1:
                    raw_json = content[start:end+1]
                    materials = json.loads(raw_json)
                    return jsonify({'success': True, 'count': len(materials), 'materials': materials})
    except Exception as e:
        print(f"Error reading materials: {e}", file=sys.stderr)
    return jsonify({'success': True, 'count': 0, 'materials': []})


@app.route('/api/materials/list', methods=['POST'])
@require_permission('canListMaterial')
def api_list_material():
    """Sellers can list new materials (requires seller role)"""
    user = session.get('user')
    data = request.get_json(force=True, silent=True) or {}
    
    material = {
        'id': f"MAT_{secrets.token_hex(4).upper()}",
        'name': data.get('name', 'Unknown Material'),
        'quantity': data.get('quantity', 0),
        'unit': data.get('unit', 'kg'),
        'purity': data.get('purity', 0),
        'sellerId': user.get('id'),
        'sellerName': user.get('name'),
        'organizationId': user.get('organizationId'),
        'facilityId': user.get('activeFacility'),
        'createdAt': datetime.now().isoformat(),
        'status': 'active'
    }
    
    log_action(user.get('id'), user.get('email'), get_user_role(user), 'MATERIAL_LISTED',
              {'materialId': material['id'], 'name': material['name']}, 'success')
    
    return jsonify({
        'success': True,
        'message': f"Material {material['name']} listed successfully",
        'material': material
    })


@app.route('/api/materials/<material_id>', methods=['DELETE'])
@require_permission('canDeleteListing')
def api_delete_material(material_id):
    """Delete a material listing (sellers only)"""
    user = session.get('user')
    
    log_action(user.get('id'), user.get('email'), get_user_role(user), 'MATERIAL_DELETED',
              {'materialId': material_id}, 'success')
    
    return jsonify({
        'success': True,
        'message': f"Material {material_id} deleted successfully"
    })


@app.route('/api/bids', methods=['POST'])
@require_permission('canPlaceBid')
def api_place_bid():
    """Buyers can place bids on materials (requires buyer role)"""
    user = session.get('user')
    data = request.get_json(force=True, silent=True) or {}
    
    bid = {
        'id': f"BID_{secrets.token_hex(4).upper()}",
        'materialId': data.get('materialId'),
        'buyerId': user.get('id'),
        'buyerName': user.get('name'),
        'bidPrice': data.get('price', 0),
        'quantity': data.get('quantity', 0),
        'organizationId': user.get('organizationId'),
        'createdAt': datetime.now().isoformat(),
        'status': 'pending'
    }
    
    log_action(user.get('id'), user.get('email'), get_user_role(user), 'BID_PLACED',
              {'bidId': bid['id'], 'materialId': bid['materialId']}, 'success')
    
    return jsonify({
        'success': True,
        'message': f"Bid placed successfully",
        'bid': bid
    })


@app.route('/api/dashboard/<role>', methods=['GET'])
@require_auth
def api_get_dashboard_data(role):
    """Get role-specific dashboard data"""
    user = session.get('user')
    user_role = get_user_role(user)
    
    # Verify user can only access their own role's dashboard
    if role != user_role:
        log_action(user.get('id'), user.get('email'), user_role, 'DASHBOARD_UNAUTHORIZED',
                  {'requestedRole': role}, 'failed')
        return jsonify({
            'error': 'Unauthorized',
            'message': 'You can only access your own role dashboard'
        }), 403
    
    # Dashboard data varies by role
    dashboard_data = {
        'role': user_role,
        'user': {
            'id': user.get('id'),
            'name': user.get('name'),
            'email': user.get('email'),
            'organization': user.get('organizationName'),
            'facility': user.get('activeFacility')
        }
    }
    
    if role == 'seller':
        dashboard_data['metrics'] = {
            'activeListing': 12,
            'incomingBids': 5,
            'totalRevenue': 450000,
            'rejectedLots': 2
        }
    elif role == 'buyer':
        dashboard_data['metrics'] = {
            'sourcedMaterials': 28,
            'activeNegotiations': 3,
            'inventoryUtilization': 78,
            'netValueSavings': 125000
        }
    elif role == 'logistics':
        dashboard_data['metrics'] = {
            'activeShipments': 8,
            'onTimePercentage': 96,
            'fleetUtilization': 85,
            'monthlyRevenue': 380000
        }
    
    log_action(user.get('id'), user.get('email'), user_role, 'DASHBOARD_VIEWED', {}, 'success')
    
    return jsonify({
        'success': True,
        'data': dashboard_data
    })
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"============================================================")
    print(f" ResourceX Backend Server Active")
    print(f" URL: http://localhost:{port}")
    print(f" Google Auth Endpoint: http://localhost:{port}/api/auth/google")
    print(f" Session Endpoint: http://localhost:{port}/api/auth/session")
    print(f"============================================================")
    app.run(host='0.0.0.0', port=port, debug=False)
