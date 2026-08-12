const fs = require('fs');
let cpContent = fs.readFileSync('pages/ContentPages.tsx', 'utf8');

const oldLayout = `<div id="our-story" className="mb-24 scroll-mt-24 text-gray-700 text-lg leading-relaxed font-medium clearfix">
      <div className="float-left w-2/3 sm:w-1/2 md:w-5/12 lg:w-1/3 mr-6 mb-6 relative p-4 md:p-6 rounded-[2.5rem] bg-brand-light shadow-skeuo-raised border border-white">
         <div className="rounded-[2rem] overflow-hidden shadow-skeuo-input aspect-[4/3] bg-white border-2 md:border-4 border-gray-100 flex items-center justify-center p-4 md:p-8">
             <img src={config.storyImage || null} alt="The Spirit of Bennu" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
         </div>
      </div>
      <h3 className="text-3xl font-bold text-brand-blue font-serif-heading drop-shadow-sm mb-4">{config.storyTitle}</h3>
      <p className="mb-6 whitespace-pre-wrap text-justify inline">{config.storyContent}</p>
      
      <div className="bg-white/50 p-6 rounded-2xl shadow-skeuo-input border border-white/60 flex items-start mt-8 clear-both md:clear-none">
         <Award className="w-10 h-10 text-brand-red mr-4 flex-shrink-0" />
         <div>
              <h4 className="font-bold text-brand-blue text-lg">Our Vision</h4>
              <p className="text-gray-600 text-sm">{config.visionText}</p>
         </div>
      </div>
    </div>`;

const newLayout = `<div id="our-story" className="mb-24 scroll-mt-24 text-gray-700 text-lg leading-relaxed font-medium">
      <h3 className="text-3xl font-bold text-brand-blue font-serif-heading drop-shadow-sm mb-6">{config.storyTitle}</h3>
      <div className="clearfix">
          {/* Desktop/Tablet Floated Image - Hidden on mobile */}
          <div className="hidden md:block float-left w-1/2 lg:w-5/12 mr-8 mb-6 relative p-4 md:p-6 rounded-[2.5rem] bg-brand-light shadow-skeuo-raised border border-white">
             <div className="rounded-[2rem] overflow-hidden shadow-skeuo-input aspect-[4/3] bg-white border-4 border-gray-100 flex items-center justify-center p-4 md:p-8">
                 <img src={config.storyImage || null} alt="The Spirit of Bennu" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
             </div>
          </div>
          
          <p className="mb-6 whitespace-pre-wrap text-justify block">{config.storyContent}</p>
          
          {/* Mobile Image - Shown only on mobile, placed after the paragraph */}
          <div className="md:hidden w-full mb-8 mt-4 relative p-4 rounded-[2.5rem] bg-brand-light shadow-skeuo-raised border border-white">
             <div className="rounded-[2rem] overflow-hidden shadow-skeuo-input aspect-[4/3] bg-white border-2 border-gray-100 flex items-center justify-center p-4">
                 <img src={config.storyImage || null} alt="The Spirit of Bennu" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
             </div>
          </div>
      </div>
      
      <div className="bg-white/50 p-6 rounded-2xl shadow-skeuo-input border border-white/60 flex items-start mt-8 clear-both">
         <Award className="w-10 h-10 text-brand-red mr-4 flex-shrink-0" />
         <div>
              <h4 className="font-bold text-brand-blue text-lg">Our Vision</h4>
              <p className="text-gray-600 text-sm">{config.visionText}</p>
         </div>
      </div>
    </div>`;

cpContent = cpContent.replace(oldLayout, newLayout);
fs.writeFileSync('pages/ContentPages.tsx', cpContent);
