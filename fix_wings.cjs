const fs = require('fs');
const file = 'pages/DonateFlow.tsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = "{/* Fund Selection Ticket - Collapsible Pillars Box */}";
const endStr = "Makes an immediate impact\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const oldBox = content.substring(startIndex, endIndex + endStr.length);
  
  const newBox = `            {/* Wing Selection Box */}
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

  content = content.replace(oldBox, newBox);
  fs.writeFileSync(file, content);
  console.log("Successfully replaced box!");
} else {
  console.log("Could not find start or end bounds.");
  console.log("Start index:", startIndex);
  console.log("End index:", endIndex);
}
