const fs = require('fs');
let content = fs.readFileSync('pages/AdminPages.tsx', 'utf8');

const target = "CREATE POLICY \"Public insert partners\" ON public.partnership_inquiries FOR INSERT WITH CHECK (true);";
if (content.includes(target)) {
    content = content.replace(target, target + "\nDROP POLICY IF EXISTS \"Public read active partners\" ON public.partnership_inquiries;\nCREATE POLICY \"Public read active partners\" ON public.partnership_inquiries FOR SELECT USING (status = 'active');");
    fs.writeFileSync('pages/AdminPages.tsx', content);
    console.log("Patched DB setup");
} else {
    console.log("Not found");
}
