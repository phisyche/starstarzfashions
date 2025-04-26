
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export interface ProductType {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
  slug: string;
}

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <Card className="group relative h-full flex flex-col overflow-hidden border-none shadow-none">
      <Link to={`/product/${product.slug}`} className="flex-1">
        <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          {product.isNew && (
            <Badge className="absolute top-2 left-2 z-10 bg-theme-pink text-white">
              New
            </Badge>
          )}
          {product.originalPrice && (
            <Badge variant="outline" className="absolute top-2 right-2 z-10 bg-theme-blue text-white">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="text-sm text-muted-foreground">{product.category}</div>
          <h3 className="font-medium text-base line-clamp-2 group-hover:text-theme-pink transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2">
            <Price amount={product.price} className="text-lg font-semibold" />
            {product.originalPrice && (
              <span className="text-muted-foreground line-through text-sm">
                KES {product.originalPrice}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-theme-blue hover:bg-theme-pink transition-colors"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
