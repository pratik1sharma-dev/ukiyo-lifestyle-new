import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProductStore, useCartStore } from '../store';
import type { ProductFilters } from '../types';

const noteFamilies = ['Citrus', 'Floral', 'Woody', 'Oriental'];
const occasions = ['Work', 'Day', 'Night', 'Festive'];
const weathers = ['Summer', 'Monsoon', 'Winter'];

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    category: '',
    search: searchParams.get('search') || '',
    sort: (searchParams.get('sort') as any) || 'popular',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    noteFamily: searchParams.getAll('noteFamily') || [],
    occasion: searchParams.getAll('occasion') || [],
    weather: searchParams.getAll('weather') || [],
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else if (value !== undefined && value !== '' && value !== null) {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  };

  const toggleArrayFilter = (key: 'noteFamily' | 'occasion' | 'weather', value: string) => {
    const current = new Set(filters[key] || []);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    handleFilterChange({ [key]: Array.from(current) } as any);
  };

  const [addToCartStates, setAddToCartStates] = useState<Record<string, {
    isLoading: boolean;
    isSuccess: boolean;
    error: string | null;
  }>>({});

  const handleAddToCart = async (productId: string) => {
    setAddToCartStates(prev => ({
      ...prev,
      [productId]: { isLoading: true, isSuccess: false, error: null }
    }));
    
    try {
      await addToCart(productId, 1);
      setAddToCartStates(prev => ({
        ...prev,
        [productId]: { isLoading: false, isSuccess: true, error: null }
      }));
      setTimeout(() => {
        setAddToCartStates(prev => ({
          ...prev,
          [productId]: { ...prev[productId], isSuccess: false }
        }));
      }, 2000);
    } catch (error: any) {
      setAddToCartStates(prev => ({
        ...prev,
        [productId]: { 
          isLoading: false, 
          isSuccess: false, 
          error: error.message || 'Failed to add product to cart' 
        }
      }));
      setTimeout(() => {
        setAddToCartStates(prev => ({
          ...prev,
          [productId]: { ...prev[productId], error: null }
        }));
      }, 3000);
    }
  };

  const clearFilters = () => {
    const clearedFilters: ProductFilters = { page: 1, limit: 12, sort: 'popular' };
    setFilters(clearedFilters);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-cormorant font-bold text-gray-900 mb-2">Solid Perfumes for Every Day | Alcohol‑Free, Travel‑Friendly</h1>
            <p className="text-gray-600 max-w-3xl">
              Pocket‑friendly solid perfumes designed for Indian weather. Alcohol‑free, 6–8 hr wear. Free shipping and easy returns.
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline btn-sm md:hidden mt-4"
          >
            Filters & Sort
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-72 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  placeholder="Search scents..."
                  className="input-primary"
                />
              </div>

              {/* Note Family */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Note Family</label>
                <div className="flex flex-wrap gap-2">
                  {noteFamilies.map((nf) => (
                    <button
                      key={nf}
                      onClick={() => toggleArrayFilter('noteFamily', nf)}
                      className={`px-3 py-1 rounded-full border text-sm ${filters.noteFamily?.includes(nf) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300'}`}
                    >
                      {nf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Intensity</label>
                <select
                  value={filters.intensity || ''}
                  onChange={(e) => handleFilterChange({ intensity: (e.target.value || undefined) as any })}
                  className="select-primary"
                >
                  <option value="">Any</option>
                  <option value="Subtle">Subtle</option>
                  <option value="Everyday">Everyday</option>
                  <option value="Bold">Bold</option>
                </select>
              </div>

              {/* Occasion */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Occasion</label>
                <div className="flex flex-wrap gap-2">
                  {occasions.map((oc) => (
                    <button
                      key={oc}
                      onClick={() => toggleArrayFilter('occasion', oc)}
                      className={`px-3 py-1 rounded-full border text-sm ${filters.occasion?.includes(oc) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300'}`}
                    >
                      {oc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Weather</label>
                <div className="flex flex-wrap gap-2">
                  {weathers.map((w) => (
                    <button
                      key={w}
                      onClick={() => toggleArrayFilter('weather', w)}
                      className={`px-3 py-1 rounded-full border text-sm ${filters.weather?.includes(w) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300'}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Min"
                    className="input-primary"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Max"
                    className="input-primary"
                  />
                </div>
              </div>

              {/* In Stock */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock === true}
                    onChange={(e) => handleFilterChange({ inStock: e.target.checked ? true : undefined })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="btn-ghost btn-sm w-full"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex items-center justify-end mb-4">
              <label className="text-sm text-gray-700 mr-2">Sort by:</label>
              <select
                value={filters.sort || 'popular'}
                onChange={(e) => handleFilterChange({ sort: e.target.value as any })}
                className="select-primary"
              >
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Grid */}
            {loading.isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse h-72"></div>
                ))}
              </div>
            ) : loading.error ? (
              <div className="text-center text-red-600 py-8">
                <p>Error loading products: {loading.error}</p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="card card-hover group p-4 flex flex-col">
                    <Link to={`/products/${product.slug}`} className="block">
                      <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
                        <img
                          src={product.images[0] || '/images/placeholders/placeholder-product.svg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        {product.rating !== undefined && (
                          <span className="text-xs text-gray-600">⭐ {product.rating?.toFixed(1) || '4.5'}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-700">
                        {product.noteFamily || product.scentProfile?.[0] ? (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100">{product.noteFamily || product.scentProfile?.[0]}</span>
                        ) : null}
                        {product.strength || product.intensity ? (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100">{product.strength || product.intensity}</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100">Everyday</span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-gray-100">{product.tinSizeGrams ? `${product.tinSizeGrams}g` : '10g'}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.shortDescription || product.description}
                      </p>
                    </Link>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                        {product.comparePrice && (
                          <span className="text-sm text-gray-500 line-through">₹{product.comparePrice.toLocaleString()}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={addToCartStates[product._id]?.isLoading}
                        className="btn-primary btn-sm"
                      >
                        {addToCartStates[product._id]?.isLoading ? 'Adding…' : 'Quick Add'}
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <span>Lasts {product.wearDuration || '6–8 hrs'} • Pocket‑friendly {product.tinSizeGrams ? `${product.tinSizeGrams}g` : '10g'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 mb-4">No match? Try our Discovery Kit or the Scent Quiz.</p>
                <div className="flex items-center justify-center gap-3">
                  <Link to="/discovery-kit" className="btn-outline btn-sm">Discovery Kit</Link>
                  <Link to="/quiz" className="btn-secondary btn-sm">Scent Quiz</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;