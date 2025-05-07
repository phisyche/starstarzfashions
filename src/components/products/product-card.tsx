
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";

export interface ProductType {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  slug: string;
}

export interface ProductCardProps {
  product: ProductType;
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  if (layout === 'list') {
    return (
      <Card className="flex flex-row h-full overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300">
        <Link to={`/product/${product.slug}`} className="w-1/3">
          <div className="aspect-square overflow-hidden bg-gray-50 relative h-full">
            <img 
              src={product.image} 
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="w-2/3 flex flex-col">
          <CardContent className="p-3 space-y-1 flex-1">
            <div className="text-xs text-muted-foreground">{product.category}</div>
            <Link to={`/product/${product.slug}`}>
              <h3 className="font-medium text-lg line-clamp-1 hover:text-theme-pink transition-colors">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center space-x-2">
              <Price amount={product.price} className="text-lg font-semibold" />
              {product.originalPrice && (
                <span className="text-muted-foreground line-through text-sm">
                  KES {product.originalPrice}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2 mt-2">
              {product.name} - Available in multiple sizes.
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {product.isNew && (
                <Badge className="bg-theme-pink text-white">
                  New
                </Badge>
              )}
              {product.originalPrice && (
                <Badge variant="outline" className="bg-theme-blue text-white">
                  {discountPercentage}% OFF
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-amber-500 text-white">
                  Best Seller
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0 flex gap-2">
            <Button 
              className="flex-1 bg-theme-blue hover:bg-theme-pink transition-colors"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="border-theme-pink hover:bg-theme-pink/10"
              asChild
            >
              <Link to={`/product/${product.slug}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="group relative h-full flex flex-col overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`} className="flex-1">
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-0 left-0 w-full p-2 flex flex-wrap gap-1">
            {product.isNew && (
              <Badge className="bg-theme-pink text-white">
                New
              </Badge>
            )}
            {product.originalPrice && (
              <Badge variant="outline" className="bg-theme-blue text-white">
                {discountPercentage}% OFF
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-amber-500 text-white">
                Best Seller
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-3 space-y-1">
          <div className="text-xs text-muted-foreground">{product.category}</div>
          <h3 className="font-medium text-sm line-clamp-1 group-hover:text-theme-pink transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2">
            <Price amount={product.price} className="text-base font-semibold" />
            {product.originalPrice && (
              <span className="text-muted-foreground line-through text-xs">
                KES {product.originalPrice}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-3 pt-0 flex gap-2">
        <Button 
          className="w-full bg-theme-blue hover:bg-theme-pink transition-colors text-xs"
          size="sm"
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-1" />
          Add to Cart
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="border-theme-pink hover:bg-theme-pink/10"
          asChild
        >
          <Link to={`/product/${product.slug}`}>
            <Eye className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
