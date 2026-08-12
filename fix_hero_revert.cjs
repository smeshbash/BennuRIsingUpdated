const fs = require('fs');
let content = fs.readFileSync('pages/Home.tsx', 'utf8');

const regexHeroText = /<div className="space-y-8 animate-fade-in-up[^"]*">/g;
content = content.replace(regexHeroText, `<div className="space-y-8 animate-fade-in-up text-center lg:text-left">`);

const regexLogoContainer = /<div className="float-none md:float-left w-full md:w-auto md:mr-10 mb-6 flex justify-center items-center relative flex-shrink-0">/g;
content = content.replace(regexLogoContainer, `<div className="float-none lg:float-left w-full lg:w-auto lg:mr-10 mb-6 flex justify-center lg:justify-start items-center relative flex-shrink-0">`);

const regexSlogan = /<div className="inline-flex items-center bg-white\/50 backdrop-blur-sm border border-white shadow-skeuo-sm rounded-full px-5 py-2 text-center md:text-left justify-center md:justify-start">/g;
content = content.replace(regexSlogan, `<div className="inline-flex items-center bg-white/50 backdrop-blur-sm border border-white shadow-skeuo-sm rounded-full px-5 py-2 justify-center lg:justify-start">`);

fs.writeFileSync('pages/Home.tsx', content);
