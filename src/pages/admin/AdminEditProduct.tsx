
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { generateSlug } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  category: z.string().min(1, { message: "Please select a category" }),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  stock: z.coerce.number().nonnegative({ message: "Stock cannot be negative" }).default(0),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AdminEditProduct() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);
  
  async function fetchProduct(productId: string) {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        throw new Error('Product not found');
      }
      
      console.log("Fetched product:", data);
      setProduct(data);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      setError(error.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }
  
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setSaving(true);
      
      // Generate a slug from the product name
      const slug = generateSlug(data.name);
      
      // Prepare the product data
      const productData = {
        ...data,
        slug,
        images: data.images || [],
        sizes: data.sizes || [],
        colors: data.colors || [],
        materials: data.materials || [],
        updated_at: new Date().toISOString(),
      };
      
      // Update the product in Supabase
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Product updated",
        description: `${data.name} has been updated successfully`,
      });
      
      // Navigate back to the products list
      navigate('/admin/products');
      
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error updating product",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
          
          <Skeleton className="h-[500px] w-full" />
        </div>
      </AdminLayout>
    );
  }
  
  if (error || !product) {
    return (
      <AdminLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Failed to load product. Please try again."}
          </AlertDescription>
        </Alert>
        
        <div className="mt-4">
          <Button onClick={() => navigate('/admin/products')}>
            Return to Products
          </Button>
        </div>
      </AdminLayout>
    );
  }
  
  const defaultValues: Partial<ProductFormValues> = {
    name: product.name,
    description: product.description || '',
    price: product.price || 0,
    category: product.category || '',
    image: product.image || '',
    images: product.images || [],
    stock: product.stock || 0,
    is_featured: product.is_featured || false,
    is_new: product.is_new || false,
    colors: product.colors || [],
    sizes: product.sizes || [],
    materials: product.materials || [],
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <ProductForm 
            defaultValues={defaultValues} 
            onSubmit={onSubmit}
            isSubmitting={saving}
            onCancel={() => navigate('/admin/products')}
            submitText="Update Product"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
