
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT" | "KES";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "KES", notation = "standard" } = options;

  const formatCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
  });

  return formatCurrency.format(price);
}

// Add the debounce utility function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Add utility to generate keywords from text
export function generateKeywords(text: string): string[] {
  if (!text) return [];
  
  // Convert to lowercase and remove special characters
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Split into words and filter out short words (< 3 characters) and common stopwords
  const stopwords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'are', 'was', 'not', 'you', 'can', 'has', 'will', 'its']);
  
  const words = normalizedText.split(/\s+/).filter(word => 
    word.length > 2 && !stopwords.has(word)
  );
  
  // Return unique words
  return Array.from(new Set(words));
}

// Add a utility for optimized fuzzy search
export function fuzzySearch(text: string, query: string): { matched: boolean; score: number } {
  if (!text || !query) return { matched: false, score: 0 };
  
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Direct match has highest score
  if (textLower === queryLower) {
    return { matched: true, score: 1.0 };
  }
  
  // Substring match has high score
  if (textLower.includes(queryLower)) {
    const index = textLower.indexOf(queryLower);
    // Higher score for matches at beginning of text
    const positionScore = 1 - (index / textLower.length);
    return { matched: true, score: 0.8 * positionScore };
  }
  
  // Check for word-by-word matches
  const words = textLower.split(/\s+/);
  for (const word of words) {
    if (word === queryLower) {
      return { matched: true, score: 0.7 };
    }
    if (word.startsWith(queryLower)) {
      return { matched: true, score: 0.6 };
    }
    if (word.includes(queryLower)) {
      return { matched: true, score: 0.5 };
    }
  }
  
  // Fuzzy matching as fallback
  let lastFoundIndex = -1;
  let matchedChars = 0;
  
  // Check if all characters in query appear in the same order in text
  for (const char of queryLower) {
    const index = textLower.indexOf(char, lastFoundIndex + 1);
    if (index === -1) {
      return { matched: false, score: 0 };
    }
    lastFoundIndex = index;
    matchedChars++;
  }
  
  // Calculate score based on proportion of matched characters and their proximity
  const completeness = matchedChars / queryLower.length;
  const proximityScore = 1 - (lastFoundIndex / textLower.length);
  
  return { matched: true, score: 0.3 * completeness * proximityScore };
}
