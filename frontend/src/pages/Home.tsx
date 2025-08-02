import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store';

const Home: React.FC = () => {
  const { featuredProducts, fetchFeaturedProducts, loading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-cormorant font-bold text-gray-900 mb-6">
              Ukiyo Lifestyle
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover premium lifestyle products that blend modern design with functionality. 
              Curated for the contemporary Delhi lifestyle.
            </p>
            <div className="space-x-4">
              <Link
                to="/products"
                className="btn-primary inline-block"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-cormorant font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked items that represent the best of modern lifestyle design
            </p>
          </div>

          {loading.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : loading.error ? (
            <div className="text-center text-red-600 py-8">
              <p>Error loading products: {loading.error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts && featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 6).map((product) => (
                <div key={product._id} className="group">
                  <Link to={`/products/${product.slug}`}>
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
                      <img
                        src={product.images[0] || '/images/placeholders/placeholder-product.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.shortDescription || product.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No featured products available</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-cormorant font-bold text-gray-900 mb-6">
                About Ukiyo Lifestyle
              </h2>
              <p className="text-gray-600 mb-6">
                Based in the heart of Delhi, Ukiyo Lifestyle brings you carefully curated 
                products that embody the essence of modern living. Our collection focuses 
                on quality, design, and functionality.
              </p>
              <p className="text-gray-600 mb-8">
                From home decor to personal accessories, each item is selected to enhance 
                your daily life with beauty and purpose.
              </p>
              <Link
                to="/about"
                className="btn-primary"
              >
                Our Story
              </Link>
            </div>
            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
              <span className="text-gray-500">About Image Placeholder</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;