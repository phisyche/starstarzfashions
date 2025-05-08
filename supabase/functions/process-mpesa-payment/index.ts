
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MPESA_CONSUMER_KEY = Deno.env.get('MPESA_CONSUMER_KEY') || 'Ex1GGMwlnNsqUxH6P7WjmGp0TCTl0Gktr0JoZBvS3UVuS4Rq';
const MPESA_CONSUMER_SECRET = Deno.env.get('MPESA_CONSUMER_SECRET') || 'XCYRuoHDEWBjfrmdafyOGGQsp2qla2vhyn3BwdqNik6nnobvtf9BTGaFAVbRpq0a';
const MPESA_PASSKEY = Deno.env.get('MPESA_PASSKEY') || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const MPESA_SHORTCODE = '174379'; // Sandbox test shortcode
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://pifzapdqhaxgskypadws.supabase.co';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZnphcGRxaGF4Z3NreXBhZHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3OTQ2NjIsImV4cCI6MjA2MTM3MDY2Mn0.CPcFj62zuDGbTJNjsGgA7NK2YAACDDlieKCL_QFDg8M';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { phone, amount, orderId } = requestData;
    
    console.log('Received M-Pesa payment request:', { phone, amount, orderId });

    if (!phone || !amount) {
      return new Response(
        JSON.stringify({ success: false, error: 'Phone number and amount are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get OAuth Token
    const tokenResponse = await getMpesaToken();
    if (!tokenResponse.success) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to obtain M-Pesa token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate M-Pesa request
    const timestamp = generateTimestamp();
    const password = generateMpesaPassword(MPESA_SHORTCODE, MPESA_PASSKEY, timestamp);
    
    const callbackURL = `${SUPABASE_URL}/functions/v1/mpesa-callback`;
    
    const mpesaResponse = await initiateSTKPush({
      token: tokenResponse.token,
      phone,
      amount: Math.round(amount),  // M-Pesa only accepts whole amounts
      shortcode: MPESA_SHORTCODE,
      password,
      timestamp,
      callbackURL,
      accountReference: orderId || "StarStarz",
      transactionDesc: "Payment for order"
    });

    // Store the request in the database
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    if (mpesaResponse.success) {
      await supabase.from('mpesa_transactions').insert({
        checkout_request_id: mpesaResponse.checkoutRequestID,
        merchant_request_id: mpesaResponse.merchantRequestID,
        order_id: orderId,
        phone_number: phone,
        amount: amount,
        status: 'pending',
      });
    }

    return new Response(
      JSON.stringify(mpesaResponse),
      { status: mpesaResponse.success ? 200 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing M-Pesa payment:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper functions
async function getMpesaToken() {
  try {
    // Base64 encode the consumer key and secret
    const auth = btoa(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`);
    
    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    const data = await response.json();
    
    if (data.access_token) {
      return { success: true, token: data.access_token };
    } else {
      console.error('Failed to obtain M-Pesa token:', data);
      return { success: false, error: data.errorMessage || 'Unknown error' };
    }
  } catch (error) {
    console.error('Error getting M-Pesa token:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

async function initiateSTKPush({
  token, phone, amount, shortcode, password, timestamp, callbackURL, accountReference, transactionDesc
}) {
  try {
    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: callbackURL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
      }),
    });

    const data = await response.json();
    console.log('M-Pesa STK push response:', data);
    
    if (data.ResponseCode === "0") {
      return {
        success: true,
        merchantRequestID: data.MerchantRequestID,
        checkoutRequestID: data.CheckoutRequestID,
        responseDescription: data.ResponseDescription,
        customerMessage: data.CustomerMessage
      };
    } else {
      return {
        success: false,
        error: data.errorMessage || 'STK push failed'
      };
    }
  } catch (error) {
    console.error('Error initiating STK push:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function generateMpesaPassword(shortcode: string, passkey: string, timestamp: string) {
  // Concatenate the shortcode + passkey + timestamp
  const str = shortcode + passkey + timestamp;
  // Return as base64
  return btoa(str);
}
