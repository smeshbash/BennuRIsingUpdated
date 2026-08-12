const fs = require('fs');
let content = fs.readFileSync('pages/Home.tsx', 'utf8');

const oldBtn = `<div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">`;
const newBtn = `<div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 w-full">`;

content = content.replace(oldBtn, newBtn);
fs.writeFileSync('pages/Home.tsx', content);
