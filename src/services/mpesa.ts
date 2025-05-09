
import { MPesaPaymentPayload, MPesaPaymentResponse } from '@/types/models';
import { formatPhoneNumber } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

/**
 * Initiates an M-Pesa payment via Supabase Edge Function
 */
export async function initiateMpesaPayment(
  payload: MPesaPaymentPayload
): Promise<MPesaPaymentResponse> {
  try {
    // Format the phone number to add country code if needed
    const formattedPhone = formatPhoneNumber(payload.phone);
    
    console.log('Initiating M-Pesa payment with payload:', {
      ...payload,
      phone: formattedPhone,
    });

    // Use the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('process-mpesa-payment', {
      body: JSON.stringify({
        ...payload,
        phone: formattedPhone,
      }),
    });

    if (error) {
      console.error('M-Pesa API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process M-Pesa payment'
      };
    }

    console.log('M-Pesa payment response:', data);
    return data as MPesaPaymentResponse;
  } catch (error) {
    console.error('Error initiating M-Pesa payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Checks the status of an M-Pesa transaction
 */
export async function checkMpesaTransactionStatus(
  checkoutRequestId: string
): Promise<{ status: string; paid: boolean }> {
  try {
    const { data, error } = await supabase
      .from('mpesa_transactions')
      .select('status')
      .eq('checkout_request_id', checkoutRequestId)
      .single();

    if (error) {
      console.error('Error checking M-Pesa status:', error);
      return { status: 'unknown', paid: false };
    }

    return { 
      status: data?.status || 'pending',
      paid: data?.status === 'completed'
    };
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return { status: 'error', paid: false };
  }
}
