const fs = require('fs');
let cpContent = fs.readFileSync('pages/ContentPages.tsx', 'utf8');

const oldLayout = `<div id="leadership" className="mb-12 scroll-mt-24">
        <h3 className="text-3xl font-serif-heading font-bold text-center text-brand-blue mb-12">{config.leadershipTitle}</h3>
        <div className="space-y-12">
            {members.map((member, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-8 items-center bg-brand-light rounded-[2.5rem] p-8 shadow-skeuo-raised border border-white group transition-all hover:shadow-skeuo-sm">
                    <div className={\`w-full md:w-1/3 flex-shrink-0 \${idx % 2 !== 0 ? 'md:order-2' : ''}\`}>
                        <div className="rounded-[2rem] overflow-hidden shadow-skeuo-input aspect-square max-w-sm mx-auto group-hover:scale-[1.02] transition-transform">
                            <img src={member.image || null} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className={\`w-full md:w-2/3 space-y-4 flex flex-col items-center md:items-start text-center md:text-left \${idx % 2 !== 0 ? 'md:order-1' : ''}\`}>
                        <h4 className="text-3xl font-bold text-gray-800">{member.name}</h4>
                        <span className="text-brand-red font-bold text-sm uppercase tracking-wider block">{member.role}</span>
                        <p className="text-gray-700 text-lg leading-relaxed md:text-justify">{member.bio}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>`;

const newLayout = `<div id="leadership" className="mb-12 scroll-mt-24">
        <h3 className="text-3xl font-serif-heading font-bold text-center text-brand-blue mb-12">{config.leadershipTitle}</h3>
        <div className="space-y-12">
            {members.map((member, idx) => (
                <div key={idx} className="bg-brand-light rounded-[2.5rem] p-8 shadow-skeuo-raised border border-white group transition-all hover:shadow-skeuo-sm clearfix">
                    {/* Desktop Float Image */}
                    <div className={\`hidden md:block w-1/3 max-w-sm \${idx % 2 !== 0 ? 'float-right ml-8' : 'float-left mr-8'} mb-4\`}>
                        <div className="rounded-[2rem] overflow-hidden shadow-skeuo-input aspect-square group-hover:scale-[1.02] transition-transform">
                            <img src={member.image || null} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                    
                    <div className="text-center md:text-left">
                        <h4 className="text-3xl font-bold text-gray-800 mb-2">{member.name}</h4>
                        <span className="text-brand-red font-bold text-sm uppercase tracking-wider block mb-4">{member.role}</span>
                    </div>
                    
                    <p className="text-gray-700 text-lg leading-relaxed text-justify block">{member.bio}</p>
                    
                    {/* Mobile Image */}
                    <div className="md:hidden w-full max-w-sm mx-auto mt-6">
                        <div className="rounded-[2rem] overflow-hidden shadow-skeuo-input aspect-square group-hover:scale-[1.02] transition-transform">
                            <img src={member.image || null} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>`;

cpContent = cpContent.replace(oldLayout, newLayout);
fs.writeFileSync('pages/ContentPages.tsx', cpContent);
