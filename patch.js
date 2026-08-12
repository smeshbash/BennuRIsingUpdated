const fs = require('fs');
let content = fs.readFileSync('pages/AdminPages.tsx', 'utf8');
content = content.replace(
  '"visitor_tracker_enabled",\n  ];',
  '"visitor_tracker_enabled",\n    "enable_80g_tax_exemption",\n  ];'
);
content = content.replace(
  'visitor_tracker_enabled: "e.g., true",\n  };',
  'visitor_tracker_enabled: "e.g., true",\n    enable_80g_tax_exemption: "e.g., true",\n  };'
);
fs.writeFileSync('pages/AdminPages.tsx', content);
