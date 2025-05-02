
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { GoogleMapComponent } from "@/components/contact/GoogleMap";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here we would typically send the form data to a server
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or need assistance? We're here to help!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-kenya-red" />
                <div>
                  <h3 className="font-semibold">Email Us</h3>
                  <a 
                    href="mailto:info@starstarzfashions.com" 
                    className="text-muted-foreground hover:text-kenya-red transition-colors"
                  >
                    info@starstarzfashions.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-kenya-red" />
                <div>
                  <h3 className="font-semibold">Call Us</h3>
                  <div>
                    <a 
                      href="tel:0745025502" 
                      className="block text-muted-foreground hover:text-kenya-red transition-colors"
                    >
                      0745 02 55 02
                    </a>
                    <a 
                      href="tel:0722430359" 
                      className="block text-muted-foreground hover:text-kenya-red transition-colors"
                    >
                      0722 430 359
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-kenya-red" />
                <div>
                  <h3 className="font-semibold">Visit Us</h3>
                  <p className="text-muted-foreground">
                    Akai Plaza Ground Floor,<br />
                    Office No 2 At Rosters<br />
                    Off Thika Superhighway Next to Mountain Mall
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-6 w-6 text-kenya-red" />
                <div>
                  <h3 className="font-semibold">Working Hours</h3>
                  <p className="text-muted-foreground">
                    Open: 8:00AM – Close: 18:00PM<br />
                    Saturday – Sunday: Closed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Facebook className="h-6 w-6 text-kenya-red" />
                <div>
                  <h3 className="font-semibold">Follow Us</h3>
                  <a 
                    href="https://www.facebook.com/starstarzltd/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-kenya-red transition-colors"
                  >
                    facebook.com/starstarzltd
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">Our Location</h2>
              <div className="h-[300px] w-full rounded-lg overflow-hidden">
                <GoogleMapComponent />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <Input 
                  id="name" 
                  required 
                  placeholder="Your name" 
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input 
                  id="subject" 
                  required 
                  placeholder="Message subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  required 
                  placeholder="Your message"
                  className="min-h-[150px]"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-kenya-red hover:bg-kenya-red/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending Message..." : "Send Message"}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground mt-6">
                Thank you for reaching out to Star Starz Fashions! 
                We'll respond to your inquiry as soon as possible.
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
