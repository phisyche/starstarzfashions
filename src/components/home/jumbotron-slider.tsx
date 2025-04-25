
import { Button } from "@/components/ui/button";
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
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    title: "African Modern",
    description: "Contemporary African fashion for the modern man",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f702",
    title: "Traditional Excellence",
    description: "Authentic African designs with a modern twist",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35",
    title: "New Collection",
    description: "Discover our latest African-inspired pieces",
  },
];

export function JumbotronSlider() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="relative w-full h-[80vh]"
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id} className="relative">
            <div className="relative h-[80vh] w-full overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 scale-100 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl">
                    <h2 className="text-6xl font-bold mb-6 text-white animate-fade-in">
                      {slide.title}
                    </h2>
                    <p className="text-2xl mb-8 text-white/90 animate-fade-in delay-75">
                      {slide.description}
                    </p>
                    <Button 
                      asChild 
                      size="lg"
                      className="bg-kenya-red hover:bg-red-700 animate-fade-in delay-150 text-lg px-8 py-6"
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
    </Carousel>
  );
}
