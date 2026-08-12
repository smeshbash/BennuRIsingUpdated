const fs = require('fs');
let content = fs.readFileSync('pages/DonateFlow.tsx', 'utf8');

content = content.replace(
  '                {wantsTaxReceipt && (\\n                    <div className="mt-4 pt-4 border-t border-blue-200 text-xs text-blue-600 font-bold flex items-center justify-center">',
  '                {enable80gTaxExemption && wantsTaxReceipt && (\\n                    <div className="mt-4 pt-4 border-t border-blue-200 text-xs text-blue-600 font-bold flex items-center justify-center">'
);

fs.writeFileSync('pages/DonateFlow.tsx', content);
