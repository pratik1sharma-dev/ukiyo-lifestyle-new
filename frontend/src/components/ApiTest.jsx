import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { utilService } from '../services/api';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';

const ApiTest = () => {
  const [connectionStatus, setConnectionStatus] = useState({ status: 'testing', message: '' });
  const [testResults, setTestResults] = useState({});

  const {
    // State
    loading,
    errors,
    products,
    categories,
    cart,
    
    // Actions
    fetchProducts,
    fetchFeaturedProducts,
    fetchCategories,
    fetchCart,
    addToCart,
    clearError,
  } = useStore();

  // Test API connection
  const testConnection = async () => {
    setConnectionStatus({ status: 'testing', message: 'Testing connection...' });
    
    try {
      const result = await utilService.testConnection();
      if (result.success) {
        setConnectionStatus({ 
          status: 'success', 
          message: 'Backend connection successful!' 
        });
      } else {
        setConnectionStatus({ 
          status: 'error', 
          message: 'Backend connection failed: ' + result.error?.message 
        });
      }
    } catch (error) {
      setConnectionStatus({ 
        status: 'error', 
        message: 'Backend connection failed: ' + error.message 
      });
    }
  };

  // Test individual endpoints
  const testEndpoint = async (name, testFunction) => {
    setTestResults(prev => ({ ...prev, [name]: { status: 'testing', data: null, error: null } }));
    
    try {
      const result = await testFunction();
      setTestResults(prev => ({ 
        ...prev, 
        [name]: { status: 'success', data: result, error: null } 
      }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [name]: { status: 'error', data: null, error: error.message } 
      }));
    }
  };

  // Test all endpoints
  const runAllTests = async () => {
    await testConnection();
    
    // Test products
    await testEndpoint('products', () => fetchProducts());
    await testEndpoint('featuredProducts', () => fetchFeaturedProducts());
    
    // Test categories
    await testEndpoint('categories', () => fetchCategories());
    
    // Test cart
    await testEndpoint('cart', () => fetchCart());
  };

  // Auto-run tests on component mount
  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'testing': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'testing': return '⏳';
      default: return '⚪';
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Connection Test</h1>
        
        {/* Connection Status */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Backend Connection</h2>
          <div className="flex items-center space-x-3">
            <span className={getStatusColor(connectionStatus.status)}>
              {getStatusIcon(connectionStatus.status)}
            </span>
            <span className={getStatusColor(connectionStatus.status)}>
              {connectionStatus.message}
            </span>
            {connectionStatus.status === 'testing' && <LoadingSpinner size="sm" />}
          </div>
          <div className="mt-4">
            <button
              onClick={testConnection}
              className="btn-primary"
              disabled={connectionStatus.status === 'testing'}
            >
              Test Connection
            </button>
          </div>
        </div>

        {/* API Endpoints Tests */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
          <div className="space-y-4">
            {Object.entries(testResults).map(([name, result]) => (
              <div key={name} className="border-l-4 border-gray-200 pl-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={getStatusColor(result.status)}>
                      {getStatusIcon(result.status)}
                    </span>
                    <span className="font-medium capitalize">{name.replace(/([A-Z])/g, ' $1')}</span>
                    {result.status === 'testing' && <LoadingSpinner size="sm" />}
                  </div>
                  {result.data && (
                    <span className="text-sm text-gray-500">
                      {Array.isArray(result.data?.data) ? `${result.data.data.length} items` : 'Success'}
                    </span>
                  )}
                </div>
                {result.error && (
                  <div className="mt-2">
                    <ErrorMessage 
                      message={result.error} 
                      onRetry={() => testEndpoint(name, () => {
                        switch(name) {
                          case 'products': return fetchProducts();
                          case 'featuredProducts': return fetchFeaturedProducts();
                          case 'categories': return fetchCategories();
                          case 'cart': return fetchCart();
                          default: return Promise.resolve();
                        }
                      })}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={runAllTests}
              className="btn-primary mr-4"
            >
              Run All Tests
            </button>
          </div>
        </div>

        {/* Data Display */}
        {products.items.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Products ({products.items.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.items.slice(0, 6).map((product) => (
                <div key={product._id} className="border rounded-lg p-4">
                  <img 
                    src={product.images?.[0] || '/placeholder.jpg'} 
                    alt={product.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="font-medium text-sm">{product.name}</h3>
                  <p className="text-primary-600 font-semibold">₹{product.price.toLocaleString('en-IN')}</p>
                  <button
                    onClick={() => addToCart(product._id, 1)}
                    className="btn-primary text-xs mt-2 w-full"
                    disabled={loading.cart}
                  >
                    {loading.cart ? <LoadingSpinner size="sm" /> : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {categories.items.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Categories ({categories.items.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.items.map((category) => (
                <div key={category._id} className="text-center">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.slug}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart Display */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">
            Cart ({cart.totalItems} items)
          </h2>
          {cart.items.length > 0 ? (
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-medium">{item.product?.name || 'Product'}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(item.totalPrice || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-primary-600">
                  ₹{cart.totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Cart is empty</p>
          )}
          
          {errors.cart && (
            <div className="mt-4">
              <ErrorMessage 
                message={errors.cart} 
                onRetry={() => fetchCart()}
                onDismiss={() => clearError('cart')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTest;