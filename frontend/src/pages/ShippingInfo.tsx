import React from 'react';

const ShippingInfo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Information</h1>
          
          {/* Shipping Methods */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Methods</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Standard Shipping</h3>
        <p className="text-gray-600 mb-4">Free shipping on all orders</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Delivery within 5-7 business days</li>
                  <li>• Order tracking available</li>
                  <li>• Signature required for orders above ₹2000</li>
                </ul>
                <p className="text-lg font-semibold text-primary-600 mt-4">₹100</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Express Shipping</h3>
                <p className="text-gray-600 mb-4">Fast delivery for urgent orders</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Delivery within 2-3 business days</li>
                  <li>• Priority handling</li>
                  <li>• Real-time tracking updates</li>
                </ul>
                <p className="text-lg font-semibold text-primary-600 mt-4">₹250</p>
              </div>
            </div>
          </section>

          {/* Delivery Areas */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Delivery Areas</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Metro Cities</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Mumbai</li>
                  <li>• Delhi</li>
                  <li>• Bangalore</li>
                  <li>• Chennai</li>
                  <li>• Kolkata</li>
                  <li>• Hyderabad</li>
                  <li>• Pune</li>
                  <li>• Ahmedabad</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Other Cities</h3>
                <p className="text-gray-600 mb-4">We deliver to most major cities across India. Delivery times may vary based on location.</p>
                <p className="text-sm text-gray-500">For remote areas, additional delivery charges may apply.</p>
              </div>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Tracking</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                Once your order is shipped, you'll receive a tracking number via email and SMS. 
                You can track your order status in real-time through our website or mobile app.
              </p>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-sm font-medium">Order Placed</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-sm font-medium">Processing</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-sm font-medium">Shipped</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <p className="text-sm font-medium">Delivered</p>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Policies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Policies</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-primary-600 pl-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Free Shipping</h3>
        <p className="text-gray-600">All orders qualify for free standard shipping across India.</p>
              </div>
              
              <div className="border-l-4 border-primary-600 pl-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Delivery Time</h3>
                <p className="text-gray-600">Standard delivery takes 5-7 business days. Express delivery takes 2-3 business days.</p>
              </div>
              
              <div className="border-l-4 border-primary-600 pl-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Holiday Delivery</h3>
                <p className="text-gray-600">Delivery times may be extended during holidays and peak seasons.</p>
              </div>
              
              <div className="border-l-4 border-primary-600 pl-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Failed Delivery</h3>
                <p className="text-gray-600">If delivery fails, we'll attempt redelivery up to 2 times before returning the package.</p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Need Help?</h2>
            <div className="bg-primary-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have any questions about shipping or need assistance with your order, 
                please don't hesitate to contact our customer support team.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-800">Email Support:</p>
                  <p className="text-primary-600">support@ukiyo.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Phone Support:</p>
                  <p className="text-primary-600">+91 1800-123-4567</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo; 