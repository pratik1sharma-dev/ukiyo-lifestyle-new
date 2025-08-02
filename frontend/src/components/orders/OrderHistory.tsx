import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from './OrderCard';
import { paymentApi } from '../../services/api';

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    product: string;
    productName: string;
    productSlug: string;
    productImage: string;
    quantity: number;
    price: number;
    discountPrice?: number;
    totalPrice: number;
  }>;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  paymentMethod: string;
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface OrderHistoryProps {
  className?: string;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const fetchOrders = async (page = 1, status = '') => {
    try {
      setLoading(true);
      setError('');
      
      const response = await paymentApi.getOrders(page, 10, status || undefined);
      
      if (response.data.success) {
        setOrders(response.data.data.orders);
        setCurrentPage(response.data.data.pagination.page);
        setTotalPages(response.data.data.pagination.pages);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, statusFilter);
  }, [statusFilter]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchOrders(page, statusFilter);
    }
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const handleTrackOrder = (orderId: string) => {
    navigate(`/orders/${orderId}/track`);
  };

  const handleCancelOrder = (orderId: string) => {
    setShowCancelModal(orderId);
  };

  const confirmCancelOrder = async (orderId: string, reason: string) => {
    try {
      // API call to cancel order would go here
      console.log('Cancelling order:', orderId, 'Reason:', reason);
      
      // Refresh orders after cancellation
      fetchOrders(currentPage, statusFilter);
      setShowCancelModal(null);
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-3 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex justify-center">
            <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-red-900">Failed to load orders</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            onClick={() => fetchOrders(currentPage, statusFilter)}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {statusFilter ? `No ${statusFilter} orders` : 'No orders yet'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {statusFilter 
            ? `You don't have any ${statusFilter} orders.`
            : 'Start shopping to see your orders here.'
          }
        </p>
        <div className="mt-6">
          <button 
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-cormorant font-bold text-gray-900">
            Order History
          </h2>
          <span className="text-sm text-gray-500">
            ({orders.length} order{orders.length !== 1 ? 's' : ''})
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => fetchOrders(currentPage, statusFilter)}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Refresh"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onViewDetails={handleViewDetails}
            onTrackOrder={handleTrackOrder}
            onCancelOrder={handleCancelOrder}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const page = Math.max(1, currentPage - 2) + index;
              if (page > totalPages) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <CancelOrderModal
          orderId={showCancelModal}
          onConfirm={confirmCancelOrder}
          onCancel={() => setShowCancelModal(null)}
        />
      )}
    </div>
  );
};

// Cancel Order Modal Component
interface CancelOrderModalProps {
  orderId: string;
  onConfirm: (orderId: string, reason: string) => void;
  onCancel: () => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ orderId, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const reasons = [
    'Changed my mind',
    'Found a better price elsewhere',
    'Ordered by mistake',
    'Product no longer needed',
    'Delivery time too long',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reason === 'Other' ? customReason : reason;
    if (finalReason.trim()) {
      onConfirm(orderId, finalReason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Order</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for cancellation
            </label>
            <div className="space-y-2">
              {reasons.map((reasonOption) => (
                <label key={reasonOption} className="flex items-center">
                  <input
                    type="radio"
                    name="reason"
                    value={reasonOption}
                    checked={reason === reasonOption}
                    onChange={(e) => setReason(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{reasonOption}</span>
                </label>
              ))}
            </div>
          </div>
          
          {reason === 'Other' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please specify
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your reason..."
                required
              />
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Keep Order
            </button>
            <button
              type="submit"
              disabled={!reason || (reason === 'Other' && !customReason.trim())}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderHistory;