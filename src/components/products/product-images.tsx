import React from 'react';

// Define the shape of a product image
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

// Create a mapping between image ids and their URLs
export const createProductImagePath = (filename: string): string => {
  // Check if it's a full URL
  if (filename.startsWith('http')) {
    return filename;
  }
  
  // Check if it's already a path
  if (filename.startsWith('/')) {
    return filename;
  }
  
  // Otherwise, assume it's in the products directory
  return `/public/products/${filename}`;
};

// Function to organize uploaded product images
export const organizeProductImages = (
  productImages: ProductImage[], 
  defaultImage: string = '/placeholder-product.jpg'
): ProductImage[] => {
  if (!productImages || productImages.length === 0) {
    return [{ id: 'default', url: defaultImage, alt: 'Product image' }];
  }
  
  // Sort images by primary status and then by sort order
  return [...productImages].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });
};

// Product image gallery component
interface ProductGalleryProps {
  images: ProductImage[];
  className?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ 
  images,
  className = ""
}) => {
  const [mainImage, ...thumbnails] = organizeProductImages(images);
  const [selectedImage, setSelectedImage] = React.useState(mainImage);
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <img 
          src={selectedImage.url} 
          alt={selectedImage.alt} 
          className="h-full w-full object-cover object-center" 
        />
      </div>
      {thumbnails.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {[mainImage, ...thumbnails].map((image) => (
            <button
              key={image.id}
              className={`aspect-square overflow-hidden rounded border ${
                selectedImage.id === image.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image.url} 
                alt={image.alt} 
                className="h-full w-full object-cover object-center" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
