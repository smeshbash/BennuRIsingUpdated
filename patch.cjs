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

// Add the UI block for 80G Tax Exemption
const uiBlock = `
        {/* Tax & Legal Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 mt-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <LucideIcons.ShieldCheck className="w-4 h-4 mr-2 text-brand-green" /> Tax & Legal Settings
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                80G Tax Exemption
              </label>
              <p className="text-[10px] text-gray-400 mb-1">
                Enable or disable the 80G Tax Exemption features across the website.
              </p>
              <select
                value={config["enable_80g_tax_exemption"] || "false"}
                onChange={(e) =>
                  setConfig({ ...config, enable_80g_tax_exemption: e.target.value })
                }
                className="w-full border p-2.5 rounded-lg bg-white"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>
        </div>
`;

content = content.replace(
  '{/* Visitor Counter Analytics Settings */}',
  uiBlock + '\n        {/* Visitor Counter Analytics Settings */}'
);

fs.writeFileSync('pages/AdminPages.tsx', content);
