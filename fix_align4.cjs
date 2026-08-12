const fs = require('fs');
let content = fs.readFileSync('pages/Home.tsx', 'utf8');

const oldSlogan = `<div className="inline-flex items-center mx-auto lg:mx-0 bg-white/50 backdrop-blur-sm border border-white shadow-skeuo-sm rounded-full px-5 py-2 justify-center lg:justify-start">
                   <span className="w-3 h-3 bg-brand-green rounded-full mr-3 shadow-inner animate-pulse flex-shrink-0"></span>
                   <span className="text-brand-blue font-bold text-xs uppercase tracking-wider text-shadow-sm">{homeConfig.slogan}</span>
                </div>`;
const newSlogan = `<div className="w-full flex justify-center lg:justify-start">
                  <div className="inline-flex items-center bg-white/50 backdrop-blur-sm border border-white shadow-skeuo-sm rounded-full px-5 py-2">
                     <span className="w-3 h-3 bg-brand-green rounded-full mr-3 shadow-inner animate-pulse flex-shrink-0"></span>
                     <span className="text-brand-blue font-bold text-xs uppercase tracking-wider text-shadow-sm">{homeConfig.slogan}</span>
                  </div>
                </div>`;

content = content.replace(oldSlogan, newSlogan);
fs.writeFileSync('pages/Home.tsx', content);
