
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/context/SupabaseContext';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Loader2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Product } from '@/types/models';

const formSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Product description is required'),
  price: z.coerce.number().positive('Price must be positive'),
  original_price: z.coerce.number().positive('Original price must be positive').optional().nullable(),
  category: z.string().min(1, 'Category is required'),
  stock_quantity: z.coerce.number().int().nonnegative('Stock quantity must be 0 or greater'),
  slug: z.string().min(1, 'Slug is required'),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      original_price: null,
      category: '',
      stock_quantity: 0,
      slug: '',
      is_featured: false,
      is_new: false,
    },
  });
  
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
        
        // Set form values
        form.reset({
          name: data.name,
          description: data.description,
          price: data.price,
          original_price: data.original_price || null,
          category: data.category,
          stock_quantity: data.stock_quantity,
          slug: data.slug,
          is_featured: data.is_featured || false,
          is_new: data.is_new || false,
        });
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
  }, [id, supabase, toast, navigate, form]);
  
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
      // If using the original image, don't clear
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
    const name = form.getValues('name');
    if (!name) return;
    
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    form.setValue('slug', slug);
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare update data
      const updateData: Partial<Product> = { ...data };
      
      // If there's a new image, upload it
      if (imageFile) {
        setIsUploading(true);
        const fileName = `${uuidv4()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('product-images')
          .upload(fileName, imageFile);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase
          .storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        updateData.image = publicUrlData.publicUrl;
        
        // Update images array if it exists
        if (product?.images && Array.isArray(product.images)) {
          updateData.images = [publicUrlData.publicUrl, ...product.images.slice(0, 4)];
        } else {
          updateData.images = [publicUrlData.publicUrl];
        }
      }
      
      // Update product data
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
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update product details in your inventory</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main product details */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="African Print Blazer" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>URL Slug</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="african-print-blazer" />
                            </FormControl>
                            <FormDescription>
                              The URL-friendly name for this product
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="mt-8" 
                        onClick={generateSlug}
                      >
                        Generate
                      </Button>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Describe your product in detail..."
                              rows={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (KES)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number"
                                min="0"
                                step="100" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="original_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Original Price (KES) (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                min="0"
                                step="100"
                                value={field.value || ''} 
                                onChange={(e) => {
                                  const value = e.target.value === '' ? null : Number(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Set if the product is on sale
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Men's Outerwear" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="stock_quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="0" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Featured Product</FormLabel>
                              <FormDescription>
                                Show this product on the homepage
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="is_new"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>New Arrival</FormLabel>
                              <FormDescription>
                                Mark as a new arrival product
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Image Upload */}
              <div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Product Image</FormLabel>
                        <FormDescription>
                          Update the product image
                        </FormDescription>
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
                              onClick={clearImage}
                              type="button"
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        ) : (
                          <label htmlFor="product-image" className="flex flex-col items-center justify-center h-48 cursor-pointer border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors">
                            <Image className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm font-medium">Click to upload</span>
                            <span className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</span>
                            <input 
                              id="product-image" 
                              type="file" 
                              accept="image/*" 
                              className="sr-only"
                              onChange={onImageChange}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/products')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploading ? 'Uploading...' : 'Saving...'}
                  </>
                ) : 'Update Product'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
