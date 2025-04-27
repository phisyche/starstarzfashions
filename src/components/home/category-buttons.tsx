
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { categories } from "@/data/products";

export function CategoryButtons() {
  return (
    <div className="container py-6 border-b">
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            className="border-theme-pink text-theme-blue hover:bg-theme-pink hover:text-white transition-colors"
            asChild
          >
            <Link to={`/shop/${category.slug}`}>
              {category.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
