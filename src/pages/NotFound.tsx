
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log the 404 error to the console
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Scroll to top of page on load
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-9xl font-bold text-muted-foreground mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex space-x-4">
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/shop">Browse Products</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
