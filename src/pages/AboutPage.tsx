
import { MainLayout } from "@/components/layout/main-layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="container max-w-5xl">
          <h1 className="text-3xl font-bold mb-2">About Us</h1>
          <div className="text-gray-600">
            Learn more about Star Starz Fashions
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Star Starz Fashions is a contemporary clothing store for both women and men. 
              We aim to provide special, unique pieces for our savy customers. Every piece 
              we choose and every line we carry is chosen in respect to its quality and 
              inspired design, with the goal that these special pieces will aid in the 
              development of our customer's personal aesthetic.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Fashion has the unique position of being both functional and expressive. 
              We believe that your individuality can and should shine through what you 
              wear each and every day. The pieces we carry are meant to enhance your 
              existing wardrobe while expanding and solidifying your sartorial vision 
              of who you really are.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link to="/shop">Shop Our Collection</Link>
              </Button>
            </div>
          </div>
          <div className="aspect-square relative rounded-lg overflow-hidden shadow-xl">
            <img 
              src="/new/starstarz/IMG-20250426-WA0015.jpg" 
              alt="Star Starz Fashions" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <Separator className="my-16" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Quality Design</h3>
            <p className="text-gray-600">
              Every piece is chosen with respect to its quality and inspired design.
            </p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Personal Expression</h3>
            <p className="text-gray-600">
              We believe your individuality can and should shine through what you wear.
            </p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Unique Selection</h3>
            <p className="text-gray-600">
              We provide special, unique pieces for our savvy customers.
            </p>
          </div>
        </div>

        <Separator className="my-16" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <img 
              src="/new/starstarz/IMG-20250426-WA0010.jpg" 
              alt="Our Store" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6">Visit Our Store</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600">
                  Akai Plaza Ground Floor,<br />
                  Office No 2 At Rosters<br />
                  Off Thika Superhighway Next to Mountain Mall
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Working Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 8:00AM – 18:00PM<br />
                  Saturday – Sunday: Closed
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                <p className="text-gray-600">
                  Phone: 0745 02 55 02 | 0722 430 359<br />
                  Email: info@starstarzfashions.com
                </p>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" asChild>
                  <a href="https://www.facebook.com/starstarzltd/" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    Follow us on Facebook
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
