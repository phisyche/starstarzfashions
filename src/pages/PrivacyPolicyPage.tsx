
import { MainLayout } from "@/components/layout/main-layout";

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose max-w-3xl">
          <p className="mb-6">Last updated: April 25, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us, including name, email address, phone number, and delivery address when you make a purchase or create an account.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>To process your orders and provide customer service</li>
            <li>To send you updates about your orders</li>
            <li>To communicate with you about our products and services</li>
            <li>To improve our website and services</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information Sharing</h2>
          <p className="mb-4">We do not sell or share your personal information with third parties for marketing purposes. We only share your information with service providers who assist in our operations.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
          <p className="mb-4">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or destruction.</p>
        </div>
      </div>
    </MainLayout>
  );
}
