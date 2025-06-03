
import { supabase } from '@/integrations/supabase/client';
import { CreditCardData } from '@/components/checkout/CreditCardForm';

export interface CardPaymentData {
  amount: number;
  currency?: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  cardData: CreditCardData;
}

export async function initiateCardPayment(paymentData: CardPaymentData) {
  try {
    const { data, error } = await supabase.functions.invoke('process-card-payment', {
      body: {
        amount: Math.round(paymentData.amount * 100), // Convert to cents
        currency: paymentData.currency || 'usd',
        orderId: paymentData.orderId,
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName,
        cardData: {
          number: paymentData.cardData.cardNumber.replace(/\s/g, ''),
          exp_month: parseInt(paymentData.cardData.expiryDate.split('/')[0]),
          exp_year: parseInt('20' + paymentData.cardData.expiryDate.split('/')[1]),
          cvc: paymentData.cardData.cvc,
          name: paymentData.cardData.cardholderName,
          address_line1: paymentData.cardData.billingAddress.street,
          address_city: paymentData.cardData.billingAddress.city,
          address_state: paymentData.cardData.billingAddress.state,
          address_zip: paymentData.cardData.billingAddress.zipCode,
          address_country: paymentData.cardData.billingAddress.country
        }
      },
    });

    if (error) {
      console.error('Card payment error:', error);
      return { success: false, error: error.message || 'Failed to process card payment' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error initiating card payment:', error);
    return { success: false, error: 'Failed to process payment' };
  }
}
