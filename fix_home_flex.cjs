const fs = require('fs');
let content = fs.readFileSync('pages/Home.tsx', 'utf8');

const regexHeroText = /<div className="space-y-8 animate-fade-in-up text-center lg:text-left">/g;
content = content.replace(regexHeroText, `<div className="space-y-8 animate-fade-in-up flex flex-col items-center lg:items-start text-center lg:text-left">`);

fs.writeFileSync('pages/Home.tsx', content);
