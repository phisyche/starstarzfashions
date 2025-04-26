
import React from 'react';
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Image, X, Loader2, Plus } from "lucide-react";

interface ProductImageUploadProps {
  imagePreview: string | null;
  isUploading: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  originalImage?: string | null;
}

export function ProductImageUpload({
  imagePreview,
  isUploading,
  onImageChange,
  onClearImage,
  originalImage
}: ProductImageUploadProps) {
  return (
    <div className="space-y-4">
      <div>
        <FormLabel>Product Image</FormLabel>
        <p className="text-sm text-muted-foreground">
          Update the product image
        </p>
      </div>
      
      <div className="border rounded-md p-4">
        {imagePreview ? (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Product preview" 
              className="w-full h-48 object-cover rounded-md"
            />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-6 w-6"
              onClick={onClearImage}
              type="button"
              disabled={originalImage === imagePreview}
            >
              <X size={12} />
            </Button>
          </div>
        ) : (
          <label 
            htmlFor="product-image" 
            className="flex flex-col items-center justify-center h-48 cursor-pointer border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors"
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-2" />
            ) : (
              <Image className="h-8 w-8 text-muted-foreground mb-2" />
            )}
            <span className="text-sm font-medium">Click to upload</span>
            <span className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</span>
            <input 
              id="product-image" 
              type="file" 
              accept="image/*" 
              className="sr-only"
              onChange={onImageChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
