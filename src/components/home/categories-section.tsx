
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CategoriesSection() {
  const categories = [
    {
      id: 1,
      name: "Men",
      slug: "men",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Women",
      slug: "women",
      image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Dresses",
      slug: "dresses",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      name: "Shoes",
      slug: "shoes",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80",
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-theme-pink/5 to-theme-blue/5">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <Button asChild variant="ghost" className="gap-1 hover:text-theme-pink">
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
              <div className="absolute inset-0 bg-gradient-to-b from-theme-blue/20 to-theme-pink/30 group-hover:opacity-75 transition-opacity z-10" />
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
