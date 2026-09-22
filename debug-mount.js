const fs = require('fs');
let code = fs.readFileSync('js/spa-router.js', 'utf8');

// Find the mount call area - where app.innerHTML = renderCompletePage() is
const mountArea = '    app.innerHTML = renderCompletePage();';
const mountIdx = code.indexOf(mountArea);
console.log('mount area found at char:', mountIdx);

// Find what comes right after the mount and the first initializeAllSections call in mount()
// We need to inject RBAC call right after initializeAllSections() in the mount function
// First, let's find the mount function context
const afterMount = code.substring(mountIdx, mountIdx + 600);
console.log('After mount:\n', afterMount);
