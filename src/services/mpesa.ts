
import { v4 as uuidv4 } from 'uuid';

// M-Pesa API endpoints
const SAFARICOM_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const SAFARICOM_STK_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

// Get access token from M-Pesa API
export const getMpesaAccessToken = async (consumerKey: string, consumerSecret: string) => {
  try {
    const headers = new Headers();
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    headers.append('Authorization', `Basic ${auth}`);

    const response = await fetch(SAFARICOM_AUTH_URL, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error);
    throw error;
  }
};

// Initiate STK Push transaction
export const initiateSTKPush = async (
  accessToken: string,
  phoneNumber: string,
  amount: number,
  businessShortCode: string,
  passKey: string,
  callbackUrl: string,
  accountReference: string = 'Tuva254 Shop',
  transactionDesc: string = 'Payment for goods'
) => {
  try {
    // Format the phone number (remove leading 0 and add country code if needed)
    // M-Pesa requires the format '2547XXXXXXXX'
    const formattedPhone = phoneNumber.startsWith('0')
      ? `254${phoneNumber.slice(1)}`
      : phoneNumber;
    
    // Current timestamp in the format YYYYMMDDHHmmss
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    
    // Generate password (shortcode + passkey + timestamp)
    const password = btoa(`${businessShortCode}${passKey}${timestamp}`);
    
    const requestBody = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount.toString(),
      PartyA: formattedPhone,
      PartyB: businessShortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc
    };

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);
    headers.append('Content-Type', 'application/json');

    const response = await fetch(SAFARICOM_STK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error('Failed to initiate STK push');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initiating STK push:', error);
    throw error;
  }
};

// This function would be used in a Supabase Edge Function to process the payment
export const processMpesaPayment = async (
  consumerKey: string,
  consumerSecret: string,
  businessShortCode: string,
  passKey: string,
  callbackUrl: string,
  phone: string,
  amount: number
) => {
  try {
    // 1. Get access token
    const accessToken = await getMpesaAccessToken(consumerKey, consumerSecret);
    
    // 2. Generate a unique order reference
    const orderRef = `TUVA-${uuidv4().slice(0, 8).toUpperCase()}`;
    
    // 3. Initiate STK Push
    const stkResponse = await initiateSTKPush(
      accessToken,
      phone,
      amount,
      businessShortCode,
      passKey,
      callbackUrl,
      orderRef
    );
    
    return {
      success: true,
      checkoutRequestID: stkResponse.CheckoutRequestID,
      merchantRequestID: stkResponse.MerchantRequestID,
      orderReference: orderRef
    };
  } catch (error) {
    console.error('Error processing M-Pesa payment:', error);
    throw error;
  }
};
