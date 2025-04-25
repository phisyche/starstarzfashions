
import { MainLayout } from "@/components/layout/main-layout";

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        <div className="prose max-w-3xl">
          <p className="mb-6">Last updated: April 25, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing and using this website, you accept and agree to be bound by these terms and conditions.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Products and Pricing</h2>
          <p className="mb-4">All prices are in Kenyan Shillings (KES) and include VAT where applicable. We reserve the right to modify prices without prior notice.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Orders and Payment</h2>
          <p className="mb-4">Orders are subject to availability and acceptance. Payment is required at the time of ordering. We accept M-PESA and VISA payments.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Delivery</h2>
          <p className="mb-4">Delivery timeframes are estimates only. We are not responsible for delays beyond our control.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Customer Responsibilities</h2>
          <p className="mb-4">You are responsible for providing accurate delivery information and ensuring someone is available to receive the delivery.</p>
        </div>
      </div>
    </MainLayout>
  );
}
