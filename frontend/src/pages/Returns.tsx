import React from 'react';

const Returns: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Returns & Refunds</h1>
          
          {/* Return Policy Overview */}
          <section className="mb-12">
            <div className="bg-primary-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Return Policy</h2>
              <p className="text-gray-700 mb-4">
                We want you to be completely satisfied with your purchase. If you're not happy with your order, 
                we offer a hassle-free return process within 30 days of delivery.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary-600 mb-2">30 Days</div>
                  <p className="text-sm text-gray-600">Return Window</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary-600 mb-2">Free</div>
                  <p className="text-sm text-gray-600">Return Shipping</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary-600 mb-2">7 Days</div>
                  <p className="text-sm text-gray-600">Refund Processing</p>
                </div>
              </div>
            </div>
          </section>

          {/* Return Process */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">How to Return</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Initiate Return</h3>
                    <p className="text-gray-600 text-sm">
                      Log into your account and go to "My Orders". Select the order you want to return 
                      and click "Return Item".
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Select Reason</h3>
                    <p className="text-gray-600 text-sm">
                      Choose the reason for return from the dropdown menu and provide any additional details.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Print Label</h3>
                    <p className="text-gray-600 text-sm">
                      Download and print the return shipping label. Pack your item securely with the label attached.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Ship Back</h3>
                    <p className="text-gray-600 text-sm">
                      Drop off your package at any authorized courier location or schedule a pickup.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-800 mb-4">Return Requirements</h3>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Item must be unused and in original condition
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Original packaging and tags intact
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Return within 30 days of delivery
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Valid return reason provided
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Personal care items (for hygiene reasons)
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    Sale/discounted items (unless defective)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refund Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Refund Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Refund Timeline</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Return Received</span>
                    <span className="font-medium">Day 1</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Quality Check</span>
                    <span className="font-medium">Day 2-3</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600">Refund Processed</span>
                    <span className="font-medium">Day 4-5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Refund Received</span>
                    <span className="font-medium">Day 5-7</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Refund Methods</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Original Payment Method</h4>
                    <p className="text-sm text-gray-600">
                      Refunds are processed to the same payment method used for the original purchase.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Store Credit</h4>
                    <p className="text-sm text-gray-600">
                      You can choose to receive store credit for future purchases with additional 10% bonus.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Common Return Reasons */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Common Return Reasons</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-800 mb-3">Size Issues</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Item doesn't fit as expected or size chart was unclear.
                </p>
                <p className="text-xs text-gray-500">Solution: Check our detailed size guide before ordering.</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-800 mb-3">Quality Concerns</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Product quality doesn't meet expectations or has defects.
                </p>
                <p className="text-xs text-gray-500">Solution: Contact us immediately for quality issues.</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-800 mb-3">Wrong Item</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Received different item than what was ordered.
                </p>
                <p className="text-xs text-gray-500">Solution: We'll arrange free pickup and correct item.</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-800 mb-3">Changed Mind</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Simply changed your mind about the purchase.
                </p>
                <p className="text-xs text-gray-500">Solution: Return within 30 days for full refund.</p>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Need Help with Returns?</h2>
            <div className="bg-primary-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Our customer support team is here to help you with any questions about returns, 
                refunds, or exchanges.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="font-medium text-gray-800">Email Support</p>
                  <p className="text-primary-600">returns@ukiyo.com</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-800">Phone Support</p>
                  <p className="text-primary-600">+91 1800-123-4567</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-800">Live Chat</p>
                  <p className="text-primary-600">Available 24/7</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Returns; 