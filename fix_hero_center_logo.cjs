const fs = require('fs');
let content = fs.readFileSync('pages/Home.tsx', 'utf8');

const heroRegex = /<div className="max-w-6xl mx-auto relative z-10 pt-8 lg:pr-\[350px\]">([\s\S]*?)<\/div>\s*<\/div>\s*{\/\* Widget placement/m;

const newHeroContent = `<div className="max-w-6xl mx-auto relative z-10 pt-8 lg:pr-[350px]">
              <div className="flex flex-col items-center gap-8 lg:gap-12">
                  {/* Logo Column (Centered on both mobile and desktop) */}
                  <div className="flex justify-center items-center relative flex-shrink-0 w-full">
                     <div className="absolute w-[200px] h-[200px] bg-white/40 blur-[50px] rounded-full scale-75 -z-10 animate-pulse"></div>
                     <img src="/logo1.png" alt="Bennu Rising Logo" className="relative z-10 h-48 md:h-64 lg:h-72 w-auto drop-shadow-2xl animate-float filter contrast-110 object-contain" referrerPolicy="no-referrer" />
                  </div>
                  
                  {/* Hero Text Column (Left-aligned on desktop, centered on mobile) */}
                  <div className="space-y-8 animate-fade-in-up flex flex-col items-center lg:items-start text-center lg:text-left w-full">
                      <div className="inline-flex items-center bg-white/50 backdrop-blur-sm border border-white shadow-skeuo-sm rounded-full px-5 py-2">
                         <span className="w-3 h-3 bg-brand-green rounded-full mr-3 shadow-inner animate-pulse flex-shrink-0"></span>
                         <span className="text-brand-blue font-bold text-xs uppercase tracking-wider text-shadow-sm">{homeConfig.slogan}</span>
                      </div>
                      
                      <div className="text-5xl lg:text-6xl xl:text-7xl font-serif-heading font-extrabold leading-tight text-brand-blue drop-shadow-sm w-full">
                        {renderHeroTitle(homeConfig.heroTitle)}
                      </div>
                      
                      <p className="relative text-lg lg:text-xl text-gray-700 w-full leading-relaxed font-medium drop-shadow-sm bg-white/30 p-8 lg:p-10 rounded-2xl backdrop-blur-sm border border-white/20 text-center lg:text-left">
                        <Quote className="absolute top-2 left-2 w-8 h-8 lg:w-12 lg:h-12 text-brand-blue/10" />
                        {homeConfig.heroSubtitle}
                        <Quote className="absolute bottom-2 right-2 w-8 h-8 lg:w-12 lg:h-12 text-brand-blue/10 rotate-180" />
                      </p>
                      
                      <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 w-full">
                         <button onClick={() => navigate('/work')} className="group bg-white text-brand-blue px-8 py-4 rounded-2xl font-bold hover:text-brand-red transition-all shadow-skeuo-raised hover:shadow-skeuo-sm active:shadow-skeuo-pressed active:scale-95 flex items-center border border-white/60">
                           {homeConfig.exploreBtn} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                  </div>
              </div>
          </div>
          {/* Widget placement`;

content = content.replace(heroRegex, newHeroContent);
fs.writeFileSync('pages/Home.tsx', content);
