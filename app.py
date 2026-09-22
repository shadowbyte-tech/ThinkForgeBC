#!/usr/bin/env python3
"""
ResourceX — Industrial Resources. Reimagined.
Backend Server (app.py)

Provides:
- Google OAuth2 / Identity Services token verification & authentication
- Session management & current user profile API
- Static asset serving (HTML, CSS, JS, Assets)
- Byproduct materials & matches API
"""

import os
import sys
import json
import base64
import secrets
from datetime import datetime
from dotenv import load_dotenv
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

app = Flask(__name__, static_folder=STATIC_DIR)
app.secret_key = os.environ.get('SECRET_KEY') or secrets.token_hex(32)
app.config['SESSION_COOKIE_NAME'] = 'resourcex_session'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Enable CORS to allow requests from port 3000 (npx serve) or port 5000 (direct Flask)
CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5000", "http://127.0.0.1:5000"])

# Configurable Google Client ID from .env
GOOGLE_CLIENT_ID = (os.environ.get('GOOGLE_CLIENT_ID') or os.environ.get('VITE_GOOGLE_CLIENT_ID') or '').strip()

# In-memory session store & database demo storage
USERS_DB = {}


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
                'role': 'Industrial Partner',
                'facility': f"{name}'s Facility",
                'location': 'Industrial Circular Corridor',
                'login_time': datetime.now().isoformat()
            }
        except ValueError as err:
            print(f"Google ID token verification failed: {err}", file=sys.stderr)
            return jsonify({
                'success': False,
                'error': f'Google token verification error: {str(err)}'
            }), 401
        except Exception as err:
            print(f"Unexpected token error: {err}", file=sys.stderr)
            return jsonify({
                'success': False,
                'error': f'Authentication service error: {str(err)}'
            }), 500

    if not authenticated_user:
        return jsonify({
            'success': False,
            'error': 'Could not verify Google ID token with Google Identity Services.'
        }), 401

    # Store verified user securely in session cookie
    session['user'] = authenticated_user
    session.permanent = True

    return jsonify({
        'success': True,
        'message': f"Signed in successfully as {authenticated_user['name']}",
        'user': authenticated_user
    })


@app.route('/api/auth/session', methods=['GET'])
def api_auth_session():
    """Returns currently authenticated user session."""
    user = session.get('user')
    if user:
        return jsonify({
            'authenticated': True,
            'user': user
        })
    return jsonify({
        'authenticated': False,
        'user': None
    })


@app.route('/api/auth/logout', methods=['POST'])
def api_auth_logout():
    """Logs out user and destroys session."""
    user = session.pop('user', None)
    session.clear()
    session.modified = True
    name = user.get('name') if user else 'User'
    return jsonify({
        'success': True,
        'message': f"{name} signed out successfully."
    })


# ============================================================
# MATERIALS & STREAM API (SUPPORTS PERSISTENT BYPRODUCTS)
# ============================================================

DATA_FILE = os.path.join(STATIC_DIR, 'js', 'data', 'materials.js')

@app.route('/api/materials', methods=['GET'])
def api_get_materials():
    """Return available verified feedstock materials."""
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


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"============================================================")
    print(f" ResourceX Backend Server Active")
    print(f" URL: http://localhost:{port}")
    print(f" Google Auth Endpoint: http://localhost:{port}/api/auth/google")
    print(f" Session Endpoint: http://localhost:{port}/api/auth/session")
    print(f"============================================================")
    app.run(host='0.0.0.0', port=port, debug=False)
