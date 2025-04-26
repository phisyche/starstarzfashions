
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  image: string;
  images?: string[];
  category: string;
  slug: string;
  is_featured?: boolean;
  is_new?: boolean;
  stock_quantity: number;
  collection_id?: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
  created_at?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  created_at?: string;
}

export interface Order {
  id: string;
  user_id?: string | null;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total_amount: number;
  shipping_address: {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    county: string;
    phone: string;
  };
  payment_method: 'mpesa' | 'card';
  payment_status: 'pending' | 'paid' | 'failed';
  mpesa_reference?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
}

// Add needed types for MPesa payment processing
export interface MPesaPaymentPayload {
  phone: string;
  amount: number;
  orderId: string;
}

export interface MPesaPaymentResponse {
  success: boolean;
  checkoutRequestID?: string;
  merchantRequestID?: string;
  responseCode?: string;
  responseDescription?: string;
  error?: string;
  orderId?: string;
}
