const fs = require('fs');
const file = 'pages/DonateFlow.tsx';
let content = fs.readFileSync(file, 'utf8');

const wingsDataStr = `
const WINGS_PILLARS = [
  {
    id: "pillar_1",
    name: "Individual Transformation & Mental Health",
    wings: [
      { id: "wing_1", name: "Wing 1: Substance Abuse Prevention & Rehabilitation" },
      { id: "wing_2", name: "Wing 2: Mental Health & Psychological Well-being" },
      { id: "wing_3", name: "Wing 3: Community Wellness & Psychosocial Support" },
      { id: "wing_4", name: "Wing 4: Yoga, Meditation & Consciousness Studies" },
      { id: "wing_7", name: "Wing 7: Disability Inclusion & Accessibility" },
      { id: "wing_10", name: "Wing 10: Autism Awareness & Support" },
      { id: "wing_11", name: "Wing 11: Thalassemia Prevention & Patient Support" },
      { id: "wing_12", name: "Wing 12: Cancer Awareness & Patient Care" }
    ]
  },
  {
    id: "pillar_2",
    name: "Community Health & Development",
    wings: [
      { id: "wing_5", name: "Wing 5: Healthcare & Basic Human Needs Support" },
      { id: "wing_6", name: "Wing 6: Tribal Welfare & Indigenous Community Empowerment" },
      { id: "wing_8", name: "Wing 8: Arts, Culture & Heritage Preservation" },
      { id: "wing_9", name: "Wing 9: Gender Equality & Social Justice" },
      { id: "wing_13", name: "Wing 13: Skill Development & Livelihood Enhancement" },
      { id: "wing_16", name: "Wing 16: Senior Citizens Welfare & Dignity" },
      { id: "wing_17", name: "Wing 17: Armed Forces, Veterans & Uniformed Services Welfare" },
      { id: "wing_18", name: "Wing 18: Sports Development & Talent Promotion" },
      { id: "wing_19", name: "Wing 19: Social Welfare & Sustainable Development" },
      { id: "wing_21", name: "Wing 21: Education & Girl Child Empowerment" },
      { id: "wing_22", name: "Wing 22: Women & Child Development" }
    ]
  },
  {
    id: "pillar_3",
    name: "Disaster Response & Resilience",
    wings: [
      { id: "wing_15", name: "Wing 15: Animal Welfare & Marine Conservation" },
      { id: "wing_20", name: "Wing 20: Disaster Preparedness, Relief & Resilience" }
    ]
  },
  {
    id: "pillar_4",
    name: "Research, Policy & Advocacy",
    wings: [
      { id: "wing_14", name: "Wing 14: Traditional Healing & Indigenous Medicine Research" },
      { id: "wing_23", name: "Wing 23: Sustainable Development Goals (SDG) Partnership" },
      { id: "wing_24", name: "Wing 24: Legal Aid, Advocacy & Justice Support" },
      { id: "wing_25", name: "Wing 25: Research, Policy, Documentation & Publications" }
    ]
  }
];
`;

const oldImpactBox = `            {/* Fund Selection Ticket - Collapsible Pillars Box */}
            <div className="bg-white rounded-2xl p-1.5 shadow-lg">
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 relative">
                    <button 
                        type="button"
                        onClick={() => setIsPillarsOpen(!isPillarsOpen)}
                        className="w-full text-left flex items-center justify-between group/toggle"
                    >
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer group-hover/toggle:text-brand-blue transition-colors">Your Impact Allocation</label>
                        <ChevronDown className={\`w-4 h-4 text-gray-400 transition-transform duration-300 \${isPillarsOpen ? 'rotate-180' : ''}\`} />
                    </button>
                    <div className={\`overflow-hidden transition-all duration-500 ease-in-out \${isPillarsOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}\`}>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex-1 w-full">
                                <p className="text-xs text-gray-500 mb-4 font-medium">Your contribution supports one or a combination of our four core pillars:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                    {[
                                        "Individual Transformation & Mental Health",
                                        "Community Health & Development",
                                        "Disaster Response & Resilience",
                                        "Research, Policy & Advocacy"
                                    ].map((pillar, idx) => (
                                        <Link 
                                            key={idx} 
                                            to={\`/work#pillar-\${idx + 1}\`} 
                                            className="flex items-center gap-3 hover:translate-x-1 transition-transform no-underline group/pillar"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-brand-green shrink-0 shadow-sm group-hover/pillar:bg-brand-red transition-colors"></div>
                                            <span className="text-sm font-bold text-brand-blue leading-tight group-hover/pillar:text-brand-red transition-colors">{pillar}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden md:block h-12 w-px bg-gray-300 mx-4"></div>
                            <div className="flex items-center text-xs font-bold text-gray-500 whitespace-nowrap bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100">
                                <Info className="w-4 h-4 text-brand-blue mr-2" />
                                Makes an immediate impact
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

const newImpactBox = `            {/* Wing Selection Box */}
            <div className="bg-white rounded-2xl p-1.5 shadow-lg">
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 relative">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Your Impact Allocation (Select a Wing to Earmark)</label>
                    <div className="relative">
                        <select 
                            value={selectedFund} 
                            onChange={(e) => setSelectedFund(e.target.value)} 
                            className="w-full p-4 border border-gray-200 rounded-2xl bg-white shadow-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="general">General Fund (Where Needed Most)</option>
                            {WINGS_PILLARS.map(pillar => (
                                <optgroup key={pillar.id} label={pillar.name}>
                                    {pillar.wings.map(wing => (
                                        <option key={wing.id} value={wing.id}>{wing.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                    </div>
                    <div className="mt-4 flex items-center text-xs font-bold text-gray-500">
                        <Info className="w-4 h-4 text-brand-blue mr-2" />
                        By default, donations go to our General Fund to be deployed where most urgently needed.
                    </div>
                </div>
            </div>`;

if (!content.includes('WINGS_PILLARS')) {
  content = content.replace('// --- MAIN COMPONENT ---', wingsDataStr + '\n// --- MAIN COMPONENT ---');
}
content = content.replace(oldImpactBox, newImpactBox);

// Initialize selectedFund to 'general' instead of DONATION_FUNDS[0].id to avoid TS issues if DONATION_FUNDS is removed
content = content.replace(
  'const [selectedFund, setSelectedFund] = useState(initialFundId || DONATION_FUNDS[0].id);',
  'const [selectedFund, setSelectedFund] = useState(initialFundId || "general");'
);

fs.writeFileSync(file, content);
console.log("Patched DonateFlow.tsx!");
