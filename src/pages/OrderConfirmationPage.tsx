
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Package, ShoppingBag, Truck } from "lucide-react";

export default function OrderConfirmationPage() {
  const orderNumber = "KF" + Math.floor(100000 + Math.random() * 900000);

  return (
    <MainLayout>
      <div className="container max-w-3xl py-16">
        <div className="bg-white rounded-lg border p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="text-sm text-gray-600 mb-1">Order Number</div>
            <div className="text-xl font-bold">{orderNumber}</div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">What's Next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <ShoppingBag className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-medium">Order Processing</h3>
                </div>
                <p className="text-sm text-gray-600">
                  We're preparing your items for shipping. You'll receive an email once your order is ready.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Package className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-medium">Order Packed</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Your items are carefully packed and ready to be shipped to your location.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Truck className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-medium">Order Delivery</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Your package will be delivered to your address within 2-4 business days.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <p>
              A confirmation email has been sent to your email address.
            </p>
            <p>
              If you have any questions about your order, please contact our customer service team.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/shop">
                Continue Shopping
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/account/orders">
                View Order
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
