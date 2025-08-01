import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    serviceType: 'general'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      serviceType: 'general'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-cormorant font-bold text-gray-900 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get in touch with our Delhi-based team for product inquiries, order support, 
              or customer service assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-cormorant font-bold text-gray-900 mb-8">
                Get In Touch
              </h2>
              
              <div className="space-y-8">
                {/* Studio Location */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Delhi Studio</h3>
                  <div className="space-y-3">
                    <p className="flex items-start">
                      <svg className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                                             <span>
                         <strong>Ukiyo Lifestyle</strong><br />
                         Customer Service Center<br />
                         New Delhi, Delhi 110001<br />
                         India
                       </span>
                    </p>
                    
                    <p className="flex items-center">
                      <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+91 (11) 4567-8900</span>
                    </p>
                    
                    <p className="flex items-center">
                      <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>hello@ukiyolifestyle.com</span>
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Studio Hours</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>10:00 AM - 8:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Saturday:</span>
                      <span>10:00 AM - 7:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Sunday:</span>
                      <span>11:00 AM - 6:00 PM</span>
                    </p>
                    <p className="text-primary-600 text-sm mt-3">
                      * Private consultations available by appointment
                    </p>
                  </div>
                </div>

                                 {/* Services */}
                 <div>
                   <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Support</h3>
                   <ul className="space-y-2 text-gray-600">
                     <li className="flex items-center">
                       <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                       Product Information & Recommendations
                     </li>
                     <li className="flex items-center">
                       <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                       Order Tracking & Updates
                     </li>
                     <li className="flex items-center">
                       <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                       Returns & Exchanges
                     </li>
                     <li className="flex items-center">
                       <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                       Delivery & Shipping Support
                     </li>
                     <li className="flex items-center">
                       <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                       Payment & Billing Assistance
                     </li>
                   </ul>
                 </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-2xl font-cormorant font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                        Service Interest
                      </label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                                                 <option value="general">General Inquiry</option>
                         <option value="product">Product Information</option>
                         <option value="order">Order Support</option>
                         <option value="shipping">Shipping & Delivery</option>
                         <option value="return">Returns & Exchanges</option>
                         <option value="support">Customer Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Please provide details about your inquiry, project requirements, or any specific questions you have..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-cormorant font-bold text-gray-900 mb-4">
              Our Delhi Operations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Based in Delhi, we serve customers across India with fast shipping and 
              excellent customer service. Our operations center ensures quick order processing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Reach Us</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <div>
                    <strong>By Metro:</strong><br />
                    Rajiv Chowk Metro Station (Blue & Yellow Line)<br />
                    <span className="text-sm">2-minute walk from Exit 7</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-1M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  <div>
                    <strong>By Car:</strong><br />
                    Paid parking available at Palika Bazaar<br />
                    <span className="text-sm">Valet parking service available</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <div>
                    <strong>By Bus:</strong><br />
                    Multiple bus routes to Connaught Place<br />
                    <span className="text-sm">Nearest stop: Connaught Place</span>
                  </div>
                </div>
              </div>

                             <div className="mt-8 p-4 bg-primary-50 rounded-lg">
                 <h4 className="font-semibold text-primary-900 mb-2">Need Help?</h4>
                 <p className="text-primary-800 text-sm">
                   Our customer service team is available to help with product questions, 
                   order tracking, returns, and any other assistance you need. Contact us 
                   via phone, email, or the form above.
                 </p>
               </div>
            </div>
            
            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
              <span className="text-gray-500">Interactive Delhi Map / Google Maps Embed</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-cormorant font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions about our products and services
            </p>
          </div>

          <div className="space-y-8">
                         <div className="border-b border-gray-200 pb-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-3">
                 How can I track my order?
               </h3>
               <p className="text-gray-600">
                 Once your order is shipped, you'll receive a tracking number via email and SMS. 
                 You can also track your order by logging into your account or contacting our 
                 customer service team.
               </p>
             </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What is your delivery area?
              </h3>
              <p className="text-gray-600">
                We deliver across Delhi NCR with same-day delivery available in select areas. 
                We also ship pan-India for most products. Delivery charges vary based on 
                location and product size.
              </p>
            </div>

                         <div className="border-b border-gray-200 pb-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-3">
                 What is your return policy?
               </h3>
               <p className="text-gray-600">
                 We offer a 30-day return policy on most items. Products must be in original 
                 condition with tags attached. Some items like personalized products may have 
                 different return terms. Check our returns page for full details.
               </p>
             </div>

                         <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-3">
                 Do you offer bulk or wholesale pricing?
               </h3>
               <p className="text-gray-600">
                 Yes, we offer special pricing for bulk orders and business customers. 
                 Contact our sales team for volume discounts and corporate pricing. 
                 Minimum order quantities may apply.
               </p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;