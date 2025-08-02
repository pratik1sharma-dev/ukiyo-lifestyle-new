import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminApi } from '../../services/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  stock: string;
  lowStockThreshold: string;
  tags: string;
  specifications: string;
}

const AdminProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    isActive: true,
    isFeatured: false,
    stock: '',
    lowStockThreshold: '5',
    tags: '',
    specifications: ''
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing && id) {
      fetchProduct(id);
    }
  }, [id, isEditing]);

  const fetchCategories = async () => {
    try {
      const response = await adminApi.getCategories();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await adminApi.getProduct(productId);
      const product = response.data.data.product;
      
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          discountPrice: product.discountPrice?.toString() || '',
          category: product.category._id || '',
          isActive: product.isActive ?? true,
          isFeatured: product.isFeatured ?? false,
          stock: product.inventory?.stock?.toString() || '',
          lowStockThreshold: product.inventory?.lowStockThreshold?.toString() || '5',
          tags: product.tags?.join(', ') || '',
          specifications: product.specifications ? JSON.stringify(product.specifications, null, 2) : ''
        });
        setExistingImages(product.images || []);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image files must be less than 5MB');
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return false;
      }
      return true;
    });

    setImageFiles(prev => [...prev, ...validFiles]);
    setError('');
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
    setImagesToRemove(prev => [...prev, imageUrl]);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Product description is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (formData.discountPrice && parseFloat(formData.discountPrice) >= parseFloat(formData.price)) {
      setError('Discount price must be less than regular price');
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError('Valid stock quantity is required');
      return false;
    }

    // Validate specifications JSON if provided
    if (formData.specifications.trim()) {
      try {
        JSON.parse(formData.specifications);
      } catch {
        setError('Specifications must be valid JSON format');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const submitData = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'isActive' || key === 'isFeatured') {
          submitData.append(key, value.toString());
        } else {
          submitData.append(key, value);
        }
      });

      // Add new images
      imageFiles.forEach(file => {
        submitData.append('images', file);
      });

      // Add images to remove (for editing)
      if (isEditing && imagesToRemove.length > 0) {
        submitData.append('removeImages', JSON.stringify(imagesToRemove));
      }

      if (isEditing && id) {
        await adminApi.updateProduct(id, submitData);
      } else {
        await adminApi.createProduct(submitData);
      }

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Failed to save product:', error);
      setError(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center space-x-2">
                <Link to="/admin/products" className="text-gray-500 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </Link>
                <h1 className="text-2xl font-cormorant font-bold text-gray-900">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h1>
              </div>
              <p className="text-gray-600">
                {isEditing ? 'Update product information' : 'Create a new product listing'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="lifestyle, modern, premium"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Price (₹)
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Inventory</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Product Images</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images (Max 5MB each)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Select multiple images. Supported formats: JPG, PNG, GIF
                </p>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Product ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(imageUrl)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Preview */}
              {imageFiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">New Images</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active (visible to customers)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Featured Product
                </label>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Specifications (Optional)</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Specifications (JSON format)
              </label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                placeholder='{"material": "Cotton", "dimensions": "120x80cm", "weight": "2kg"}'
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter product specifications in JSON format. Leave empty if not needed.
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/admin/products"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEditing ? 'Update Product' : 'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;