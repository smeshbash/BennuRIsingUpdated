const fs = require('fs');

const adminFile = 'pages/AdminPages.tsx';
let content = fs.readFileSync(adminFile, 'utf8');

content = content.replace('} else setList(TESTIMONIALS);', '} else setList([]);');

fs.writeFileSync(adminFile, content);
console.log('Fixed AdminPages.tsx testimonials');
