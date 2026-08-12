const fs = require('fs');
let content = fs.readFileSync('components/Header.tsx', 'utf8');

content = content.replace(/className="hidden lg:flex space-x-1 items-center"/g, 'className="hidden xl:flex space-x-1 items-center"');
content = content.replace(/className="flex items-center lg:hidden"/g, 'className="flex items-center xl:hidden"');
content = content.replace(/<div className="lg:hidden bg-brand-light border-t border-white/g, '<div className="xl:hidden bg-brand-light border-t border-white');
content = content.replace(/className="h-24 lg:h-32 w-auto object-contain/g, 'className="h-16 md:h-20 lg:h-24 xl:h-28 w-auto object-contain');

fs.writeFileSync('components/Header.tsx', content);
