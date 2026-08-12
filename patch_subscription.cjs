const fs = require('fs');
let content = fs.readFileSync('pages/DonateFlow.tsx', 'utf8');

const targetFunctionRegex = /const createSubscription = async \(\) => \{[\s\S]*?initiateStandardPayment\(true\);\s*\}\s*\};/;

const replacementFunction = `const createSubscription = async () => {
    // We don't have the edge function deployed for Razorpay Subscriptions right now.
    // So we just bypass it and fallback to a standard payment tagged as Monthly.
    console.log("Subscription Edge Function bypassed. Falling back to One-Time Payment tagged as Monthly.");
    initiateStandardPayment(true);
  };`;

if (targetFunctionRegex.test(content)) {
    content = content.replace(targetFunctionRegex, replacementFunction);
    fs.writeFileSync('pages/DonateFlow.tsx', content);
    console.log("Patched createSubscription in DonateFlow.tsx successfully");
} else {
    console.log("Regex didn't match anything!");
}
