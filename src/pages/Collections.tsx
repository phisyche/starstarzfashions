
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { collections } from "@/data/products";
import { Link } from "react-router-dom";

export default function Collections() {
  return (
    <MainLayout>
      <div className="bg-gray-50 py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-3">Our Collections</h1>
          <p className="text-gray-600 max-w-2xl">
            Explore our exclusive collections featuring unique pieces that combine elegance,
            quality craftsmanship, and contemporary design. Each collection tells a different story.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div key={collection.id} className="group">
                <Link 
                  to={`/collections/${collection.slug}`} 
                  className="block relative overflow-hidden rounded-xl aspect-[4/5]"
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{collection.name}</h2>
                    <p className="text-white/90 mb-4">{collection.description}</p>
                    <Button className="w-full md:w-auto bg-kenya-red hover:bg-red-700">
                      View Collection
                    </Button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
