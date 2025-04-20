
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Info, Users, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About StarStarz Ltd</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are passionate about bringing authentic African fashion to the global stage,
            blending traditional designs with contemporary styles.
          </p>
        </div>

        {/* Mission and Values */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              To showcase the beauty and richness of African fashion while supporting local
              artisans and designers. We strive to create a platform that celebrates cultural
              heritage through contemporary fashion.
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

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the passionate individuals behind StarStarz Ltd who work tirelessly
              to bring you the best in African fashion.
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
                  Available 24/7 to assist you with any queries.
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
          <h2 className="text-2xl font-bold mb-4">Ready to Experience African Fashion?</h2>
          <Button asChild className="bg-kenya-red hover:bg-kenya-red/90">
            <Link to="/shop">Shop Now</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
