
import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-primary mb-4" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
          
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been received and is now being processed.
            You will receive an email confirmation shortly.
          </p>
          
          <div className="border rounded-lg p-6 mb-8 bg-muted/20">
            <h3 className="font-medium text-lg mb-2">Order Details</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your order confirmation and details have been sent to your email address.
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <p className="text-muted-foreground">Order Number:</p>
                <p className="font-medium">#ORDER12345</p>
              </div>
              <div className="text-left">
                <p className="text-muted-foreground">Date:</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-left">
                <p className="text-muted-foreground">Payment Method:</p>
                <p className="font-medium">Credit Card</p>
              </div>
              <div className="text-left">
                <p className="text-muted-foreground">Shipping Method:</p>
                <p className="font-medium">Standard Delivery</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild>
              <Link to="/account">View Order Status</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
