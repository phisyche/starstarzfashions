
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

// Define the uploaded images to use for the jumbotron if database fetch fails
const initialSlides = [
  {
    id: 1,
    image: "/lovable-uploads/07c800e0-37c5-4b53-b41a-e4d279546a58.png",
    title: "African Print Collection",
    description: "Embrace culture with our vibrant African-inspired designs",
  },
  {
    id: 2,
    image: "/lovable-uploads/a8070a6f-3f4a-4e83-b530-1f35da1e7893.png",
    title: "Modern Elegance",
    description: "Contemporary fashion that blends tradition with modern aesthetics",
  },
  {
    id: 3,
    image: "/lovable-uploads/7f3ddbf3-a8c4-4b91-86a9-f5f1c19e8cff.png",
    title: "Casual & Stylish",
    description: "Everyday comfort with our uniquely crafted casual wear",
  },
  {
    id: 4,
    image: "/lovable-uploads/e6c10f91-afbd-42b1-8571-a219bc4c7ed1.png",
    title: "Urban Fashion",
    description: "Stand out with our trendy urban fashion collection",
  },
  {
    id: 5,
    image: "/lovable-uploads/b4662353-e7aa-4599-90c9-cc585cd97dea.png",
    title: "Vibrant Collection",
    description: "Bold and beautiful styles for the fashion-forward",
  }
];

export function JumbotronSlider() {
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slides, setSlides] = useState(initialSlides);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch product images from the database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // First try to get featured products from database
        const { data: productsData, error } = await supabase
          .from('products')
          .select('id, name, description, image')
          .filter('is_featured', 'eq', true)
          .limit(5);

        if (error) {
          console.error("Error fetching featured products:", error);
          return;
        }

        if (productsData && productsData.length > 0) {
          const productSlides = productsData.map((product, index) => ({
            id: index + 1,
            image: product.image || initialSlides[index % initialSlides.length].image,
            title: product.name || initialSlides[index % initialSlides.length].title,
            description: product.description || initialSlides[index % initialSlides.length].description,
          }));
          setSlides(productSlides);
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
        setTimeout(() => setIsTransitioning(false), 500); // Reduced from 800ms to 500ms for faster transition
      }
      resetAutoplay();
    }, 4000); // 4 seconds per slide
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
