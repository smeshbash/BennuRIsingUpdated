const fs = require('fs');
let content = fs.readFileSync('pages/ContentPages.tsx', 'utf8');

content = content.replace(/-mt-16/g, 'mt-8');
content = content.replace(/-mt-24/g, 'mt-8');

fs.writeFileSync('pages/ContentPages.tsx', content);
