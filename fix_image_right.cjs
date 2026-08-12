const fs = require('fs');
let content = fs.readFileSync('pages/Home.tsx', 'utf8');

const oldLogoCol = `<div className="flex justify-center lg:justify-start items-center relative flex-shrink-0 w-full lg:-ml-12">
                     <div className="absolute w-[200px] h-[200px] bg-white/40 blur-[50px] rounded-full scale-75 -z-10 animate-pulse"></div>
                     <img src="/logo1.png" alt="Bennu Rising Logo" className="relative z-10 h-48 md:h-64 lg:h-72 w-auto drop-shadow-2xl animate-float filter contrast-110 object-contain mx-auto lg:mx-0" referrerPolicy="no-referrer" />
                  </div>`;
                  
const newLogoCol = `<div className="flex justify-center lg:justify-end items-center relative flex-shrink-0 w-full">
                     <div className="absolute w-[200px] h-[200px] bg-white/40 blur-[50px] rounded-full scale-75 -z-10 animate-pulse right-0"></div>
                     <img src="/logo1.png" alt="Bennu Rising Logo" className="relative z-10 h-48 md:h-64 lg:h-72 w-auto drop-shadow-2xl animate-float filter contrast-110 object-contain mx-auto lg:mx-0 lg:ml-auto" referrerPolicy="no-referrer" />
                  </div>`;

content = content.replace(oldLogoCol, newLogoCol);
fs.writeFileSync('pages/Home.tsx', content);
