
import { supabase } from '@/integrations/supabase/client';

export interface StripePaymentData {
  amount: number;
  currency?: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
}

export async function initiateStripePayment(paymentData: StripePaymentData) {
  try {
    const { data, error } = await supabase.functions.invoke('create-stripe-session', {
      body: {
        amount: Math.round(paymentData.amount * 100), // Convert to cents
        currency: paymentData.currency || 'usd',
        orderId: paymentData.orderId,
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName,
      },
    });

    if (error) {
      console.error('Stripe payment error:', error);
      return { success: false, error: error.message || 'Failed to initiate Stripe payment' };
    }

    return { success: true, sessionUrl: data.url };
  } catch (error) {
    console.error('Error initiating Stripe payment:', error);
    return { success: false, error: 'Failed to initiate payment' };
  }
}
