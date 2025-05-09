
import { useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { generateSlug } from '@/lib/utils';

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

export default function AdminAddProduct() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const defaultValues: Partial<ProductFormValues> = {
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    images: [],
    stock: 0,
    is_featured: false,
    is_new: true,
    colors: [],
    sizes: [],
    materials: [],
  };
  
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      
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
        created_at: new Date().toISOString(),
      };
      
      console.log('Submitting product data:', productData);
      
      // Insert the product into Supabase
      const { data: product, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Product created",
        description: `${data.name} has been added successfully`,
      });
      
      // Navigate back to the products list
      navigate('/admin/products');
      
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: "Error creating product",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">Create a new product in your inventory</p>
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
            isSubmitting={loading}
            onCancel={() => navigate('/admin/products')}
            submitText="Create Product"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
