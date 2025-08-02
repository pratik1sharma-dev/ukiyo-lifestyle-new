import React from 'react';
import { Link } from 'react-router-dom';

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

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onTrackOrder?: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  onViewDetails, 
  onTrackOrder, 
  onCancelOrder 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      case 'partially_refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancelOrder = () => {
    return ['pending', 'confirmed'].includes(order.orderStatus) && 
           order.paymentStatus !== 'refunded';
  };

  const canTrackOrder = () => {
    return ['confirmed', 'processing', 'shipped'].includes(order.orderStatus);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Order #{order.orderNumber}
                </h3>
                <p className="text-sm text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(order.pricing.total)}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Preview */}
      <div className="p-6">
        <div className="space-y-3">
          {order.items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={item.productImage || '/api/placeholder/64/64'}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.productSlug}`}
                  className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate block"
                >
                  {item.productName}
                </Link>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatPrice(item.totalPrice)}
              </div>
            </div>
          ))}
          
          {order.items.length > 2 && (
            <div className="text-sm text-gray-500 text-center py-2">
              +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Delivery to:</span> {order.shippingAddress.city}, {order.shippingAddress.state}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onViewDetails?.(order._id)}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View Details
            </button>
            
            {canTrackOrder() && (
              <button
                onClick={() => onTrackOrder?.(order._id)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Track Order
              </button>
            )}
            
            {canCancelOrder() && (
              <button
                onClick={() => onCancelOrder?.(order._id)}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;