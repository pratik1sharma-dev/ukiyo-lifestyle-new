import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { paymentApi } from '../services/api';

interface OrderItem {
  product: string;
  productName: string;
  productSlug: string;
  productImage: string;
  quantity: number;
  price: number;
  discountPrice?: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  paymentMethod: string;
  paymentDetails?: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    transactionId?: string;
  };
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
    email: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await paymentApi.getOrder(id);
      
      if (response.data.success) {
        setOrder(response.data.data.order);
      } else {
        setError('Order not found');
      }
    } catch (err: any) {
      console.error('Error fetching order:', err);
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'partially_refunded':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-red-900">Order not found</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/profile?tab=orders')}
                  className="btn-primary"
                >
                  Back to Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/profile?tab=orders" className="hover:text-primary-600">
              Orders
            </Link>
            <span>›</span>
            <span className="text-gray-900">Order #{order.orderNumber}</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-cormorant font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={item.productImage || '/api/placeholder/80/80'}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.productSlug}`}
                        className="text-lg font-medium text-gray-900 hover:text-primary-600 block truncate"
                      >
                        {item.productName}
                      </Link>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Quantity: {item.quantity}</span>
                        <span>Price: {formatPrice(item.price)}</span>
                        {item.discountPrice && (
                          <span className="text-green-600">
                            Discount: {formatPrice(item.price - item.discountPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-lg font-medium text-gray-900">
                      {formatPrice(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                <p className="mt-2">
                  <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {order.shippingAddress.email}
                </p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{order.paymentMethod}</span>
                </div>
                
                {order.paymentDetails?.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium font-mono text-sm">
                      {order.paymentDetails.razorpayPaymentId}
                    </span>
                  </div>
                )}
                
                {order.paymentDetails?.razorpayOrderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium font-mono text-sm">
                      {order.paymentDetails.razorpayOrderId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatPrice(order.pricing.subtotal)}</span>
                </div>
                
                {order.pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatPrice(order.pricing.discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>
                    {order.pricing.shipping === 0 ? 'Free' : formatPrice(order.pricing.shipping)}
                  </span>
                </div>
                
                {order.pricing.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span>{formatPrice(order.pricing.tax)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total:</span>
                    <span>{formatPrice(order.pricing.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
              
              <div className="space-y-3">
                {['confirmed', 'processing', 'shipped'].includes(order.orderStatus) && (
                  <button
                    onClick={() => navigate(`/orders/${order._id}/track`)}
                    className="w-full btn-primary"
                  >
                    Track Order
                  </button>
                )}
                
                {['pending', 'confirmed'].includes(order.orderStatus) && order.paymentStatus !== 'refunded' && (
                  <button
                    onClick={() => {
                      // Handle cancel order
                      console.log('Cancel order:', order._id);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                  >
                    Cancel Order
                  </button>
                )}
                
                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
                >
                  Print Order
                </button>
                
                <Link
                  to="/support"
                  className="w-full px-4 py-2 text-sm font-medium text-center text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 block"
                >
                  Need Help?
                </Link>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Status</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                {order.orderStatus !== 'pending' && (
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                      <p className="text-xs text-gray-500">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                )}
                
                {['processing', 'shipped', 'delivered'].includes(order.orderStatus) && (
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                      order.orderStatus === 'processing' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Processing</p>
                      <p className="text-xs text-gray-500">Your order is being prepared</p>
                    </div>
                  </div>
                )}
                
                {['shipped', 'delivered'].includes(order.orderStatus) && (
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                      order.orderStatus === 'shipped' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Shipped</p>
                      <p className="text-xs text-gray-500">Your order is on the way</p>
                    </div>
                  </div>
                )}
                
                {order.orderStatus === 'delivered' && (
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Delivered</p>
                      <p className="text-xs text-gray-500">Order delivered successfully</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;