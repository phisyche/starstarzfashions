
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, X } from 'lucide-react';

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

interface ProductFormProps {
  defaultValues: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitText?: string;
}

export function ProductForm({ 
  defaultValues, 
  onSubmit, 
  isSubmitting, 
  onCancel,
  submitText = "Save Changes" 
}: ProductFormProps) {
  const { toast } = useToast();
  const [imageInputValue, setImageInputValue] = useState('');
  const [colorInputValue, setColorInputValue] = useState('');
  const [sizeInputValue, setSizeInputValue] = useState('');
  const [materialInputValue, setMaterialInputValue] = useState('');
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues.name || '',
      description: defaultValues.description || '',
      price: defaultValues.price || 0,
      category: defaultValues.category || '',
      image: defaultValues.image || '',
      images: defaultValues.images || [],
      stock: defaultValues.stock !== undefined ? defaultValues.stock : 0,
      is_featured: defaultValues.is_featured || false,
      is_new: defaultValues.is_new || false,
      colors: defaultValues.colors || [],
      sizes: defaultValues.sizes || [],
      materials: defaultValues.materials || [],
    },
  });
  
  const categories = [
    "Women's Fashion",
    "Men's Wear",
    "Accessories",
    "Footwear",
    "Jewelry",
    "Children's Clothing",
    "Sportswear"
  ];
  
  const handleImageAdd = () => {
    if (imageInputValue.trim() === '') return;
    
    const currentImages = form.getValues('images') || [];
    form.setValue('images', [...currentImages, imageInputValue]);
    setImageInputValue('');
  };
  
  const handleImageRemove = (index: number) => {
    const currentImages = form.getValues('images') || [];
    form.setValue('images', currentImages.filter((_, i) => i !== index));
  };
  
  const handleColorAdd = () => {
    if (colorInputValue.trim() === '') return;
    
    const currentColors = form.getValues('colors') || [];
    form.setValue('colors', [...currentColors, colorInputValue]);
    setColorInputValue('');
  };
  
  const handleColorRemove = (index: number) => {
    const currentColors = form.getValues('colors') || [];
    form.setValue('colors', currentColors.filter((_, i) => i !== index));
  };
  
  const handleSizeAdd = () => {
    if (sizeInputValue.trim() === '') return;
    
    const currentSizes = form.getValues('sizes') || [];
    form.setValue('sizes', [...currentSizes, sizeInputValue]);
    setSizeInputValue('');
  };
  
  const handleSizeRemove = (index: number) => {
    const currentSizes = form.getValues('sizes') || [];
    form.setValue('sizes', currentSizes.filter((_, i) => i !== index));
  };
  
  const handleMaterialAdd = () => {
    if (materialInputValue.trim() === '') return;
    
    const currentMaterials = form.getValues('materials') || [];
    form.setValue('materials', [...currentMaterials, materialInputValue]);
    setMaterialInputValue('');
  };
  
  const handleMaterialRemove = (index: number) => {
    const currentMaterials = form.getValues('materials') || [];
    form.setValue('materials', currentMaterials.filter((_, i) => i !== index));
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (KSh)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Display as featured product
                      </p>
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">New Arrival</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Mark as new arrival
                      </p>
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
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Additional Images</FormLabel>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Image URL"
                  value={imageInputValue}
                  onChange={(e) => setImageInputValue(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleImageAdd}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-2 mt-2">
                {form.watch('images')?.map((image, index) => (
                  <div key={index} className="flex items-center justify-between bg-accent/50 p-2 rounded-md">
                    <div className="truncate text-sm">{image}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleImageRemove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Product description"
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <FormLabel>Available Colors</FormLabel>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add a color"
                        value={colorInputValue}
                        onChange={(e) => setColorInputValue(e.target.value)}
                      />
                      <Button type="button" variant="outline" onClick={handleColorAdd}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch('colors')?.map((color, index) => (
                        <div key={index} className="flex items-center bg-accent/50 px-3 py-1 rounded-full">
                          <span className="text-sm">{color}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => handleColorRemove(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <FormLabel>Available Sizes</FormLabel>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add a size"
                        value={sizeInputValue}
                        onChange={(e) => setSizeInputValue(e.target.value)}
                      />
                      <Button type="button" variant="outline" onClick={handleSizeAdd}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch('sizes')?.map((size, index) => (
                        <div key={index} className="flex items-center bg-accent/50 px-3 py-1 rounded-full">
                          <span className="text-sm">{size}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => handleSizeRemove(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <FormLabel>Materials</FormLabel>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add a material"
                        value={materialInputValue}
                        onChange={(e) => setMaterialInputValue(e.target.value)}
                      />
                      <Button type="button" variant="outline" onClick={handleMaterialAdd}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch('materials')?.map((material, index) => (
                        <div key={index} className="flex items-center bg-accent/50 px-3 py-1 rounded-full">
                          <span className="text-sm">{material}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => handleMaterialRemove(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
