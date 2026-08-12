const fs = require('fs');
let content = fs.readFileSync('pages/DonateFlow.tsx', 'utf8');

const targetFunctionRegex = /const recordDonation = async \(paymentId: string\) => \{[\s\S]*?window\.scrollTo\(0, 0\);\n  \};/;

const replacementFunction = `const recordDonation = async (paymentId: string) => {
      setTransactionId(paymentId);
      setLoading(true);

      if (isSupabaseConfigured()) {
          try {
              setVerified(true);
              const { error: insertError } = await supabase.from('donations').insert({
                  donor_name: \`\${formData.title} \${formData.firstName} \${formData.lastName}\`,
                  donor_email: formData.email,
                  amount: Number(amount),
                  fund_id: selectedFund,
                  status: 'success',
                  payment_id: paymentId,
                  frequency: initialFreq, 
                  pan_number: wantsTaxReceipt ? formData.pan : null,
                  is_verified: true, // We verified via /api/verify-payment before calling this
                  volunteer_id: volunteerId ? parseInt(volunteerId, 10) : null
              });

              if (insertError) {
                  console.error("Insert Error:", insertError);
              }
          } catch (error) {
              console.error("Failed to record donation:", error);
          }
      } else {
        // Simulation mode
        setVerified(true);
      }
      
      setLoading(false);
      setStep(3);
      window.scrollTo(0, 0);
  };`;

if (targetFunctionRegex.test(content)) {
    content = content.replace(targetFunctionRegex, replacementFunction);
    fs.writeFileSync('pages/DonateFlow.tsx', content);
    console.log("Patched recordDonation in DonateFlow.tsx successfully");
} else {
    console.log("Regex didn't match anything!");
}
