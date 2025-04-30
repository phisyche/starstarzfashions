
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CategoryButtons() {
  const categories = [
    { id: 1, name: "Men", slug: "men" },
    { id: 2, name: "Women", slug: "women" },
    { id: 3, name: "Dresses", slug: "dresses" },
    { id: 4, name: "Tops", slug: "tops" },
    { id: 5, name: "Trousers", slug: "trousers" },
    { id: 6, name: "Bags", slug: "bags" },
    { id: 7, name: "T-Shirts", slug: "tshirts" },
    { id: 8, name: "Shoes", slug: "shoes" }
  ];

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
