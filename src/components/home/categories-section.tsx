
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/products";

export function CategoriesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <Button asChild variant="ghost" className="gap-1">
            <Link to="/shop">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop/${category.slug}`}
              className="group relative h-64 overflow-hidden rounded-lg"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-2xl font-bold text-white">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
