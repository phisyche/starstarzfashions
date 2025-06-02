
import { useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/products/image-upload';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/context/SupabaseContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const POPULAR_COLORS = [
  'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Gray', 'Navy'
];

const POPULAR_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12', '36', '38', '40', '42', '44', '46'
];

const POPULAR_MATERIALS = [
  'Cotton', 'Polyester', 'Silk', 'Wool', 'Linen', 'Denim', 'Leather', 'Chiffon', 'Satin', 'Velvet', 'Lycra', 'Spandex'
];

export default function AdminAddProduct() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    is_featured: false,
    is_new: false,
    is_sale: false,
    discount_percent: '',
  });

  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [customMaterial, setCustomMaterial] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const addItem = (item: string, list: string[], setList: (list: string[]) => void, setCustom: (value: string) => void) => {
    if (item && !list.includes(item)) {
      setList([...list, item]);
      setCustom('');
    }
  };

  const removeItem = (item: string, list: string[], setList: (list: string[]) => void) => {
    setList(list.filter(i => i !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        stock: parseInt(formData.stock) || 0,
        colors: colors,
        sizes: sizes,
        materials: materials,
        is_featured: formData.is_featured,
        is_new: formData.is_new,
        is_sale: formData.is_sale,
        discount_percent: formData.discount_percent ? parseInt(formData.discount_percent) : 0,
      };

      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) throw error;

      toast({
        title: "Product added successfully",
        description: "The product has been added to your store",
      });

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: "Error adding product",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Add a new product to your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="auto-generated-from-name"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (KES) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., dresses, shoes, accessories"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  currentImage={formData.image}
                />
              </CardContent>
            </Card>
          </div>

          {/* Colors Section */}
          <Card>
            <CardHeader>
              <CardTitle>Available Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {POPULAR_COLORS.map(color => (
                  <Button
                    key={color}
                    type="button"
                    variant={colors.includes(color) ? "default" : "outline"}
                    size="sm"
                    onClick={() => addItem(color, colors, setColors, setCustomColor)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(customColor, colors, setColors, setCustomColor))}
                />
                <Button
                  type="button"
                  onClick={() => addItem(customColor, colors, setColors, setCustomColor)}
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <Badge key={color} variant="secondary">
                    {color}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeItem(color, colors, setColors)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sizes Section */}
          <Card>
            <CardHeader>
              <CardTitle>Available Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {POPULAR_SIZES.map(size => (
                  <Button
                    key={size}
                    type="button"
                    variant={sizes.includes(size) ? "default" : "outline"}
                    size="sm"
                    onClick={() => addItem(size, sizes, setSizes, setCustomSize)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom size"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(customSize, sizes, setSizes, setCustomSize))}
                />
                <Button
                  type="button"
                  onClick={() => addItem(customSize, sizes, setSizes, setCustomSize)}
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <Badge key={size} variant="secondary">
                    {size}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeItem(size, sizes, setSizes)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Materials Section */}
          <Card>
            <CardHeader>
              <CardTitle>Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {POPULAR_MATERIALS.map(material => (
                  <Button
                    key={material}
                    type="button"
                    variant={materials.includes(material) ? "default" : "outline"}
                    size="sm"
                    onClick={() => addItem(material, materials, setMaterials, setCustomMaterial)}
                  >
                    {material}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom material"
                  value={customMaterial}
                  onChange={(e) => setCustomMaterial(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(customMaterial, materials, setMaterials, setCustomMaterial))}
                />
                <Button
                  type="button"
                  onClick={() => addItem(customMaterial, materials, setMaterials, setCustomMaterial)}
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {materials.map(material => (
                  <Badge key={material} variant="secondary">
                    {material}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeItem(material, materials, setMaterials)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Product Flags */}
          <Card>
            <CardHeader>
              <CardTitle>Product Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleCheckboxChange('is_featured', checked as boolean)}
                />
                <Label htmlFor="is_featured">Featured Product</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_new"
                  checked={formData.is_new}
                  onCheckedChange={(checked) => handleCheckboxChange('is_new', checked as boolean)}
                />
                <Label htmlFor="is_new">New Arrival</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_sale"
                  checked={formData.is_sale}
                  onCheckedChange={(checked) => handleCheckboxChange('is_sale', checked as boolean)}
                />
                <Label htmlFor="is_sale">On Sale</Label>
              </div>

              {formData.is_sale && (
                <div>
                  <Label htmlFor="discount_percent">Discount Percentage</Label>
                  <Input
                    id="discount_percent"
                    name="discount_percent"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percent}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding Product...' : 'Add Product'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
