
/**
 * Extracts the filename from a path or URL
 * 
 * @param path Path or URL to extract filename from
 * @returns Filename with extension
 */
export const getFileName = (path: string): string => {
  if (!path) return '';
  
  // Extract filename from path - handles both URLs and file paths
  const parts = path.split('/');
  return parts[parts.length - 1];
};

/**
 * Gets the correct image path for Supabase Storage or public folder
 * 
 * @param path Image path or URL
 * @returns Processed image path
 */
export const getImagePath = (path: string): string => {
  if (!path) return '/placeholder-product.jpg';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http')) {
    return path;
  }

  // If it starts with 'public/', remove that part
  if (path.startsWith('public/')) {
    return `/${path.substring(7)}`;
  }
  
  // Handle paths with or without leading slash
  return path.startsWith('/') ? path : `/${path}`;
};

/**
 * Processes multiple image paths to ensure they are all valid
 * 
 * @param images Array of image paths or URLs
 * @returns Array of processed image paths
 */
export const processProductImages = (images: string[]): string[] => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return ['/placeholder-product.jpg'];
  }
  
  return images.map(image => getImagePath(image));
};
