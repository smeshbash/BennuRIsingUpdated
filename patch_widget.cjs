const fs = require('fs');
let content = fs.readFileSync('components/DonationWidget.tsx', 'utf8');

// Add enable80gTaxExemption state
content = content.replace(
  'const [loading, setLoading] = useState(false);',
  'const [loading, setLoading] = useState(false);\n  const [enable80gTaxExemption, setEnable80gTaxExemption] = useState(false);'
);

// Add to settings fetch
content = content.replace(
  "['donation_tiers', 'widget_labels_json']);",
  "['donation_tiers', 'widget_labels_json', 'enable_80g_tax_exemption']);"
);

content = content.replace(
  '                  const labelsJson = systemData.find(d => d.key === \'widget_labels_json\')?.value;',
  '                  const tax = systemData.find(d => d.key === \'enable_80g_tax_exemption\')?.value;\n                  if (tax) setEnable80gTaxExemption(tax === \'true\');\n\n                  const labelsJson = systemData.find(d => d.key === \'widget_labels_json\')?.value;'
);

// Conditionally render taxText
content = content.replace(
  '{labels.taxText}',
  '{enable80gTaxExemption ? labels.taxText : ""}'
);

fs.writeFileSync('components/DonationWidget.tsx', content);
