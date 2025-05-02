
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Info, Users, Mail, MapPin, Clock, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About StarStarz Fashions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are passionate about bringing authentic fashion to the global stage,
            blending traditional designs with contemporary styles.
          </p>
        </div>

        {/* Mission and Values */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              Star Starz Fashions is a contemporary clothing store for both women and men. 
              We aim to provide special, unique pieces for our savy customers. Every piece 
              we choose and every line we carry is chosen in respect to its quality and 
              inspired design, with the goal that these special pieces will aid in the 
              development of our customer's personal aesthetic.
            </p>
            <p className="text-muted-foreground mb-6">
              Fashion has the unique position of being both functional and expressive. 
              We believe that your individuality can and should shine through what you 
              wear each and every day. The pieces we carry are meant to enhance your 
              existing wardrobe while expanding and solidifying your sartorial vision 
              of who you really are.
            </p>
            <div className="flex items-center gap-4">
              <Info className="h-8 w-8 text-kenya-red" />
              <div>
                <h3 className="font-semibold mb-1">Quality First</h3>
                <p className="text-sm text-muted-foreground">
                  Every piece is carefully selected to ensure the highest quality standards.
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1473177104440-ffee2f376098"
              alt="Our workshop"
              className="rounded-lg shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-16 bg-gray-50 p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white">
              <MapPin className="h-10 w-10 text-kenya-red mb-4" />
              <h3 className="font-semibold text-lg mb-2">Address</h3>
              <p className="text-muted-foreground">
                Akai Plaza Ground Floor,<br />
                Office No 2 At Rosters<br />
                Off Thika Superhighway Next to Mountain Mall
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white">
              <Mail className="h-10 w-10 text-kenya-red mb-4" />
              <h3 className="font-semibold text-lg mb-2">Email Us</h3>
              <a 
                href="mailto:info@starstarzfashions.com" 
                className="text-muted-foreground hover:text-kenya-red transition-colors"
              >
                info@starstarzfashions.com
              </a>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-kenya-red mb-4">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <h3 className="font-semibold text-lg mb-2">Telephone</h3>
              <div className="text-muted-foreground">
                <a href="tel:0745025502" className="hover:text-kenya-red transition-colors block">
                  0745 02 55 02
                </a>
                <a href="tel:0722430359" className="hover:text-kenya-red transition-colors block">
                  0722 430 359
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white">
              <Clock className="h-10 w-10 text-kenya-red mb-4" />
              <h3 className="font-semibold text-lg mb-2">Working Hours</h3>
              <p className="text-muted-foreground">
                Open: 8:00AM – Close: 18:00PM<br />
                Saturday – Sunday: Closed
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <a 
              href="https://www.facebook.com/starstarzltd/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Facebook className="h-5 w-5" />
              Visit our Facebook page
            </a>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the passionate individuals behind StarStarz Ltd who work tirelessly
              to bring you the best in fashion.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 rounded-lg border">
              <Users className="h-10 w-10 text-kenya-red" />
              <div>
                <h3 className="font-semibold">Expert Curators</h3>
                <p className="text-sm text-muted-foreground">
                  Our team carefully selects each piece in our collection.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-lg border">
              <Mail className="h-10 w-10 text-kenya-red" />
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-sm text-muted-foreground">
                  Available during business hours to assist you with any queries.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-lg border">
              <Info className="h-10 w-10 text-kenya-red" />
              <div>
                <h3 className="font-semibold">Quality Control</h3>
                <p className="text-sm text-muted-foreground">
                  Ensuring the highest standards for every product.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience Our Fashion?</h2>
          <Button asChild className="bg-kenya-red hover:bg-kenya-red/90">
            <Link to="/shop">Shop Now</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
