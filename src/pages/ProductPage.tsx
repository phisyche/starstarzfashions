
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Price } from "@/components/ui/price";
import { products } from "@/data/products";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Heart, Share, ArrowLeft, Plus, Minus, Check, Truck } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find(p => p.slug === slug);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "Red", "Blue", "Green"];
  
  // Get related products (excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-8">
        <Link to="/shop" className="inline-flex items-center gap-1 text-gray-600 hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-white">
              <img 
                src={product.image} 
                alt={product.name} 
                className="h-full w-full object-cover" 
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="aspect-square overflow-hidden rounded-md border bg-white cursor-pointer">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-md border bg-white cursor-pointer">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-md border bg-white cursor-pointer">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-md border bg-white cursor-pointer">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">{product.category}</div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="h-4 w-4 fill-current text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">(24 reviews)</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-6">
                <Price amount={product.price} size="lg" />
                {product.originalPrice && (
                  <span className="text-gray-500 line-through">KES {product.originalPrice}</span>
                )}
              </div>
              
              <p className="text-gray-600 mb-6">
                This beautiful {product.name.toLowerCase()} showcases authentic Kenyan design and craftsmanship.
                Perfect for everyday wear or special occasions. Made with high-quality fabrics and attention to detail.
              </p>
              
              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Color: {selectedColor}</h3>
                <div className="flex items-center space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? "border-primary" : "border-transparent"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        outline: selectedColor === color ? "2px solid #00000020" : "",
                        outlineOffset: "2px",
                      }}
                      aria-label={`Select ${color} color`}
                    >
                      {selectedColor === color && (
                        <Check className="h-4 w-4 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Size: {selectedSize}</h3>
                  <button className="text-sm text-primary underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] h-10 px-3 rounded border ${
                        selectedSize === size
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Quantity</h3>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-l-md rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="h-10 w-14 flex items-center justify-center border-y border-input">
                    {quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-10 w-10 rounded-r-md rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button size="lg" className="flex-1 gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="flex-1 gap-2">
                  <Heart className="h-5 w-5" />
                  Add to Wishlist
                </Button>
              </div>
              
              {/* Shipping Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Delivery Information</h4>
                    <p className="text-sm text-gray-600">
                      Free shipping to Nairobi. KES 300 shipping to other cities in Kenya. 
                      Delivery typically takes 2-4 business days.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Share */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Share:</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Share className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews (24)</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-6 border rounded-b-lg">
              <h3 className="text-lg font-medium mb-4">Product Description</h3>
              <div className="text-gray-600 space-y-4">
                <p>
                  This authentic {product.name.toLowerCase()} showcases the rich cultural heritage of Kenya.
                  Each piece is carefully crafted with attention to detail and high-quality materials.
                </p>
                <p>
                  The unique design draws inspiration from traditional patterns and motifs, 
                  blending them with contemporary styles for a modern yet authentic look.
                </p>
                <p>
                  Whether you're attending a special event or elevating your everyday wardrobe,
                  this versatile piece is sure to make a statement while celebrating Kenyan craftsmanship.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="p-6 border rounded-b-lg">
              <h3 className="text-lg font-medium mb-4">Product Details</h3>
              <ul className="space-y-2 text-gray-600">
                <li><span className="font-medium">Material:</span> 100% Cotton</li>
                <li><span className="font-medium">Pattern:</span> Kitenge/Ankara Print</li>
                <li><span className="font-medium">Care:</span> Machine wash cold, gentle cycle</li>
                <li><span className="font-medium">Origin:</span> Made in Kenya</li>
                <li><span className="font-medium">Fit:</span> Regular fit</li>
                <li><span className="font-medium">Closure:</span> Button</li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="p-6 border rounded-b-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Customer Reviews (24)</h3>
                <Button>Write a Review</Button>
              </div>
              <div className="space-y-6">
                {/* Review 1 */}
                <div className="border-b pb-6">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="h-4 w-4 fill-current text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">Beautiful Design</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    The quality is exceptional and the colors are vibrant. I love how it fits and the attention to detail.
                  </p>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Jane Doe</span> • March 12, 2025
                  </div>
                </div>
                {/* Review 2 */}
                <div className="border-b pb-6">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4].map((star) => (
                        <svg
                          key={star}
                          className="h-4 w-4 fill-current text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <svg
                        className="h-4 w-4 fill-current text-gray-300"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>
                    <span className="ml-2 text-sm font-medium">Great Product</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    I love this piece but it runs slightly larger than expected. The colors are vibrant and the material is comfortable.
                  </p>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">John Smith</span> • February 28, 2025
                  </div>
                </div>
                
                <Button variant="ghost" className="w-full">Load More Reviews</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
