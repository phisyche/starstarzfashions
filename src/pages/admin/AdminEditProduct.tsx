
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/context/SupabaseContext';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Product } from '@/types/models';
import type { ProductFormValues } from '@/lib/schemas/product-schema';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { ProductImageUpload } from '@/components/admin/products/ProductImageUpload';

export default function AdminEditProduct() {
  const { id } = useParams<{ id: string }>();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setProduct(data);
        setImagePreview(data.image);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error loading product",
          description: "Could not load product details",
          variant: "destructive",
        });
        navigate('/admin/products');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProduct();
  }, [id, supabase, toast, navigate]);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const clearImage = () => {
    if (product && product.image === imagePreview) {
      toast({
        title: "Cannot clear original image",
        description: "Please upload a new image instead",
      });
      return;
    }
    
    setImageFile(null);
    setImagePreview(product?.image || null);
    const input = document.getElementById('product-image') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };
  
  const generateSlug = () => {
    if (!product?.name) return;
    
    const slug = product.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    setProduct(prev => prev ? { ...prev, slug } : null);
  };

  const handleSubmit = async (data: ProductFormValues) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      
      const updateData: Partial<Product> = { ...data };
      
      if (imageFile) {
        setIsUploading(true);
        const fileName = `${uuidv4()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('product-images')
          .upload(fileName, imageFile);
        
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase
          .storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        updateData.image = publicUrlData.publicUrl;
        
        if (product?.images && Array.isArray(product.images)) {
          updateData.images = [publicUrlData.publicUrl, ...product.images.slice(0, 4)];
        } else {
          updateData.images = [publicUrlData.publicUrl];
        }
      }
      
      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
      });
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error updating product",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h3 className="mt-2">Loading product...</h3>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return null;
  }

  const defaultValues: ProductFormValues = {
    name: product.name,
    description: product.description,
    price: product.price,
    original_price: product.original_price || null,
    category: product.category,
    stock_quantity: product.stock_quantity,
    slug: product.slug,
    is_featured: product.is_featured || false,
    is_new: product.is_new || false,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update product details in your inventory</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <ProductForm 
                  defaultValues={defaultValues}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  onCancel={() => navigate('/admin/products')}
                  onGenerateSlug={generateSlug}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <ProductImageUpload 
                  imagePreview={imagePreview}
                  isUploading={isUploading}
                  onImageChange={onImageChange}
                  onClearImage={clearImage}
                  originalImage={product.image}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
