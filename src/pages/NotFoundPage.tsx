
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
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
}
