
import { supabase } from '@/integrations/supabase/client';
import { getFileName } from './image-utils';

/**
 * Uploads an image to the public/lovable-uploads folder
 * 
 * @param file File object to upload
 * @returns URL to the uploaded image
 */
export const uploadImage = async (file: File): Promise<string> => {
  if (!file) return '';
  
  try {
    // Get current timestamp as part of the file name to avoid conflicts
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
    
    // Determine path based on file type
    let folderPath = '';
    if (file.type.startsWith('image/')) {
      folderPath = 'product-images';
    } else {
      folderPath = 'documents';
    }
    
    // Create full path
    const filePath = `${folderPath}/${fileName}`;

    // Upload to lovable-uploads storage
    const { error, data } = await supabase.storage
      .from('lovable-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('lovable-uploads')
      .getPublicUrl(filePath);

    if (publicUrlData && publicUrlData.publicUrl) {
      return publicUrlData.publicUrl;
    }

    // Fallback to the old path format for compatibility
    return `/public/lovable-uploads/${fileName}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    return '';
  }
};

/**
 * Organizes images into category folders for better management
 * 
 * @param images Array of image URLs
 * @param categoryFolder Folder name to organize images into
 * @returns Promise with array of organized image paths
 */
export const organizeImages = async (
  images: string[], 
  categoryFolder: string = 'products'
): Promise<string[]> => {
  if (!images || images.length === 0) return [];
  
  try {
    return images.map(image => {
      // Skip already organized images
      if (image.includes(`/${categoryFolder}/`)) {
        return image;
      }
      
      // Skip URLs that are already full URLs
      if (image.startsWith('http')) {
        return image;
      }
      
      // Get file name and return the new path
      const fileName = getFileName(image);
      return `/${categoryFolder}/${fileName}`;
    });
  } catch (error) {
    console.error('Error organizing images:', error);
    return images;
  }
};
