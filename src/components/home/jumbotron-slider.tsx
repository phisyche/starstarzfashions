
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    title: "Summer Collection",
    description: "Discover our latest summer styles",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    title: "New Arrivals",
    description: "Check out our newest fashion pieces",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    title: "Special Offers",
    description: "Limited time discounts on select items",
  },
];

export function JumbotronSlider() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="relative w-full h-[70vh]"
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id} className="relative">
            <div className="relative h-[70vh] w-full overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6 max-w-xl mx-auto">
                  <h2 className="text-4xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h2>
                  <p className="text-xl mb-6 animate-fade-in opacity-90">
                    {slide.description}
                  </p>
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-kenya-red hover:bg-red-700 animate-fade-in"
                  >
                    <a href="/shop">Shop Now</a>
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
}
