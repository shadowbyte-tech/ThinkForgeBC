const fs = require('fs');
const css = fs.readFileSync('css/animations.css', 'utf8');

const addition = `

/* ============================================================
   RX DROPDOWN THEME FIX (dark-mode select options)
============================================================ */
#rx-auth-role option {
  background-color: #0f1210;
  color: #F2EFE7;
  font-size: 0.9rem;
}
#rx-auth-role:focus {
  border-color: rgba(196,173,122,0.6) !important;
  box-shadow: 0 0 0 3px rgba(196,173,122,0.1);
}

/* ============================================================
   RBAC LOGIN PROMPT BANNER
============================================================ */
#rx-login-prompt-banner {
  animation: fadeInUp 0.4s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.4); }
}

/* Hide RBAC-gated sections smoothly */
[data-rbac-hidden='1'] {
  display: none !important;
}

/* ============================================================
   AUTH MODAL ENHANCEMENTS
============================================================ */
.google-account-modal input[type='email'],
.google-account-modal input[type='password'] {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.google-account-modal input[type='email']:focus,
.google-account-modal input[type='password']:focus {
  border-color: rgba(196,173,122,0.6) !important;
  box-shadow: 0 0 0 3px rgba(196,173,122,0.08);
}
`;

fs.writeFileSync('css/animations.css', css + addition);
console.log('CSS updated successfully.');
