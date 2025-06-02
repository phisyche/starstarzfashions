
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
import { supabase } from "@/integrations/supabase/client";

// Fallback slides in case no products are found
const fallbackSlides = [
  {
    id: 1,
    image: "/lovable-uploads/07c800e0-37c5-4b53-b41a-e4d279546a58.png",
    title: "Welcome to StarStarz Fashion",
    description: "Discover our amazing collection of fashion items",
  },
  {
    id: 2,
    image: "/lovable-uploads/a8070a6f-3f4a-4e83-b530-1f35da1e7893.png",
    title: "New Arrivals",
    description: "Check out our latest fashion trends",
  },
];

export function JumbotronSlider() {
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slides, setSlides] = useState(fallbackSlides);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch featured products from the database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data: productsData, error } = await supabase
          .from('products')
          .select('id, name, description, image')
          .eq('is_featured', true)
          .limit(5);

        if (error) {
          console.error("Error fetching featured products:", error);
          return;
        }

        if (productsData && productsData.length > 0) {
          const productSlides = productsData.map((product, index) => ({
            id: index + 1,
            image: product.image || fallbackSlides[index % fallbackSlides.length].image,
            title: product.name || `Featured Product ${index + 1}`,
            description: product.description || "Discover this amazing product from our collection",
          }));
          setSlides(productSlides);
        } else {
          // If no featured products, fetch any products
          const { data: anyProducts, error: anyError } = await supabase
            .from('products')
            .select('id, name, description, image')
            .limit(5);
          
          if (anyError) {
            console.error("Error fetching any products:", anyError);
            return;
          }
          
          if (anyProducts && anyProducts.length > 0) {
            const productSlides = anyProducts.map((product, index) => ({
              id: index + 1,
              image: product.image || fallbackSlides[index % fallbackSlides.length].image,
              title: product.name || `Product ${index + 1}`,
              description: product.description || "Discover this amazing product from our collection",
            }));
            setSlides(productSlides);
          }
        }
      } catch (error) {
        console.error("Error in fetching featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

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
        setTimeout(() => setIsTransitioning(false), 500);
      }
      resetAutoplay();
    }, 4000);
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
