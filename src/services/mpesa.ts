
import { MPesaPaymentPayload, MPesaPaymentResponse } from '@/types/models';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/**
 * Initiates an M-Pesa payment via Supabase Edge Function
 */
export async function initiateMpesaPayment(
  payload: MPesaPaymentPayload
): Promise<MPesaPaymentResponse> {
  try {
    // Format the phone number to add country code if needed
    const formattedPhone = formatPhoneNumber(payload.phone);
    
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/process-mpesa-payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          phone: formattedPhone,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('M-Pesa API error:', errorData);
      throw new Error(errorData.error || 'Failed to process M-Pesa payment');
    }

    const data: MPesaPaymentResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error initiating M-Pesa payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Formats a phone number to ensure it's in the format expected by M-Pesa
 * Converts formats like 07XXXXXXXX or 7XXXXXXXX to 2547XXXXXXXX
 */
function formatPhoneNumber(phone: string): string {
  // Remove any spaces or non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Check if it starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  
  // If it doesn't have country code (not starting with 254), add it
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
}
