
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { featuredProducts, newArrivals, categories, collections } from "@/data/products";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold text-white mb-4">
              Authentic Kenyan Fashion Delivered to Your Door
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Discover unique pieces that blend traditional heritage with modern style
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-kenya-red hover:bg-red-700">
                <Link to="/shop">Shop Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                <Link to="/collections">View Collections</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
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

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button asChild variant="ghost" className="gap-1">
              <Link to="/shop">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Collections Banner */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Exclusive Collections</h2>
              <p className="text-gray-300 mb-6">
                Our collections feature unique pieces that blend traditional Kenyan heritage with modern styles.
                Each piece tells a story of our rich cultural history and contemporary design.
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

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Button asChild variant="ghost" className="gap-1">
              <Link to="/shop?sort=newest">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-kenya-green/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-kenya-green"
                >
                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Authentic Designs</h3>
              <p className="text-gray-600">
                We work directly with local artisans and designers to bring you authentic Kenyan fashion with rich cultural heritage.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-kenya-red/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-kenya-red"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M7 15h0M2 9.5h20" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Payment Options</h3>
              <p className="text-gray-600">
                We offer convenient payment methods including M-Pesa, Visa, Mastercard, and Airtel Money for hassle-free shopping.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-teal/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-accent-teal"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M21 12H3M12 3v18" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Nationwide Delivery</h3>
              <p className="text-gray-600">
                We deliver to all major cities and towns across Kenya, with fast shipping and real-time tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-kenya-red text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-white/90 mb-8">
              Subscribe to get updates on new arrivals, special offers and other discount information.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg text-black"
              />
              <Button className="bg-black hover:bg-gray-900">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
