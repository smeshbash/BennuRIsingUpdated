const fs = require('fs');
let content = fs.readFileSync('pages/AdminPages.tsx', 'utf8');

const target = "ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.profiles(id);";
if (content.includes(target)) {
    content = content.replace(target, target + "\nALTER TABLE public.partnership_inquiries ADD COLUMN IF NOT EXISTS logo_url text;");
    fs.writeFileSync('pages/AdminPages.tsx', content);
    console.log("Patched DB setup");
} else {
    console.log("Not found");
}
