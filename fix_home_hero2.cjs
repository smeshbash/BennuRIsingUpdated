const fs = require('fs');
let content = fs.readFileSync('pages/Home.tsx', 'utf8');

const regexLogo = /<div className="float-none md:float-left md:mr-10 mb-6 flex justify-center items-center relative flex-shrink-0">([\s\S]*?)<\/div>\s*{\/\* Hero Text \*\/}\s*<div className="space-y-8 animate-fade-in-up">/g;

content = content.replace(regexLogo, `<div className="float-none md:float-left w-full md:w-auto md:mr-10 mb-6 flex justify-center items-center relative flex-shrink-0">
$1</div>
              {/* Hero Text */}
              <div className="space-y-8 animate-fade-in-up flex flex-col items-center md:items-start text-center md:text-left">`);

const regexSlogan = /<div className="inline-flex items-center bg-white\/50 backdrop-blur-sm border border-white shadow-skeuo-sm rounded-full px-5 py-2">\s*<span className="w-3 h-3 bg-brand-green rounded-full mr-3 shadow-inner animate-pulse"><\/span>\s*<span className="text-brand-blue font-bold text-xs uppercase tracking-wider text-shadow-sm text-left">\{homeConfig.slogan\}<\/span>\s*<\/div>/g;

content = content.replace(regexSlogan, `<div className="inline-flex items-center bg-white/50 backdrop-blur-sm border border-white shadow-skeuo-sm rounded-full px-5 py-2 text-center md:text-left justify-center md:justify-start">
                   <span className="w-3 h-3 bg-brand-green rounded-full mr-3 shadow-inner animate-pulse flex-shrink-0"></span>
                   <span className="text-brand-blue font-bold text-xs uppercase tracking-wider text-shadow-sm">{homeConfig.slogan}</span>
                </div>`);

fs.writeFileSync('pages/Home.tsx', content);
