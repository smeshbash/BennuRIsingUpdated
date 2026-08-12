const fs = require('fs');
let content = fs.readFileSync('pages/ContentPages.tsx', 'utf8');

const regex = /const PageLayout: React\.FC<PageLayoutProps> = \(\{.*?\n\);\n/gs;
const replacement = `const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, children, theme = 'white', heroImage, heroOverlay = 60 }) => (
  <div className={\`min-h-screen \${theme === 'beige' ? 'bg-[#EFEBE0]' : 'bg-brand-light'}\`}>
    {/* Hero Section */}
    <div className="relative w-full">
        <div className="pt-32 pb-12 px-4 text-center max-w-4xl mx-auto animate-fade-in-up">
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
);
`;

const match = content.match(regex);
if (match) {
    console.log("Matched!");
    content = content.replace(regex, replacement);
    fs.writeFileSync('pages/ContentPages.tsx', content);
} else {
    console.log("Did not match regex");
}
