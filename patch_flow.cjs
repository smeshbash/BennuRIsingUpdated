const fs = require('fs');
let flow = fs.readFileSync('pages/DonateFlow.tsx', 'utf8');

if (!flow.includes('import { WINGS_PILLARS }')) {
    flow = flow.replace(/import { DONATION_FUNDS, RAZORPAY_KEY_ID, RAZORPAY_PLAN_ID } from '\.\.\/constants';/, "import { DONATION_FUNDS, RAZORPAY_KEY_ID, RAZORPAY_PLAN_ID, WINGS_PILLARS } from '../constants';");
    fs.writeFileSync('pages/DonateFlow.tsx', flow);
    console.log("Patched!");
} else {
    console.log("Already patched.");
}
