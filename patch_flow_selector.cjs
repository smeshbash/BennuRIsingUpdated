const fs = require('fs');
let flow = fs.readFileSync('pages/DonateFlow.tsx', 'utf8');

// Add import
if (!flow.includes('import { WingSelector }')) {
    flow = flow.replace('import { DONATION_FUNDS, RAZORPAY_KEY_ID, RAZORPAY_PLAN_ID, WINGS_PILLARS } from \'../constants\';', 'import { DONATION_FUNDS, RAZORPAY_KEY_ID, RAZORPAY_PLAN_ID, WINGS_PILLARS } from \'../constants\';\nimport { WingSelector } from "../components/WingSelector";');
}

const oldSelect = `<select 
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
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />`;

const newSelect = `<WingSelector 
                            value={selectedFund} 
                            onChange={setSelectedFund} 
                        />`;

if (flow.includes(oldSelect)) {
    flow = flow.replace(oldSelect, newSelect);
    fs.writeFileSync('pages/DonateFlow.tsx', flow);
    console.log("Patched DonateFlow");
} else {
    console.log("Could not find select in DonateFlow");
}
