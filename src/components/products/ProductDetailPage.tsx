import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/main-layout';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Heart, Share2, ShoppingCart, TrendingUp, Eye, Users, ArrowLeft } from 'lucide-react';
import { useSupabase } from '@/context/SupabaseContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { supabase } = useSupabase();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!slug) return null;
      
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

  // Fetch similar products
  const { data: similarProducts = [] } = useQuery({
    queryKey: ['similar-products', product?.category],
    queryFn: async () => {
      if (!product?.category) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(4);

      if (error) throw error;
      return data || [];
    },
    enabled: !!product?.category,
  });

  // Fetch recommended products (featured/new items)
  const { data: recommendedProducts = [] } = useQuery({
    queryKey: ['recommended-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or('is_featured.eq.true,is_new.eq.true')
        .neq('id', product?.id || '')
        .limit(4);

      if (error) throw error;
      return data || [];
    },
    enabled: !!product,
  });

  const handleToggleFavorite = async () => {
    if (!product) return;

    if (isFavorite(product.id)) {
      await removeFromFavorites(product.id);
      toast({
        title: 'Removed from wishlist',
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      await addToFavorites({
        id: product.id,
        productId: product.id,
        product_id: product.id,
        name: product.name,
        product_name: product.name,
        price: product.price,
        image: product.image,
        image_url: product.image,
      });
      toast({
        title: 'Added to wishlist',
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied',
        description: 'Product link copied to clipboard!',
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
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
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Product images array (fallback to single image if no gallery)
  const productImages = product.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image];

  // Mock analytics data (in real app, this would come from database)
  const analytics = {
    views: Math.floor(Math.random() * 1000) + 100,
    likes: Math.floor(Math.random() * 200) + 50,
    orders: Math.floor(Math.random() * 50) + 10,
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={productImages[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
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

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.is_new && <Badge variant="secondary">New</Badge>}
                {product.is_featured && <Badge>Featured</Badge>}
                {product.is_sale && <Badge variant="destructive">Sale</Badge>}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.0) • 24 reviews</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.is_sale && product.discount_percent && (
                  <span className="text-xl text-gray-500 line-through">
                    ${(Number(product.price) / (1 - product.discount_percent / 100)).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Product Analytics */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Product Insights</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Eye className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <div className="text-lg font-bold">{analytics.views}</div>
                    <div className="text-xs text-gray-600">Views</div>
                  </div>
                  <div className="text-center">
                    <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                    <div className="text-lg font-bold">{analytics.likes}</div>
                    <div className="text-xs text-gray-600">Likes</div>
                  </div>
                  <div className="text-center">
                    <ShoppingCart className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <div className="text-lg font-bold">{analytics.orders}</div>
                    <div className="text-xs text-gray-600">Sold</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-4">
              <Button 
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleToggleFavorite}
                >
                  <Heart 
                    className={`h-4 w-4 mr-2 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                  {isFavorite(product.id) ? 'Saved' : 'Save to Wishlist'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">In Stock</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                {product.stock || 100} items available
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Category:</span>
                      <span className="ml-2 capitalize">{product.category}</span>
                    </div>
                    <div>
                      <span className="font-medium">Brand:</span>
                      <span className="ml-2">Star Starz Fashions</span>
                    </div>
                    <div>
                      <span className="font-medium">Materials:</span>
                      <span className="ml-2">
                        {product.materials && Array.isArray(product.materials) 
                          ? product.materials.join(', ') 
                          : 'Premium Cotton Blend'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Available Sizes:</span>
                      <span className="ml-2">
                        {product.sizes && Array.isArray(product.sizes) 
                          ? product.sizes.join(', ') 
                          : 'XS - XXL'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Customer Reviews</h3>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                  
                  {/* Sample reviews */}
                  <div className="space-y-4">
                    {[
                      { name: 'Sarah M.', rating: 5, comment: 'Excellent quality and fast shipping!' },
                      { name: 'John D.', rating: 4, comment: 'Great product, fits perfectly.' },
                      { name: 'Emma L.', rating: 5, comment: 'Love the design and comfort!' },
                    ].map((review, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Shipping Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Free shipping</span> on orders over $50</p>
                    <p><span className="font-medium">Standard delivery:</span> 3-5 business days</p>
                    <p><span className="font-medium">Express delivery:</span> 1-2 business days</p>
                    <p><span className="font-medium">International shipping:</span> 7-14 business days</p>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Return Policy</h4>
                    <p className="text-sm text-gray-600">
                      30-day returns. Items must be in original condition with tags attached.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5" />
              <h2 className="text-2xl font-bold">Similar Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct.id} product={similarProduct} />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5" />
              <h2 className="text-2xl font-bold">You Might Also Like</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((recommendedProduct) => (
                <ProductCard key={recommendedProduct.id} product={recommendedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
