const fs = require('fs');
let content = fs.readFileSync('pages/ContentPages.tsx', 'utf8');

const oldPageLayout = `const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, children, theme = 'white', heroImage, heroOverlay = 60 }) => (
  <div className={\`min-h-screen \${theme === 'beige' ? 'bg-[#EFEBE0]' : 'bg-brand-light'}\`}>
    {/* Hero Section */}
    <div className="relative w-full">
        {heroImage ? (
            <div className="relative h-[15vh] min-h-[150px] lg:h-[20vh] lg:min-h-[180px] flex items-center justify-center overflow-hidden">
                <img src={heroImage || null} alt={title} className="absolute inset-0 w-full h-full object-cover" />
                <div className={\`absolute inset-0 bg-brand-blue/\${heroOverlay} backdrop-blur-[2px]\`}></div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif-heading font-extrabold text-white mb-4 drop-shadow-lg leading-tight">{title}</h1>
                    {subtitle && <p className="text-lg lg:text-xl text-blue-100 font-medium max-w-4xl mx-auto drop-shadow-md">{subtitle}</p>}
                    <div className="w-24 h-1.5 bg-brand-green mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(76,175,80,0.8)]"></div>
                </div>
            </div>
        ) : (
            <div className="pt-24 pb-12 px-4 text-center max-w-4xl mx-auto animate-fade-in-up">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif-heading font-extrabold text-brand-blue mb-4 drop-shadow-sm">{title}</h1>
                {subtitle && <p className="text-lg lg:text-xl text-gray-600 font-medium max-w-4xl mx-auto">{subtitle}</p>}
                <div className="w-32 h-2 bg-gradient-to-r from-brand-blue to-brand-green mx-auto mt-6 rounded-full shadow-inner"></div>
            </div>
        )}
    </div>
    
    {/* Content */}
    <div className={\`container mx-auto px-4 \${heroImage ? '-mt-12 relative z-20 pb-24' : 'pb-24'}\`}>
      <div className={\`\${heroImage ? 'bg-brand-light/95 backdrop-blur-xl rounded-[3rem] shadow-2xl p-8 lg:p-12 border border-white/50' : ''} animate-fade-in\`}>
        {children}
      </div>
    </div>
  </div>
);`;

const newPageLayout = `const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, children, theme = 'white', heroImage, heroOverlay = 60 }) => (
  <div className={\`min-h-screen \${theme === 'beige' ? 'bg-[#EFEBE0]' : 'bg-brand-light'}\`}>
    {/* Hero Section */}
    <div className="relative w-full">
        <div className="pt-24 pb-12 px-4 text-center max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif-heading font-extrabold text-brand-blue mb-4 drop-shadow-sm">{title}</h1>
            {subtitle && <p className="text-lg lg:text-xl text-gray-600 font-medium max-w-4xl mx-auto">{subtitle}</p>}
            <div className="w-32 h-2 bg-gradient-to-r from-brand-blue to-brand-green mx-auto mt-6 rounded-full shadow-inner"></div>
        </div>
    </div>
    
    {/* Content */}
    <div className="container mx-auto px-4 pb-24">
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  </div>
);`;

content = content.replace(oldPageLayout, newPageLayout);
fs.writeFileSync('pages/ContentPages.tsx', content);
