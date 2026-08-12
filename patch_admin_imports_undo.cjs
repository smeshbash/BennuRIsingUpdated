const fs = require('fs');
const file = 'pages/AdminPages.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('Award, Plus, X, Pencil,', 'Award, Pencil,');
fs.writeFileSync(file, content);
console.log('Fixed imports');
