
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { newArrivals } from "@/data/products";

export function NewArrivals() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <Button asChild variant="ghost" className="gap-1">
            <Link to="/shop?sort=newest">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
