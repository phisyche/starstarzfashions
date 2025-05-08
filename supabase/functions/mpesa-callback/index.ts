
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://pifzapdqhaxgskypadws.supabase.co';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZnphcGRxaGF4Z3NreXBhZHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3OTQ2NjIsImV4cCI6MjA2MTM3MDY2Mn0.CPcFj62zuDGbTJNjsGgA7NK2YAACDDlieKCL_QFDg8M';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const callbackData = await req.json();
    console.log('Received M-Pesa callback:', callbackData);

    // Extract the necessary data from the callback
    const { Body } = callbackData;
    
    if (!Body || !Body.stkCallback) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid callback data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Find the transaction in our database
    const { data: transaction, error: findError } = await supabase
      .from('mpesa_transactions')
      .select('*')
      .eq('checkout_request_id', CheckoutRequestID)
      .single();
      
    if (findError) {
      console.error('Error finding transaction:', findError);
      return new Response(
        JSON.stringify({ success: false, error: 'Transaction not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Update the transaction status based on the result code
    const status = ResultCode === 0 ? 'completed' : 'failed';
    
    // Extract additional metadata if transaction was successful
    let mpesaReceiptNumber = null;
    let transactionDate = null;
    
    if (ResultCode === 0 && CallbackMetadata && CallbackMetadata.Item) {
      // Find the receipt number and transaction date in the metadata items
      const receiptItem = CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber');
      const dateItem = CallbackMetadata.Item.find(item => item.Name === 'TransactionDate');
      
      if (receiptItem) mpesaReceiptNumber = receiptItem.Value;
      if (dateItem) transactionDate = dateItem.Value;
    }
    
    // Update the transaction record
    await supabase
      .from('mpesa_transactions')
      .update({
        status,
        result_code: ResultCode,
        result_description: ResultDesc,
        mpesa_receipt_number: mpesaReceiptNumber,
        transaction_date: transactionDate,
        updated_at: new Date().toISOString(),
        callback_data: callbackData
      })
      .eq('id', transaction.id);
      
    // If payment was successful, update the order status
    if (ResultCode === 0 && transaction.order_id) {
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          mpesa_reference: mpesaReceiptNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.order_id);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
