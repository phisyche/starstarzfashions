
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCallback } from "react";
import type { EmblaCarouselType } from "embla-carousel";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?auto=format&fit=crop&q=80",
    title: "African Modern",
    description: "Contemporary African fashion for the modern lifestyle",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&q=80",
    title: "Traditional Excellence",
    description: "Authentic African designs with a modern twist",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1549400861-d5a3c594e412?auto=format&fit=crop&q=80",
    title: "New Collection",
    description: "Discover our latest African-inspired pieces",
  },
];

export function JumbotronSlider() {
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  // Auto-slide effect
  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [api]);

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      setApi={setApi}
      className="relative w-full h-[80vh]"
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id} className="relative overflow-hidden">
            <div className="relative h-[80vh] w-full overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000 scale-100 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl opacity-0 animate-[fadeIn_0.8s_ease-in-out_forwards]">
                    <h2 className="text-6xl font-bold mb-6 text-white">
                      {slide.title}
                    </h2>
                    <p className="text-2xl mb-8 text-white/90">
                      {slide.description}
                    </p>
                    <Button 
                      asChild 
                      size="lg"
                      className="bg-kenya-red hover:bg-red-700 text-lg px-8 py-6"
                    >
                      <a href="/shop">Explore Collection</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-none text-white" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-none text-white" />
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === index ? "bg-white w-8" : "bg-white/50"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Carousel>
  );
}
