const fs = require('fs');
let content = fs.readFileSync('pages/ContentPages.tsx', 'utf8');

const oldLayout = `          <div className="md:hidden w-full mb-8 mt-4 relative p-4 rounded-[2.5rem] bg-brand-light shadow-skeuo-raised border border-white">
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

const newLayout = `          <div className="md:hidden w-full mb-8 mt-4 relative p-4 rounded-[2.5rem] bg-brand-light shadow-skeuo-raised border border-white">
             <div className="rounded-[2rem] overflow-hidden shadow-skeuo-input aspect-[4/3] bg-white border-2 border-gray-100 flex items-center justify-center p-4">
                 <img src={config.storyImage || null} alt="The Spirit of Bennu" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
             </div>
          </div>
          
          <div className="bg-white/50 p-6 rounded-2xl shadow-skeuo-input border border-white/60 flex items-start mt-4 md:mt-8 clear-both md:clear-none">
             <Award className="w-10 h-10 text-brand-red mr-4 flex-shrink-0" />
             <div>
                  <h4 className="font-bold text-brand-blue text-lg">Our Vision</h4>
                  <p className="text-gray-600 text-sm">{config.visionText}</p>
             </div>
          </div>
      </div>
    </div>`;

content = content.replace(oldLayout, newLayout);
fs.writeFileSync('pages/ContentPages.tsx', content);
