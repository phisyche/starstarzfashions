
export function WhyChooseUs() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-kenya-green/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-kenya-green"
              >
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Authentic Designs</h3>
            <p className="text-gray-600">
              We work directly with local artisans and designers to bring you authentic Kenyan fashion with rich cultural heritage.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-kenya-red/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-kenya-red"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 15h0M2 9.5h20" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Multiple Payment Options</h3>
            <p className="text-gray-600">
              We offer convenient payment methods including M-Pesa and Visa for hassle-free shopping.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-teal/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-accent-teal"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M21 12H3M12 3v18" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Nationwide Delivery</h3>
            <p className="text-gray-600">
              We deliver to all major cities and towns across Kenya, with fast shipping and real-time tracking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
