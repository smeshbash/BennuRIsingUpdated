const fs = require('fs');
const file = 'pages/AdminPages.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldInput = `<label className="block text-xs font-bold text-gray-500 uppercase mb-1">Logo URL (Optional)</label>
                          <input type="text" value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-brand-blue" placeholder="https://..." />`;
const newInput = `<label className="block text-xs font-bold text-gray-500 uppercase mb-1">Logo (Optional)</label>
                          <ImageUpload value={form.logo_url || ""} onChange={(url) => setForm({...form, logo_url: url})} />`;

if (content.includes(oldInput)) {
    content = content.replace(oldInput, newInput);
    fs.writeFileSync(file, content);
    console.log("Patched AdminPages.tsx with ImageUpload");
} else {
    console.log("Could not find the target string.");
}
