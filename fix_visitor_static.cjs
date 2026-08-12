const fs = require('fs');
const file = 'components/VisitorCountBar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('useState<number>(124830)', 'useState<number>(0)');

fs.writeFileSync(file, content);
console.log('Fixed VisitorCountBar');
