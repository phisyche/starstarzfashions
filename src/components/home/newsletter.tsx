
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically integrate with your newsletter service
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Added local background image */}
        <img
          src="/images/newsletter-background.jpg"
          alt="Newsletter background"
          className="w-full h-full object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
      </div>
      
      <div className="container relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img 
            src="/images/newsletter-image.jpg" 
            alt="Fashion model" 
            className="rounded-lg shadow-xl max-w-sm mx-auto md:mx-0"
          />
        </div>
        
        <div className="md:w-1/2 md:pl-12 text-center md:text-left max-w-xl">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-white/90 mb-8">
            Get the latest updates on new arrivals, special offers, and exclusive discounts. Join our community of fashion enthusiasts today!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto md:mx-0">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="bg-kenya-red hover:bg-red-700">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
