
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
        {/* Beautiful gradient backdrop instead of an image */}
        <div className="w-full h-full bg-gradient-to-br from-pink-200 via-pink-400 to-purple-600 opacity-90" />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="container relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-pink-500/30 rounded-full blur-xl"></div>
            <img 
              src="/lovable-uploads/5360e524-225a-4ce2-b602-18862793b0f3.png" 
              alt="Star Starz Fashions" 
              className="max-w-[250px] mx-auto md:mx-0 relative z-10 drop-shadow-2xl"
            />
          </div>
        </div>
        
        <div className="md:w-1/2 md:pl-12 text-center md:text-left max-w-xl">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Join Our Fashion Community
          </h2>
          <p className="text-white/90 mb-8">
            Subscribe to receive exclusive updates on new arrivals, special promotions, and fashion insights. Be the first to know about our latest collections!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto md:mx-0">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-medium">
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-xs text-white/60">
            By subscribing, you agree to our privacy policy and consent to receive updates from Star Starz Fashions.
          </p>
        </div>
      </div>
    </section>
  );
}
