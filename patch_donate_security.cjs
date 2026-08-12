const fs = require('fs');
const file = 'pages/DonateFlow.tsx';
let content = fs.readFileSync(file, 'utf8');

const fallbackBlock = `                      console.warn("Verification Failed or Edge Function missing. Fallback to client insert (Unverified).", error);
                      setVerified(false);
                      // FALLBACK: Client-side insert
                      await supabase.from('donations').insert({
                          donor_name: \`\${formData.title} \${formData.firstName} \${formData.lastName}\`,
                          donor_email: formData.email,
                          amount: Number(amount),
                          fund_id: selectedFund,
                          status: 'success',
                          payment_id: paymentId,
                          frequency: initialFreq, 
                          pan_number: wantsTaxReceipt ? formData.pan : null,
                          is_verified: false,
                          volunteer_id: volunteerId ? parseInt(volunteerId, 10) : null
                      });`;

const secureBlock = `                      console.error("Verification Failed:", error);
                      setVerified(false);
                      alert("We received your payment (" + paymentId + "), but verification is delayed. Please keep your payment ID for reference.");`;

content = content.replace(fallbackBlock, secureBlock);
fs.writeFileSync(file, content);

const schemaFile = 'supabase_schema.sql';
if (fs.existsSync(schemaFile)) {
    let schema = fs.readFileSync(schemaFile, 'utf8');
    schema = schema.replace(
        `DROP POLICY IF EXISTS "Public insert donations" ON public.donations;\nCREATE POLICY "Public insert donations" ON public.donations FOR INSERT WITH CHECK (true);`,
        `DROP POLICY IF EXISTS "Public insert donations" ON public.donations;\n-- Security Fix: Removed public insert policy for donations. Donations MUST go through the secure Edge Function.`
    );
    fs.writeFileSync(schemaFile, schema);
}
