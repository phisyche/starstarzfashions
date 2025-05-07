
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { newArrivals } from "@/data/products";

export function NewArrivals() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <p className="text-gray-500">Check out our latest products</p>
          </div>
          
          <Button asChild variant="outline" size="sm" className="mt-4 md:mt-0">
            <Link to="/shop" className="flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
