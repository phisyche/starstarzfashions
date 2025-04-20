
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { collections } from "@/data/products";

export function CollectionsBanner() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Exclusive Collections</h2>
            <p className="text-gray-300 mb-6">
              Our collections feature unique pieces that blend contemporary design 
              with exceptional craftsmanship. Each piece tells a story of style and quality.
            </p>
            <Button asChild className="bg-kenya-red hover:bg-red-700">
              <Link to="/collections">Explore Collections</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {collections.slice(0, 2).map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="group relative rounded-lg overflow-hidden"
              >
                <div className="aspect-square">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-end p-4">
                    <h3 className="text-xl font-medium text-white">{collection.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
