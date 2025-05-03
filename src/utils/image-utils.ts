
/**
 * Utility functions for handling images throughout the application
 */

/**
 * Creates a proper image path for product images
 * 
 * @param imageUrl Image URL or path
 * @returns Properly formatted image URL
 */
export const getImagePath = (imageUrl: string | undefined): string => {
  // Return a default placeholder if no image URL is provided
  if (!imageUrl) {
    return '/placeholder-product.jpg';
  }
  
  // If it's already a complete URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's already a path with a leading slash, return as is
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // For uploaded images in the product images folder
  if (imageUrl.startsWith('public/lovable-uploads')) {
    return '/' + imageUrl;
  }
  
  // Otherwise, assume it's in the products directory
  return `/products/${imageUrl}`;
};

/**
 * Prepares image URLs for the database
 * 
 * @param imageUrl Image URL or path to prepare
 * @returns Standardized image URL format for database
 */
export const prepareImageForDB = (imageUrl: string): string => {
  // Convert absolute URLs to relative paths if they're local
  if (imageUrl.includes('/products/')) {
    return imageUrl.split('/products/')[1];
  }
  
  return imageUrl;
};

/**
 * Extracts file name from full path
 * 
 * @param path Full file path
 * @returns File name
 */
export const getFileName = (path: string): string => {
  const parts = path.split('/');
  return parts[parts.length - 1];
};

/**
 * Creates image path for an uploaded image
 * 
 * @param filename Uploaded image filename
 * @returns Full path to the image
 */
export const getUploadedImagePath = (filename: string): string => {
  if (!filename) return '/placeholder-product.jpg';
  
  if (filename.startsWith('http')) {
    return filename;
  }
  
  // For images in public folder with appropriate path
  if (filename.startsWith('/')) {
    return filename;
  }
  
  return `/uploads/${filename}`;
};
