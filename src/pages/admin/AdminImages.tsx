
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Image as ImageIcon, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminImages() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // State for different image sections
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [categoryImages, setCategoryImages] = useState({
    'men': '',
    'women': '',
    'accessories': '',
    'shoes': ''
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string, index?: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      if (type === 'slider') {
        const newSliderImages = [...sliderImages];
        if (index !== undefined) {
          newSliderImages[index] = result;
        } else {
          newSliderImages.push(result);
        }
        setSliderImages(newSliderImages);
      } else if (type === 'category') {
        setCategoryImages(prev => ({
          ...prev,
          [index as string]: result
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would save these to your database
      // For now, we'll just show a success message
      
      localStorage.setItem('website_slider_images', JSON.stringify(sliderImages));
      localStorage.setItem('website_category_images', JSON.stringify(categoryImages));
      
      toast({
        title: "Images saved successfully",
        description: "Website images have been updated",
      });
    } catch (error) {
      toast({
        title: "Error saving images",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved images on component mount
  useEffect(() => {
    const savedSliderImages = localStorage.getItem('website_slider_images');
    const savedCategoryImages = localStorage.getItem('website_category_images');
    
    if (savedSliderImages) {
      setSliderImages(JSON.parse(savedSliderImages));
    }
    
    if (savedCategoryImages) {
      setCategoryImages(JSON.parse(savedCategoryImages));
    }
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Website Images</h1>
            <p className="text-muted-foreground">Manage images for sliders and categories</p>
          </div>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="slider" className="space-y-6">
          <TabsList>
            <TabsTrigger value="slider">Slider Images</TabsTrigger>
            <TabsTrigger value="categories">Category Images</TabsTrigger>
          </TabsList>

          <TabsContent value="slider" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Slider Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className="space-y-2">
                      <Label>Slide {index + 1}</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {sliderImages[index] ? (
                          <div className="space-y-2">
                            <img 
                              src={sliderImages[index]} 
                              alt={`Slide ${index + 1}`}
                              className="w-full h-32 object-cover rounded"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => handleImageUpload(e as any, 'slider', index);
                                input.click();
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Replace
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                            <Button
                              variant="outline"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => handleImageUpload(e as any, 'slider', index);
                                input.click();
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(categoryImages).map(([category, imageUrl]) => (
                    <div key={category} className="space-y-2">
                      <Label className="capitalize">{category}</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {imageUrl ? (
                          <div className="space-y-2">
                            <img 
                              src={imageUrl} 
                              alt={category}
                              className="w-full h-32 object-cover rounded"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => handleImageUpload(e as any, 'category', category);
                                input.click();
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Replace
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                            <Button
                              variant="outline"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => handleImageUpload(e as any, 'category', category);
                                input.click();
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
