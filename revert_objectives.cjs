const fs = require('fs');
let content = fs.readFileSync('pages/ContentPages.tsx', 'utf8');

const oldCode = `<div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group block h-full overflow-hidden">
                    <div className="float-left w-14 h-14 rounded-2xl bg-brand-light text-brand-red font-bold flex items-center justify-center text-lg mr-5 mb-2 group-hover:bg-brand-red group-hover:text-white transition-colors">
                        <Icon className="w-7 h-7" />
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium">
                        {objective}
                    </p>
                </div>`;

const newCode = `<div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full">
                    <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-red font-bold flex items-center justify-center text-lg mb-6 group-hover:bg-brand-red group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium flex-grow text-justify">
                        {objective}
                    </p>
                </div>`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('pages/ContentPages.tsx', content);
