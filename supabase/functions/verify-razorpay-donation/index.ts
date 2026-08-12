import Razorpay from "npm:razorpay@2.9.2";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Fix: Declare Deno to resolve TypeScript errors in environments without Deno types
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: Deno.env.get('RAZORPAY_KEY_ID') ?? '',
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') ?? '',
});

// Use Service Role Key to bypass RLS and write trusted data
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req: any) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { payment_id, amount, donor_data, fund_id, frequency, volunteer_id } = await req.json();

    // --- SECURITY CHECKS ---
    
    // 1. Basic validation
    if (!payment_id) throw new Error("Payment ID is required");
    if (!amount || amount <= 0) throw new Error("Invalid donation amount");

    // 2. Fetch Payment from Razorpay to verify it actually exists and succeeded
    // This is the "Source of Truth" check
    const payment = await razorpay.payments.fetch(payment_id);

    if (!payment) throw new Error("Invalid Payment ID - Not found in Razorpay");
    
    // 3. Validate Amount (Razorpay returns in paise, 1 INR = 100 paise)
    const expectedAmountPaise = Math.round(amount * 100);
    if (Math.abs(payment.amount - expectedAmountPaise) > 100) {
        throw new Error("Amount mismatch - Possible tampering detected");
    }
    
    // 4. Verify Status
    if (payment.status !== 'captured' && payment.status !== 'authorized') {
        throw new Error(`Payment status is ${payment.status}. Only captured payments are verified.`);
    }

    // --- DATABASE INSERT ---

    // Insert into Database as Verified (is_verified: true)
    // Since we are using the Service Role Key, this bypasses RLS
    const { data, error } = await supabase.from('donations').insert({
      donor_name: donor_data.name,
      donor_email: donor_data.email,
      amount: amount,
      fund_id: fund_id,
      status: 'success',
      payment_id: payment_id,
      frequency: frequency,
      is_verified: true, // Trusted server-side source
      pan_number: donor_data.pan,
      volunteer_id: volunteer_id || null
    });

    if (error) {
        console.error("Database Insert Error:", error);
        throw new Error("Failed to record verified donation in database");
    }

    return new Response(JSON.stringify({ success: true, verified: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Verification Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
