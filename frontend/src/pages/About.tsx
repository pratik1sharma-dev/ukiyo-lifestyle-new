import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-cormorant font-bold text-gray-900 mb-6">
              About Ukiyo Lifestyle
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Curating premium lifestyle products for modern living. Based in Delhi, 
              we bring you carefully selected items that blend style, quality, and functionality.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-cormorant font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Founded in Delhi in 2020, Ukiyo Lifestyle emerged from a passion for 
                  beautiful, functional products that enhance everyday living. We started 
                  with a simple mission: to make premium lifestyle products accessible 
                  to modern Indian homes.
                </p>
                <p>
                  The name "Ukiyo" comes from the Japanese concept meaning "living in the moment" 
                  and "the floating world." We believe that your home should be a sanctuary 
                  filled with objects that bring joy, comfort, and inspiration to your daily life.
                </p>
                <p>
                  From our base in Delhi, we carefully curate products from trusted brands 
                  and artisans across India and around the world. Each item in our collection 
                  is chosen for its quality, design, and ability to transform living spaces.
                </p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg aspect-square lg:aspect-auto lg:h-96 flex items-center justify-center">
              <span className="text-gray-500">Lifestyle Products Showcase</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-cormorant font-bold text-gray-900 mb-4">
              Why Choose Ukiyo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're more than just an online store. We're your partners in creating 
              a lifestyle that reflects your personality and values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Assured</h3>
              <p className="text-gray-600">
                Every product is carefully tested and verified for quality. We stand behind 
                everything we sell with comprehensive warranties and return policies.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Curated Selection</h3>
              <p className="text-gray-600">
                Our team handpicks each product based on design, functionality, and value. 
                No overwhelming choices - just the best options for your lifestyle.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick delivery across Delhi NCR and India. Same-day delivery available 
                in select Delhi areas. Your lifestyle upgrade is just a click away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-cormorant font-bold text-gray-900 mb-4">
              Our Product Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections designed to enhance every aspect of your lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                <svg className="w-10 h-10 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Home & Living</h3>
              <p className="text-gray-600 text-sm">Furniture, decor, and essentials for beautiful living spaces</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                <svg className="w-10 h-10 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Beauty & Wellness</h3>
              <p className="text-gray-600 text-sm">Self-care products and wellness essentials for mind and body</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                <svg className="w-10 h-10 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kitchen & Dining</h3>
              <p className="text-gray-600 text-sm">Cookware, tableware, and appliances for culinary enthusiasts</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                <svg className="w-10 h-10 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fashion & Accessories</h3>
              <p className="text-gray-600 text-sm">Stylish accessories and fashion items for the modern lifestyle</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-cormorant font-bold text-gray-900 mb-6">
                Based in Delhi, Serving India
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our headquarters and main warehouse are located in Delhi, allowing us to 
                  provide fast delivery across the NCR region and efficient shipping 
                  throughout India.
                </p>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <svg className="w-5 h-5 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    New Delhi, India
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Customer Support: 10 AM - 8 PM
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    hello@ukiyolifestyle.com
                  </p>
                </div>
                <div className="pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Information</h4>
                  <div className="text-sm space-y-1">
                    <p>• Same-day delivery in select Delhi areas</p>
                    <p>• 1-2 days delivery across Delhi NCR</p>
                    <p>• 3-7 days delivery across India</p>
                    <p>• Free shipping on orders above ₹999</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
              <span className="text-gray-500">Delhi Warehouse & Operations</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-cormorant font-bold text-white mb-4">
            Ready to Upgrade Your Lifestyle?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Explore our curated collection of premium lifestyle products. From home essentials 
            to wellness products, find everything you need to live beautifully.
          </p>
          <div className="space-x-4">
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              to="/contact"
              className="inline-block px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors"
            >
              Get Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;