
import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
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
  );
}
