
import { MainLayout } from "@/components/layout/main-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FaqPage() {
  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="w-full max-w-3xl">
          <AccordionItem value="delivery">
            <AccordionTrigger>What are your delivery timeframes?</AccordionTrigger>
            <AccordionContent>
              We typically deliver within Nairobi in 1-2 business days. For other regions in Kenya, delivery takes 3-5 business days.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="payment">
            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              We accept M-PESA and VISA payments for all orders.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="size">
            <AccordionTrigger>How can I find the right size?</AccordionTrigger>
            <AccordionContent>
              Each product page includes a detailed size guide. If you're still unsure, please contact our customer service team for assistance.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="orders">
            <AccordionTrigger>How can I track my order?</AccordionTrigger>
            <AccordionContent>
              Once your order is dispatched, you'll receive a tracking number via email and SMS that you can use to monitor your delivery status.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </MainLayout>
  );
}
