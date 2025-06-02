
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { useSupabase } from '@/context/SupabaseContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Upload, Trash2, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SiteImage {
  id: string;
  category: 'slider' | 'category' | 'banner';
  url: string;
  title: string;
  description?: string;
  order_index: number;
  is_active: boolean;
}

export default function AdminImages() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      setLoading(true);
      
      // For now, we'll create mock data since the table doesn't exist yet
      // In a real implementation, you would fetch from the database
      const mockImages: SiteImage[] = [
        {
          id: '1',
          category: 'slider',
          url: '/lovable-uploads/42efd527-3543-499c-ae64-527c63001e6c.png',
          title: 'Hero Slider 1',
          description: 'Main promotional banner',
          order_index: 1,
          is_active: true
        },
        {
          id: '2',
          category: 'category',
          url: '/lovable-uploads/5360e524-225a-4ce2-b602-18862793b0f3.png',
          title: 'Category: Dresses',
          description: 'Shop by category image',
          order_index: 1,
          is_active: true
        }
      ];
      
      setImages(mockImages);
    } catch (error: any) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error loading images",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(file: File, category: string) {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${category}-${Date.now()}.${fileExt}`;
      const filePath = `site-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Here you would normally insert into a site_images table
      // For now, we'll just add to the local state
      const newImage: SiteImage = {
        id: Date.now().toString(),
        category: category as 'slider' | 'category' | 'banner',
        url: publicUrl,
        title: `New ${category} image`,
        description: '',
        order_index: images.filter(img => img.category === category).length + 1,
        is_active: true
      };

      setImages(prev => [...prev, newImage]);

      toast({
        title: "Image uploaded successfully",
        description: "The image has been added to your site",
      });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage(imageId: string) {
    try {
      // Here you would normally delete from the database
      // For now, we'll just remove from local state
      setImages(prev => prev.filter(img => img.id !== imageId));
      
      toast({
        title: "Image deleted",
        description: "The image has been removed from your site",
      });
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  }

  async function handleUpdateImage(imageId: string, updates: Partial<SiteImage>) {
    try {
      // Here you would normally update the database
      // For now, we'll just update local state
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, ...updates } : img
      ));
      
      toast({
        title: "Image updated",
        description: "Changes have been saved",
      });
    } catch (error: any) {
      console.error('Error updating image:', error);
      toast({
        title: "Update failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  }

  const renderImageCategory = (category: 'slider' | 'category' | 'banner', title: string) => {
    const categoryImages = images.filter(img => img.category === category);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file, category);
                }
              }}
              className="hidden"
              id={`upload-${category}`}
            />
            <Button asChild disabled={uploading}>
              <Label htmlFor={`upload-${category}`} className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Label>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryImages.map((image) => (
            <Card key={image.id}>
              <CardContent className="p-4">
                <div className="aspect-video relative mb-3 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <Input
                    value={image.title}
                    onChange={(e) => handleUpdateImage(image.id, { title: e.target.value })}
                    placeholder="Image title"
                  />
                  
                  <Input
                    value={image.description || ''}
                    onChange={(e) => handleUpdateImage(image.id, { description: e.target.value })}
                    placeholder="Description (optional)"
                  />
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">
                      Order: 
                      <Input
                        type="number"
                        value={image.order_index}
                        onChange={(e) => handleUpdateImage(image.id, { order_index: parseInt(e.target.value) || 1 })}
                        className="w-16 ml-2"
                        min="1"
                      />
                    </Label>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {categoryImages.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No images uploaded yet</p>
                <p className="text-sm text-gray-400">Upload your first {category} image</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Site Images</h1>
          <p className="text-muted-foreground">Manage images displayed across your website</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(3).fill(0).map((_, j) => (
                      <Skeleton key={j} className="aspect-video" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="slider" className="space-y-6">
            <TabsList>
              <TabsTrigger value="slider">Hero Slider</TabsTrigger>
              <TabsTrigger value="category">Category Images</TabsTrigger>
              <TabsTrigger value="banner">Promotional Banners</TabsTrigger>
            </TabsList>

            <TabsContent value="slider" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Slider Images</CardTitle>
                  <CardDescription>
                    Images displayed in the main slider on the homepage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderImageCategory('slider', 'Hero Slider')}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="category" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Images</CardTitle>
                  <CardDescription>
                    Images used for "Shop by Category" sections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderImageCategory('category', 'Category Images')}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="banner" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Promotional Banners</CardTitle>
                  <CardDescription>
                    Special promotional and marketing banners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderImageCategory('banner', 'Promotional Banners')}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
}
