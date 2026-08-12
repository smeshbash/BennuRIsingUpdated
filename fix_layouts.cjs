const fs = require('fs');

let homeContent = fs.readFileSync('pages/Home.tsx', 'utf8');
homeContent = homeContent.replace(
    /<div className="max-w-4xl flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16 relative z-10">([\s\S]*?)<\/div>\s*\{\/\* Widget placement/g,
    `<div className="max-w-6xl mx-auto relative z-10 clearfix pt-8 lg:pr-[350px]">
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
                </div>
                
                <div className="text-5xl lg:text-6xl xl:text-7xl font-serif-heading font-extrabold leading-tight text-brand-blue drop-shadow-sm">
                  {renderHeroTitle(homeConfig.heroTitle)}
                </div>
                
                <p className="relative text-lg lg:text-xl text-gray-700 w-full leading-relaxed font-medium drop-shadow-sm bg-white/30 p-8 lg:p-10 rounded-2xl backdrop-blur-sm border border-white/20 whitespace-pre-wrap overflow-hidden">
                  <Quote className="absolute top-2 left-2 w-8 h-8 lg:w-12 lg:h-12 text-brand-blue/10" />
                  {homeConfig.heroSubtitle}
                  <Quote className="absolute bottom-2 right-2 w-8 h-8 lg:w-12 lg:h-12 text-brand-blue/10 rotate-180" />
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4">
                   <button onClick={() => navigate('/work')} className="group bg-white text-brand-blue px-8 py-4 rounded-2xl font-bold hover:text-brand-red transition-all shadow-skeuo-raised hover:shadow-skeuo-sm active:shadow-skeuo-pressed active:scale-95 flex items-center border border-white/60">
                     {homeConfig.exploreBtn} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
          </div>

          {/* Widget placement`
);
fs.writeFileSync('pages/Home.tsx', homeContent);

let cpContent = fs.readFileSync('pages/ContentPages.tsx', 'utf8');

// Replace AboutPage story layout
cpContent = cpContent.replace(
    /<div className="grid md:grid-cols-2 gap-12 items-center">\s*<div className="order-2 md:order-1">\s*<h2 className="text-3xl font-serif-heading font-bold text-brand-blue mb-6">\{config\.storyTitle\}<\/h2>\s*<p className="text-gray-700 leading-relaxed font-medium mb-6 text-justify">\{config\.storyContent\}<\/p>\s*<\/div>\s*<div className="order-1 md:order-2 flex justify-center">\s*\{config\.storyImage \? \(\s*<img src=\{config\.storyImage\} alt="Our Story" className="rounded-\[2rem\] shadow-2xl w-full h-auto object-cover max-h-\[500px\]" \/>\s*\) : \(\s*<div className="bg-white p-8 rounded-\[3rem\] shadow-skeuo-sm border border-brand-blue\/10 flex items-center justify-center">\s*<img src="\/logo1\.png" alt="Bennu Rising" className="w-64 h-auto opacity-90 object-contain drop-shadow-xl" \/>\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>/g,
    `<h2 className="text-3xl font-serif-heading font-bold text-brand-blue mb-6">{config.storyTitle}</h2>
            <div className="clearfix text-gray-700 leading-relaxed font-medium mb-6 text-justify">
                <div className="float-none md:float-left md:mr-10 mb-6 flex justify-center w-full md:w-1/2 lg:w-1/3">
                     {config.storyImage ? (
                         <img src={config.storyImage} alt="Our Story" className="rounded-[2rem] shadow-2xl w-full h-auto object-cover max-h-[400px]" />
                     ) : (
                         <div className="bg-white p-8 rounded-[3rem] shadow-skeuo-sm border border-brand-blue/10 flex items-center justify-center w-full">
                             <img src="/logo1.png" alt="Bennu Rising" className="w-full max-w-[200px] h-auto opacity-90 object-contain drop-shadow-xl" />
                         </div>
                     )}
                </div>
                {config.storyContent}
            </div>`
);

// Replace WorkPage initiatives layout
cpContent = cpContent.replace(
    /<div key=\{idx\} className=\{`grid md:grid-cols-2 gap-12 items-center mb-24`\}>\s*<div className=\{idx % 2 !== 0 \? 'md:order-2' : ''\}>\s*<div className="flex items-center gap-4 mb-6">\s*<div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center shadow-skeuo-pressed text-brand-blue border border-white">\s*\{renderIcon\(init\.icon, "w-6 h-6"\)\}\s*<\/div>\s*<h3 className="text-2xl font-bold text-brand-blue">\{init\.title\}<\/h3>\s*<\/div>\s*<p className="text-gray-600 leading-relaxed font-medium text-justify">\{init\.desc\}<\/p>\s*<\/div>\s*<div className=\{idx % 2 !== 0 \? 'md:order-1' : ''\}>\s*<div className="bg-white p-4 rounded-\[2\.5rem\] shadow-skeuo-raised border border-white">\s*\{init\.image \? \(\s*<img src=\{init\.image\} alt=\{init\.title\} className="rounded-\[2rem\] w-full h-80 object-cover" \/>\s*\) : \(\s*<div className="rounded-\[2rem\] w-full h-80 bg-brand-light flex items-center justify-center shadow-inner">\s*<Activity className="w-16 h-16 text-brand-blue\/20" \/>\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>\s*<\/div>/g,
    `<div key={idx} className="mb-24 clearfix">
                    <div className={\`float-none w-full md:w-1/2 lg:w-5/12 mb-6 \${idx % 2 !== 0 ? 'md:float-right md:ml-8' : 'md:float-left md:mr-8'}\`}>
                        <div className="bg-white p-4 rounded-[2.5rem] shadow-skeuo-raised border border-white">
                            {init.image ? (
                                <img src={init.image} alt={init.title} className="rounded-[2rem] w-full h-64 lg:h-80 object-cover" />
                            ) : (
                                <div className="rounded-[2rem] w-full h-64 lg:h-80 bg-brand-light flex items-center justify-center shadow-inner">
                                    <Activity className="w-16 h-16 text-brand-blue/20" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center shadow-skeuo-pressed text-brand-blue border border-white">
                                {renderIcon(init.icon, "w-6 h-6")}
                            </div>
                            <h3 className="text-2xl font-bold text-brand-blue">{init.title}</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium text-justify">{init.desc}</p>
                    </div>
                </div>`
);


// Replace ImpactPage story layout
cpContent = cpContent.replace(
    /<div className="grid md:grid-cols-2 gap-12 items-center mb-16">\s*<div>\s*<h2 className="text-3xl font-serif-heading font-bold text-brand-blue mb-6">\{config\.storyTitle\}<\/h2>\s*<p className="text-gray-700 leading-relaxed font-medium text-justify mb-6">\{config\.storyContent\}<\/p>\s*<\/div>\s*<div>\s*\{config\.storyImage \? \(\s*<img src=\{config\.storyImage\} alt="Impact Story" className="rounded-\[2\.5rem\] shadow-skeuo-raised border border-white w-full h-auto object-cover max-h-\[400px\]" \/>\s*\) : \(\s*<div className="bg-brand-light p-8 rounded-\[3rem\] shadow-inner border border-white\/50 flex flex-col justify-center items-center h-\[300px\]">\s*<Globe className="w-20 h-20 text-brand-green\/30 mb-4" \/>\s*<span className="text-brand-blue\/40 font-bold uppercase tracking-widest text-sm">Real Impact<\/span>\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>/g,
    `<div className="mb-16 clearfix">
                    <h2 className="text-3xl font-serif-heading font-bold text-brand-blue mb-6">{config.storyTitle}</h2>
                    <div className="float-none md:float-right md:ml-8 mb-6 w-full md:w-1/2 lg:w-5/12">
                         {config.storyImage ? (
                             <img src={config.storyImage} alt="Impact Story" className="rounded-[2.5rem] shadow-skeuo-raised border border-white w-full h-auto object-cover max-h-[400px]" />
                         ) : (
                            <div className="bg-brand-light p-8 rounded-[3rem] shadow-inner border border-white/50 flex flex-col justify-center items-center h-[300px]">
                                <Globe className="w-20 h-20 text-brand-green/30 mb-4" />
                                <span className="text-brand-blue/40 font-bold uppercase tracking-widest text-sm">Real Impact</span>
                            </div>
                         )}
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium text-justify">{config.storyContent}</p>
                </div>`
);


fs.writeFileSync('pages/ContentPages.tsx', cpContent);

