
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
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
            Premium Fashion Delivered with Style
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Discover unique pieces that combine elegance and quality
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
  );
}
