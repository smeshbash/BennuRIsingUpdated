const fs = require('fs');
const file = 'components/DonationWidget.tsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = "{/* Cause Selection - Replaced with static pillars box */}";
const endStr = "</div>\n        </div>";

const startIndex = content.indexOf(startStr);
// Need to be careful with endStr to get the right one.
// Let's use substring indexOf to find the end of the block.
let endIndex = -1;
if (startIndex !== -1) {
  endIndex = content.indexOf("</div>\n        </div>", startIndex);
}

if (startIndex !== -1 && endIndex !== -1) {
  const oldBox = content.substring(startIndex, endIndex + "</div>\n        </div>".length);
  
  const newBox = `{/* Cause Selection - Wing Earmarking */}
        <div className="mb-4 bg-brand-light p-4 rounded-xl shadow-skeuo-pressed border border-white/50">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Your Impact Allocation (Earmark)</label>
          <div className="relative">
              <select 
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
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
          </div>
          <div className="mt-3 flex items-start text-[10px] text-gray-500 font-medium leading-tight">
              <Info className="w-3 h-3 text-brand-blue mr-1.5 flex-shrink-0 mt-0.5" />
              <span>By default, donations go to our General Fund to be deployed where most urgently needed.</span>
          </div>
        </div>`;

  content = content.replace(oldBox, newBox);
  
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
  if(!content.includes('WINGS_PILLARS')) {
      content = content.replace('const DonationWidget: React.FC<DonationWidgetProps> = ({', wingsDataStr + '\nconst DonationWidget: React.FC<DonationWidgetProps> = ({');
  }

  fs.writeFileSync(file, content);
  console.log("Successfully replaced widget box!");
} else {
  console.log("Could not find start or end bounds.");
  console.log("Start index:", startIndex);
  console.log("End index:", endIndex);
}
