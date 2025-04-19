
import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Kenyan<span className="text-kenya-red">Fashion</span></h3>
          <p className="text-gray-300 mb-4">
            Authentic Kenyan fashion delivered to your doorstep. 
            Showcasing the best of local designers and cultural heritage.
          </p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
              <span className="sr-only">Facebook</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/shop" className="text-gray-300 hover:text-white transition-colors">Shop</Link>
            </li>
            <li>
              <Link to="/collections" className="text-gray-300 hover:text-white transition-colors">Collections</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/shipping-policy" className="text-gray-300 hover:text-white transition-colors">Shipping Policy</Link>
            </li>
            <li>
              <Link to="/returns" className="text-gray-300 hover:text-white transition-colors">Returns & Exchanges</Link>
            </li>
            <li>
              <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
          <address className="not-italic text-gray-300">
            <p className="mb-2">Nairobi, Kenya</p>
            <p className="mb-2">
              <a href="mailto:info@kenyanfashion.com" className="hover:text-white transition-colors">
                info@kenyanfashion.com
              </a>
            </p>
            <p className="mb-2">
              <a href="tel:+254712345678" className="hover:text-white transition-colors">
                +254 712 345 678
              </a>
            </p>
          </address>
          <div className="mt-4">
            <h5 className="font-medium mb-2">Payment Methods</h5>
            <div className="flex items-center space-x-3">
              <span className="bg-white text-xs rounded px-2 py-1 font-medium text-black">M-PESA</span>
              <span className="bg-white text-xs rounded px-2 py-1 font-medium text-black">VISA</span>
              <span className="bg-white text-xs rounded px-2 py-1 font-medium text-black">MASTERCARD</span>
              <span className="bg-white text-xs rounded px-2 py-1 font-medium text-black">AIRTEL</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-10 pt-6 container">
        <p className="text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} KenyanFashion. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
