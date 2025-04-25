
// Follow this setup guide to integrate the Deno runtime into your project:
// https://deno.land/manual/examples/supabase
// 

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface RequestPayload {
  phone: string;
  amount: number;
  orderId: string;
}

const SAFARICOM_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const SAFARICOM_STK_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

// M-Pesa credentials from environment variables
const MPESA_CONSUMER_KEY = Deno.env.get('MPESA_CONSUMER_KEY') || '';
const MPESA_CONSUMER_SECRET = Deno.env.get('MPESA_CONSUMER_SECRET') || '';
const MPESA_BUSINESS_SHORT_CODE = Deno.env.get('MPESA_BUSINESS_SHORT_CODE') || '';
const MPESA_PASSKEY = Deno.env.get('MPESA_PASSKEY') || '';
// Note: In a real scenario, this would be your server's webhook URL
const MPESA_CALLBACK_URL = Deno.env.get('MPESA_CALLBACK_URL') || 'https://example.com/callback';

// Get M-Pesa access token
async function getMpesaAccessToken() {
  try {
    const auth = btoa(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`);
    
    const response = await fetch(SAFARICOM_AUTH_URL, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error);
    throw error;
  }
}

// Initiate STK Push
async function initiateSTKPush(
  accessToken: string,
  phoneNumber: string,
  amount: number,
  orderId: string
) {
  try {
    // Format the phone number (remove leading 0 and add country code if needed)
    // M-Pesa requires the format '2547XXXXXXXX'
    const formattedPhone = phoneNumber.startsWith('0')
      ? `254${phoneNumber.slice(1)}`
      : phoneNumber;
    
    // Current timestamp in the format YYYYMMDDHHmmss
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    
    // Generate password (shortcode + passkey + timestamp)
    const password = btoa(`${MPESA_BUSINESS_SHORT_CODE}${MPESA_PASSKEY}${timestamp}`);
    
    const requestBody = {
      BusinessShortCode: MPESA_BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount.toString(),
      PartyA: formattedPhone,
      PartyB: MPESA_BUSINESS_SHORT_CODE,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: `TUVA-${orderId.slice(0, 8).toUpperCase()}`,
      TransactionDesc: 'Payment for Tuva254 order'
    };

    const response = await fetch(SAFARICOM_STK_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initiating STK push:', error);
    throw error;
  }
}

// Handle payment processing
async function processPayment(payload: RequestPayload) {
  try {
    // 1. Get access token
    const accessToken = await getMpesaAccessToken();
    
    // 2. Initiate STK Push
    const stkResponse = await initiateSTKPush(
      accessToken,
      payload.phone,
      payload.amount,
      payload.orderId
    );
    
    return {
      success: true,
      checkoutRequestID: stkResponse.CheckoutRequestID,
      merchantRequestID: stkResponse.MerchantRequestID,
      responseCode: stkResponse.ResponseCode,
      responseDescription: stkResponse.ResponseDescription,
      orderId: payload.orderId
    };
  } catch (error) {
    console.error('Error processing M-Pesa payment:', error);
    return {
      success: false,
      error: error.message || 'Failed to process payment',
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const payload: RequestPayload = await req.json();
    
    // Validate payload
    if (!payload.phone || !payload.amount || !payload.orderId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid payload. Required fields: phone, amount, orderId',
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const result = await processPayment(payload);
    
    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred',
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
