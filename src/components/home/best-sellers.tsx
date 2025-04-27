
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { bestSellers } from "@/data/products";

export function BestSellers() {
  return (
    <section className="py-12 bg-gradient-to-r from-theme-pink/5 to-theme-blue/5">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Best Selling Wears</h2>
          <Button asChild variant="ghost" className="gap-1">
            <Link to="/shop?sort=popular">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {bestSellers.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
