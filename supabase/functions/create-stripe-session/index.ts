
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key not configured');
    }

    const { amount, currency = 'usd', orderId, customerEmail, customerName } = await req.json();

    console.log('Creating Stripe session for:', { amount, currency, orderId, customerEmail });

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'line_items[0][price_data][currency]': currency,
        'line_items[0][price_data][product_data][name]': `Order ${orderId}`,
        'line_items[0][price_data][unit_amount]': amount.toString(),
        'line_items[0][quantity]': '1',
        'customer_email': customerEmail,
        'success_url': `${req.headers.get('origin')}/order-confirmation?orderId=${orderId}&payment=stripe`,
        'cancel_url': `${req.headers.get('origin')}/checkout`,
        'metadata[order_id]': orderId,
        'metadata[customer_name]': customerName,
      }),
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error('Stripe error:', session);
      throw new Error(session.error?.message || 'Failed to create Stripe session');
    }

    console.log('Stripe session created successfully:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
