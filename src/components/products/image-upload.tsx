
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export function ImageUpload({ onImageUploaded, currentImage, label = "Product Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImage || null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setImagePreview(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded and is ready to use",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    onImageUploaded('');
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">{label}</Label>
      
      {imagePreview ? (
        <div className="relative">
          <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No image selected</p>
          </div>
        </div>
      )}

      <div>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
        <Button 
          type="button"
          variant="outline" 
          asChild 
          disabled={uploading}
          className="w-full"
        >
          <Label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Label>
        </Button>
      </div>
    </div>
  );
}
