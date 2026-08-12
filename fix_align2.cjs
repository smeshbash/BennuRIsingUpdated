const fs = require('fs');
let content = fs.readFileSync('pages/Home.tsx', 'utf8');

const oldP = `<p className="relative text-lg lg:text-xl text-gray-700 w-full leading-relaxed font-medium drop-shadow-sm bg-white/30 p-8 lg:p-10 rounded-2xl backdrop-blur-sm border border-white/20">`;
const newP = `<p className="relative text-lg lg:text-xl text-gray-700 w-full leading-relaxed font-medium drop-shadow-sm bg-white/30 p-8 lg:p-10 rounded-2xl backdrop-blur-sm border border-white/20 text-center lg:text-left">`;

content = content.replace(oldP, newP);
fs.writeFileSync('pages/Home.tsx', content);
