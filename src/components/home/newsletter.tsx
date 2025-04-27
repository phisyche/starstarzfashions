
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
        <img
          src="/images/newsletter-bg.jpg"
          alt="Newsletter background"
          className="w-full h-full object-cover object-left opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-white/90 mb-8">
            Get the latest updates on new arrivals, special offers, and exclusive discounts.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
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
