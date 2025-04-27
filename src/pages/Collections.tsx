
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { collections } from "@/data/products";
import { Link } from "react-router-dom";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Collections() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-theme-pink/10 to-theme-blue/10 py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-3 text-gray-900">Our Collections</h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-gray-600 max-w-2xl">
              Explore our exclusive collections featuring unique pieces that combine elegance,
              quality craftsmanship, and contemporary design.
            </p>
            <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
              <Input
                type="search"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64"
              />
              <Button type="submit" aria-label="Search">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map((collection) => (
              <div key={collection.id} className="group">
                <Link 
                  to={`/collections/${collection.slug}`} 
                  className="block relative overflow-hidden rounded-lg aspect-[4/3]"
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{collection.name}</h2>
                    <p className="text-white/90 mb-4 text-sm md:text-base max-w-md">{collection.description}</p>
                    <Button className="w-full md:w-auto bg-theme-pink hover:bg-theme-blue transition-colors">
                      Explore Collection
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
