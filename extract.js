const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Manikanta/Desktop/ThinkForge/robot-hero-prompt.txt', 'utf8').split('\n');
let content = '';
for (let l of lines) {
  if (l.startsWith('{"step_index":255,')) {
    let j = JSON.parse(l);
    content = j.content;
    break;
  }
}
let match = content.match(/```tsx\r?\nrobot-hero\.tsx\r?\n([\s\S]*?)\r?\ndemo\.tsx\r?\n([\s\S]*?)```/);
if (match) {
  fs.writeFileSync('src/components/ui/robot-hero.tsx', match[1].trim());
  fs.writeFileSync('src/components/demo.tsx', match[2].trim());
  console.log('Successfully wrote files.');
} else {
  console.log('Regex failed to match.');
}
