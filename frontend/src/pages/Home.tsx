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
      {/* Hero Section - Solid Perfumes */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-cormorant font-bold text-gray-900 mb-4 md:mb-6">
              Elevate Your Everyday Scent
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Alcohol‑free solid perfumes made in India. Pocket‑friendly, spill‑proof, travel‑ready.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                to="/products"
                className="btn-primary w-full sm:w-auto"
              >
                Shop Solid Perfumes
              </Link>
              <Link
                to="/bundles"
                className="btn-outline w-full sm:w-auto"
              >
                Build Your Duo & Save 10%
              </Link>
            </div>
            {/* USPs Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-700">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white shadow-sm">Alcohol‑Free</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white shadow-sm">6–8 Hour Wear</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white shadow-sm">Skin‑Safe</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white shadow-sm">Travel‑Friendly</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white shadow-sm">Made in India</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof + Discovery Strip */}
      <section className="bg-white py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-900 font-medium">Loved by 25,000+ customers</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full">“Lasts through my workday”</span>
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full">“Perfect for travel”</span>
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full">“Subtle, skin‑safe scent”</span>
              </div>
            </div>
            <Link to="/quiz" className="btn-secondary w-full md:w-auto">
              Take the 60‑Second Scent Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-cormorant font-bold text-gray-900 mb-4">
              Featured Solid Perfumes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked blends designed for Indian weather—alcohol‑free, skin‑safe, and travel‑friendly.
            </p>
          </div>

          {loading.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading-spinner h-12 w-12"></div>
            </div>
          ) : loading.error ? (
            <div className="text-center text-red-600 py-8">
              <p>Error loading products: {loading.error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts && featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 6).map((product) => (
                <div key={product._id} className="card card-hover group">
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
              Shop Solid Perfumes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;