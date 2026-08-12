const fs = require('fs');
let content = fs.readFileSync('pages/Home.tsx', 'utf8');

const oldLayout = `          <div className="max-w-6xl mx-auto relative z-10 clearfix pt-8 lg:pr-[350px]">
              {/* Logo - Floated to left */}
              <div className="float-none md:float-left md:mr-10 mb-6 flex justify-center items-center relative flex-shrink-0">
                 <div className="absolute w-full h-full bg-white/40 blur-[50px] rounded-full scale-75 -z-10 animate-pulse"></div>
                 <img src="/logo1.png" alt="Bennu Rising Logo" className="relative z-10 h-48 md:h-64 w-auto drop-shadow-2xl animate-float filter contrast-110 object-contain" referrerPolicy="no-referrer" />
              </div>
              {/* Hero Text */}
              <div className="space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center bg-white/50 backdrop-blur-sm border border-white shadow-skeuo-sm rounded-full px-5 py-2">
                   <span className="w-3 h-3 bg-brand-green rounded-full mr-3 shadow-inner animate-pulse"></span>
                   <span className="text-brand-blue font-bold text-xs uppercase tracking-wider text-shadow-sm text-left">{homeConfig.slogan}</span>
                </div>`;

const newLayout = `          <div className="max-w-6xl mx-auto relative z-10 clearfix pt-8 lg:pr-[350px]">
              {/* Logo - Floated to left */}
              <div className="float-none md:float-left md:mr-10 mb-6 flex justify-center items-center relative flex-shrink-0 w-full md:w-auto">
                 <div className="absolute w-full h-full bg-white/40 blur-[50px] rounded-full scale-75 -z-10 animate-pulse"></div>
                 <img src="/logo1.png" alt="Bennu Rising Logo" className="relative z-10 h-48 md:h-64 mx-auto w-auto drop-shadow-2xl animate-float filter contrast-110 object-contain" referrerPolicy="no-referrer" />
              </div>
              {/* Hero Text */}
              <div className="space-y-8 animate-fade-in-up flex flex-col items-center md:items-start text-center md:text-left clear-both md:clear-none">
                <div className="inline-flex items-center justify-center md:justify-start bg-white/50 backdrop-blur-sm border border-white shadow-skeuo-sm rounded-full px-5 py-2">
                   <span className="w-3 h-3 bg-brand-green rounded-full mr-3 shadow-inner animate-pulse flex-shrink-0"></span>
                   <span className="text-brand-blue font-bold text-xs uppercase tracking-wider text-shadow-sm text-center md:text-left">{homeConfig.slogan}</span>
                </div>`;

content = content.replace(oldLayout, newLayout);
fs.writeFileSync('pages/Home.tsx', content);
