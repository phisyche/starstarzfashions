
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(Number(price));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy");
}

export function generateOrderId() {
  return 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
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

export function generateMpesaPassword(shortcode: string, passkey: string, timestamp: string) {
  // For browser environments, we need to use TextEncoder and btoa
  if (typeof window !== 'undefined') {
    const str = shortcode + passkey + timestamp;
    return btoa(str);
  }
  
  // For Deno/Node environments (will be used in Edge Functions)
  return Buffer.from(shortcode + passkey + timestamp).toString('base64');
}

export function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
