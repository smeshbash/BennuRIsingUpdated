const fs = require('fs');
let widget = fs.readFileSync('components/DonationWidget.tsx', 'utf8');

// Add import
if (!widget.includes('import { WingSelector }')) {
    widget = widget.replace('import { WINGS_PILLARS } from "../constants";', 'import { WINGS_PILLARS } from "../constants";\nimport { WingSelector } from "./WingSelector";');
}

const oldSelect = `<select 
                  onChange={(e) => {
                      // Navigate to donate flow with selected fund
                      window.location.href = \`/donate?amt=\${amount}&freq=\${frequency}&fund=\${e.target.value}\`;
                  }} 
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:border-brand-blue outline-none transition font-bold text-gray-700 text-sm appearance-none cursor-pointer"
                  defaultValue="general"
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
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />`;

const newSelect = `<WingSelector 
                  value="general" 
                  onChange={(val) => {
                      window.location.href = \`/donate?amt=\${amount}&freq=\${frequency}&fund=\${val}\`;
                  }} 
              />`;

if (widget.includes(oldSelect)) {
    widget = widget.replace(oldSelect, newSelect);
    fs.writeFileSync('components/DonationWidget.tsx', widget);
    console.log("Patched DonationWidget");
} else {
    console.log("Could not find select in DonationWidget");
}
