
import { MainLayout } from "@/components/layout/main-layout";
import { collections, products } from "@/data/products";
import { useParams, Link } from "react-router-dom";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const collection = collections.find(c => c.slug === slug);
  
  // For demo purposes, show a selection of products
  // In a real app, this would filter based on collection relationships
  const collectionProducts = products.slice(0, 8);
  
  if (!collection) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Collection Not Found</h1>
          <p className="text-gray-600 mb-6">The collection you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/collections">Back to Collections</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={collection.image} 
            alt={collection.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="container relative z-10">
          <Link to="/collections" className="inline-flex items-center text-gray-600 hover:text-kenya-red mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Link>
          <h1 className="text-4xl font-bold mb-3">{collection.name}</h1>
          <p className="text-gray-600 max-w-2xl">
            {collection.description}
          </p>
        </div>
      </div>

      <section className="py-10">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
