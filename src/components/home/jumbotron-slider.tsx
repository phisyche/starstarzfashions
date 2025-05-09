
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { EmblaCarouselType } from "embla-carousel";

const slides = [
  {
    id: 1,
    image: "/new/starstarz/IMG-20250426-WA0006.jpg",
    title: "African Print Collection",
    description: "Embrace culture with our vibrant African-inspired designs",
  },
  {
    id: 2,
    image: "/new/starstarz/IMG-20250426-WA0002.jpg",
    title: "Modern Elegance",
    description: "Contemporary fashion that blends tradition with modern aesthetics",
  },
  {
    id: 3,
    image: "/new/starstarz/IMG-20250426-WA0007.jpg",
    title: "Casual & Stylish",
    description: "Everyday comfort with our uniquely crafted casual wear",
  },
];

export function JumbotronSlider() {
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  const resetAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }
    
    autoplayTimerRef.current = setTimeout(() => {
      if (api) {
        setIsTransitioning(true);
        api.scrollNext();
        setTimeout(() => setIsTransitioning(false), 500); // Reduced from 800ms to 500ms for faster transition
      }
      resetAutoplay();
    }, 4000); // Reduced from 5000ms to 4000ms for faster slides
  }, [api]);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!api) return;
    
    api.on("select", onSelect);
    resetAutoplay();
    
    return () => {
      api.off("select", onSelect);
      stopAutoplay();
    };
  }, [api, onSelect, resetAutoplay, stopAutoplay]);

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      setApi={setApi}
      className="relative w-full h-[80vh]"
      onMouseEnter={stopAutoplay}
      onMouseLeave={resetAutoplay}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id} className="relative overflow-hidden">
            <div className="relative h-[80vh] w-full overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                  isTransitioning ? "scale-105" : "scale-100"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-theme-blue/30 to-theme-pink/20" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className={`max-w-2xl transition-all duration-500 ${
                    isTransitioning ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
                  }`}>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl mb-8 text-white/90">
                      {slide.description}
                    </p>
                    <Button 
                      asChild 
                      size="lg"
                      className="bg-theme-pink hover:bg-theme-blue text-lg px-8 py-6 transition-colors duration-300"
                    >
                      <a href="/shop">Shop Now</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-theme-pink/20 border-none text-white" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-theme-pink/20 border-none text-white" />
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === index ? "bg-theme-pink w-8" : "bg-white/50"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Carousel>
  );
}
