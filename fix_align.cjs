const fs = require('fs');
let content = fs.readFileSync('pages/Home.tsx', 'utf8');

const regexMap = /<span key=\{i\} className="block">/g;
content = content.replace(regexMap, '<span key={i} className="block w-full text-center lg:text-left">');

const regexHeroText = /<div className="flex flex-col items-center lg:items-start leading-tight">/g;
content = content.replace(regexHeroText, '<div className="flex flex-col items-center lg:items-start leading-tight w-full">');

fs.writeFileSync('pages/Home.tsx', content);
