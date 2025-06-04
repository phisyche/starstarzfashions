
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Heart, Share2, ShoppingCart, Star, TrendingUp, Eye, Users, ArrowLeft } from 'lucide-react';
import { AddToCart } from './add-to-cart';
import { ProductCard } from './product-card';
import { useFavorites } from '@/context/FavoritesContext';
import { useSupabase } from '@/context/SupabaseContext';
import { useToast } from '@/hooks/use-toast';
import { MainLayout } from '@/components/layout/main-layout';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewCount, setViewCount] = useState(0);

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Fetch similar products (same category)
  const { data: similarProducts = [] } = useQuery({
    queryKey: ['similar-products', product?.category, product?.id],
    queryFn: async () => {
      if (!product) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(4);

      if (error) throw error;
      return data || [];
    },
    enabled: !!product,
  });

  // Fetch recommended products (featured products)
  const { data: recommendedProducts = [] } = useQuery({
    queryKey: ['recommended-products', product?.id],
    queryFn: async () => {
      if (!product) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .neq('id', product.id)
        .limit(4);

      if (error) throw error;
      return data || [];
    },
    enabled: !!product,
  });

  // Track product view
  useEffect(() => {
    if (product) {
      // Store in localStorage for recently viewed
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
      const productForStorage = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug
      };
      
      const filteredViewed = recentlyViewed.filter((p: any) => p.id !== product.id);
      const updatedViewed = [productForStorage, ...filteredViewed].slice(0, 10);
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(updatedViewed));

      // Simulate view count (in real app, this would be tracked in database)
      setViewCount(Math.floor(Math.random() * 500) + 100);
    }
  }, [product]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Product link has been copied to clipboard.',
      });
    }
  };

  const handleFavoriteToggle = () => {
    if (product) {
      toggleFavorite(product);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </MainLayout>
    );
  }

  const images = product.images && Array.isArray(product.images) ? product.images : [product.image].filter(Boolean);
  const currentImage = images[selectedImageIndex] || product.image;

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-primary capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFavoriteToggle}
                    className={isFavorite(product.id) ? 'text-red-500' : 'text-gray-400'}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.0) • {viewCount} views</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">${product.price}</span>
                {product.is_sale && product.discount_percent && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${(product.price / (1 - product.discount_percent / 100)).toFixed(2)}
                    </span>
                    <Badge variant="destructive">{product.discount_percent}% OFF</Badge>
                  </>
                )}
              </div>

              <div className="flex gap-2 mb-6">
                {product.is_new && <Badge variant="secondary">New</Badge>}
                {product.is_featured && <Badge variant="default">Featured</Badge>}
                {product.is_sale && <Badge variant="destructive">Sale</Badge>}
                <Badge variant="outline" className="capitalize">{product.category}</Badge>
              </div>
            </div>

            {/* Product Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Product Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Eye className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-lg font-bold">{viewCount}</div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Heart className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="text-lg font-bold">{Math.floor(viewCount * 0.12)}</div>
                    <div className="text-xs text-gray-500">Favorites</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-lg font-bold">{Math.floor(viewCount * 0.08)}</div>
                    <div className="text-xs text-gray-500">Purchases</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart */}
            <AddToCart product={product} />

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${product.stock && product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">
                {product.stock && product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description || 'No description available for this product.'}
                  </p>
                  {product.materials && Array.isArray(product.materials) && product.materials.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Materials:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.materials.map((material: string, index: number) => (
                          <Badge key={index} variant="outline">{material}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold">Category:</span>
                        <span className="ml-2 capitalize">{product.category}</span>
                      </div>
                      <div>
                        <span className="font-semibold">SKU:</span>
                        <span className="ml-2">{product.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </div>
                    
                    {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 && (
                      <div>
                        <span className="font-semibold">Available Sizes:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {product.sizes.map((size: string, index: number) => (
                            <Badge key={index} variant="outline">{size}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
                      <div>
                        <span className="font-semibold">Available Colors:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {product.colors.map((color: string, index: number) => (
                            <Badge key={index} variant="outline">{color}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">4.0 out of 5</h3>
                    <p className="text-gray-600 mb-4">Based on {Math.floor(viewCount * 0.15)} reviews</p>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Information</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Free shipping on orders over $50</li>
                        <li>• Standard delivery: 3-5 business days</li>
                        <li>• Express delivery: 1-2 business days</li>
                        <li>• International shipping available</li>
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Return Policy</h4>
                      <p className="text-gray-600">
                        30-day return policy. Items must be in original condition with tags attached.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
