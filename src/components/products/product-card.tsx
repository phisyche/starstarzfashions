
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
    <Card className="overflow-hidden group h-full flex flex-col relative">
      {product.isNew && (
        <Badge className="absolute top-2 left-2 z-10 bg-kenya-red text-white">
          New
        </Badge>
      )}
      {product.originalPrice && (
        <Badge variant="outline" className="absolute top-2 right-2 z-10 bg-accent-yellow text-black font-medium">
          {discountPercentage}% OFF
        </Badge>
      )}
      <Link to={`/product/${product.slug}`} className="flex-1 flex flex-col">
        <div className="overflow-hidden aspect-square relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="flex-1 flex flex-col p-4">
          <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
          <h3 className="font-medium text-base mb-1 line-clamp-2">{product.name}</h3>
          <div className="mt-auto flex items-center space-x-2">
            <Price amount={product.price} size="md" />
            {product.originalPrice && (
              <span className="text-muted-foreground line-through text-sm">
                KES {product.originalPrice}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
