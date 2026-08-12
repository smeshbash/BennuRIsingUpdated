const fs = require('fs');
const file = 'pages/ContentPages.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetState = `const [form, setForm] = useState({ contact: '', organization: '', email: '', phone: '', type: 'Corporate CSR Partnership', message: '' });`;
content = content.replace(targetState, targetState + `\n    const [partners, setPartners] = useState<any[]>([]);`);

const targetEffect = `setConfig(prev => ({
                        heroTitle: val('partner_hero_title') || prev.heroTitle,
                        heroSubtitle: val('partner_hero_subtitle') || prev.heroSubtitle,
                        heroImage: val('partner_hero_image') || prev.heroImage,
                        benefits: newBenefits,
                        proposalTitle: val('partner_proposal_title') || prev.proposalTitle,
                        proposalText: val('partner_proposal_text') || prev.proposalText
                    }));
                }
            });
        }
    }, []);`;
const newEffect = `setConfig(prev => ({
                        heroTitle: val('partner_hero_title') || prev.heroTitle,
                        heroSubtitle: val('partner_hero_subtitle') || prev.heroSubtitle,
                        heroImage: val('partner_hero_image') || prev.heroImage,
                        benefits: newBenefits,
                        proposalTitle: val('partner_proposal_title') || prev.proposalTitle,
                        proposalText: val('partner_proposal_text') || prev.proposalText
                    }));
                }
            });

            // Fetch showcased partners
            supabase.from('partnership_inquiries')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: true })
                .then(({data}) => {
                    if (data) setPartners(data);
                });
        }
    }, []);`;
content = content.replace(targetEffect, newEffect);

const targetRender = `<div id="our-partners" className="relative z-30 mt-8 mb-20 scroll-mt-24">`;
const newRender = `
            {partners.length > 0 && (
                <div id="showcased-partners" className="relative z-30 mt-8 mb-20">
                    <div className="flex justify-center mb-10">
                        <div className="bg-white text-brand-blue px-8 py-3 rounded-full font-bold shadow-skeuo-raised border border-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                            <span className="uppercase tracking-widest text-xs">Our Valued Partners</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center justify-center">
                        {partners.map(p => (
                            <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-4 hover:shadow-md transition">
                                {p.logo_url ? (
                                    <img src={p.logo_url} alt={p.organization} className="w-20 h-20 object-contain" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand-blue font-bold text-xl shadow-inner">
                                        {p.organization.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm leading-tight">{p.organization}</h4>
                                    {p.message && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div id="our-partners" className="relative z-30 mt-8 mb-20 scroll-mt-24">`;
content = content.replace(targetRender, newRender);

fs.writeFileSync(file, content);
console.log("Patched ContentPages Partners");
