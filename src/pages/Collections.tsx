
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
      <div className="relative min-h-[60vh] flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="public/lovable-uploads/af1aebcd-1e33-49f4-93b1-b441fd8c5edc.png" 
            alt="Star-Starz Logo" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container relative z-10 text-center py-20">
          <img 
            src="public/lovable-uploads/af1aebcd-1e33-49f4-93b1-b441fd8c5edc.png" 
            alt="Star-Starz Logo" 
            className="w-40 h-40 mx-auto mb-8"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Our Collections</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Discover our exclusive collections featuring unique pieces that combine elegance,
            quality craftsmanship, and contemporary design.
          </p>
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
            <Input
              type="search"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 text-white placeholder:text-white/60"
            />
            <Button type="submit" className="bg-theme-pink hover:bg-theme-pink/90">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div key={collection.id} className="group relative overflow-hidden rounded-lg">
                <Link to={`/collections/${collection.slug}`}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h2 className="text-2xl font-bold text-white mb-2">{collection.name}</h2>
                        <p className="text-white/90 mb-4 line-clamp-2">{collection.description}</p>
                        <Button className="w-full bg-theme-pink hover:bg-theme-blue transition-colors">
                          Explore Collection
                        </Button>
                      </div>
                    </div>
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
