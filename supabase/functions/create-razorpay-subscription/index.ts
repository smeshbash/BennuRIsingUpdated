import Razorpay from "npm:razorpay@2.9.2";

// Fix: Declare Deno to resolve TypeScript errors in environments without Deno types
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const razorpay = new Razorpay({
  key_id: Deno.env.get('RAZORPAY_KEY_ID') ?? '',
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') ?? '',
});

Deno.serve(async (req: any) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plan_id, total_count, quantity, customer_notify, notes } = await req.json();

    const subscription = await razorpay.subscriptions.create({
      plan_id: plan_id,
      total_count: total_count || 120, // Default 10 years
      quantity: quantity || 1,
      customer_notify: customer_notify || 1,
      notes: notes || {}
    });

    return new Response(JSON.stringify(subscription), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Subscription Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
