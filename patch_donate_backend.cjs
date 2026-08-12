const fs = require('fs');
let content = fs.readFileSync('pages/DonateFlow.tsx', 'utf8');

const targetFunction = `  const initiateStandardPayment = (isFallbackMonthly: boolean = false) => {
    const description = \`\${isFallbackMonthly || initialFreq === 'monthly' ? 'Monthly Subscription (First Installment)' : 'Donation'} for Core Impact Pillars\`;
    const options = {
        key: razorpayKey, 
        amount: Number(amount) * 100, // Amount in paise
        currency: "INR",
        name: "Bennu Rising Intl. Foundation",
        description: description,
        image: "/logo1.png", 
        notes: {
            frequency: initialFreq,
            fund_id: selectedFund,
            donor_email: formData.email,
            is_subscription_intent: isFallbackMonthly ? 'true' : 'false'
        },
        handler: function (response: any) {
            recordDonation(response.razorpay_payment_id);
        },
        prefill: {
            name: \`\${formData.firstName} \${formData.lastName}\`,
            email: formData.email,
            contact: formData.phone
        },
        theme: {
            color: "#003F7F"
        },
        modal: {
            ondismiss: function() {
                setLoading(false);
            }
        }
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
        alert("Payment Failed: " + response.error.description);
        setLoading(false);
    });
    rzp.open();
  };`;

const replacementFunction = `  const initiateStandardPayment = async (isFallbackMonthly: boolean = false) => {
    try {
        const description = \`\${isFallbackMonthly || initialFreq === 'monthly' ? 'Monthly Subscription (First Installment)' : 'Donation'} for Core Impact Pillars\`;
        
        // 1. Create order on backend
        const orderRes = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                amount: Number(amount) * 100, 
                currency: "INR", 
                receipt: "receipt_" + Math.random().toString(36).substring(7) 
            })
        });
        
        if (!orderRes.ok) {
             throw new Error("Failed to create order");
        }
        
        const orderData = await orderRes.json();

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || razorpayKey, 
            amount: orderData.amount, // Amount from backend
            currency: orderData.currency,
            name: "Bennu Rising Intl. Foundation",
            description: description,
            image: "/logo1.png",
            order_id: orderData.order_id, // Order ID from backend
            notes: {
                frequency: initialFreq,
                fund_id: selectedFund,
                donor_email: formData.email,
                is_subscription_intent: isFallbackMonthly ? 'true' : 'false'
            },
            handler: async function (response: any) {
                try {
                    // 3. Verify signature on backend
                    const verifyRes = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });
                    
                    if (verifyRes.ok) {
                        recordDonation(response.razorpay_payment_id);
                    } else {
                        alert("Payment verification failed");
                        setLoading(false);
                    }
                } catch (e) {
                    alert("Payment verification error");
                    setLoading(false);
                }
            },
            prefill: {
                name: \`\${formData.firstName} \${formData.lastName}\`,
                email: formData.email,
                contact: formData.phone
            },
            theme: {
                color: "#003F7F"
            },
            modal: {
                ondismiss: function() {
                    setLoading(false);
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
            alert("Payment Failed: " + response.error.description);
            setLoading(false);
        });
        rzp.open();
    } catch (err) {
        console.error(err);
        alert("Failed to initialize payment");
        setLoading(false);
    }
  };`;

if (content.includes("const initiateStandardPayment = (isFallbackMonthly: boolean = false) => {")) {
    content = content.replace(targetFunction, replacementFunction);
    fs.writeFileSync('pages/DonateFlow.tsx', content);
    console.log("Patched DonateFlow.tsx successfully");
} else {
    console.log("Could not find the target code in DonateFlow.tsx");
}
