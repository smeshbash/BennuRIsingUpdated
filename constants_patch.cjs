const fs = require('fs');
const constFile = 'constants.ts';
let constants = fs.readFileSync(constFile, 'utf8');

const wingsDataStr = `
export const WINGS_PILLARS = [
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
if (!constants.includes('WINGS_PILLARS')) {
  fs.writeFileSync(constFile, constants + '\n' + wingsDataStr);
}

// Update components/DonationWidget.tsx
let widget = fs.readFileSync('components/DonationWidget.tsx', 'utf8');
if (!widget.includes('import { WINGS_PILLARS } from "../constants"')) {
    widget = widget.replace(/import\s+{.*}\s+from\s+['"]lucide-react['"];/, (match) => match + '\nimport { WINGS_PILLARS } from "../constants";');
    fs.writeFileSync('components/DonationWidget.tsx', widget);
}

// Update pages/DonateFlow.tsx
let flow = fs.readFileSync('pages/DonateFlow.tsx', 'utf8');
// Remove hardcoded WINGS_PILLARS
if (flow.includes('const WINGS_PILLARS = [')) {
    // Regex to remove the WINGS_PILLARS array
    flow = flow.replace(/const WINGS_PILLARS = \[\s*\{[\s\S]*?\];\s*\/\/\s*---\s*MAIN COMPONENT\s*---/, '// --- MAIN COMPONENT ---');
}
if (!flow.includes('import { WINGS_PILLARS }')) {
    flow = flow.replace(/import { DONATION_FUNDS } from '\.\.\/constants';/, "import { DONATION_FUNDS, WINGS_PILLARS } from '../constants';");
    fs.writeFileSync('pages/DonateFlow.tsx', flow);
}

