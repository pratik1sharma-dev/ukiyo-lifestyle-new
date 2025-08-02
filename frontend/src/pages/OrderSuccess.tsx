import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { paymentApi } from '../services/api';

interface Order {
  _id: string;
  orderNumber: string;
  items: any[];
  shippingAddress: any;
  pricing: {
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
  };
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  timeline: any[];
}

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get data from navigation state
  const { orderNumber, amount } = location.state || {};

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await paymentApi.getOrder(orderId!);
      setOrder(response.data.data.order);
    } catch (error: any) {
      console.error('Failed to fetch order details:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-cormorant font-bold text-gray-900 mb-2">
            Unable to Load Order
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/profile"
            className="btn-primary"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const displayOrder = order || {
    orderNumber: orderNumber || 'Unknown',
    pricing: { total: amount || 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-cormorant font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Order #{displayOrder.orderNumber}
                </h2>
                {order?.createdAt && (
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  ₹{displayOrder.pricing?.total?.toLocaleString() || amount?.toLocaleString()}
                </p>
                {order?.paymentStatus && (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          {order?.items && order.items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <img
                      src={item.productImage || '/images/placeholders/placeholder-image.svg'}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₹{item.totalPrice?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Breakdown */}
          {order?.pricing && (
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{order.pricing.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (GST Inclusive)</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-base font-medium">
                    <span>Total</span>
                    <span>₹{order.pricing.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        {order?.shippingAddress && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="mt-2">
                <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.shippingAddress.email}
              </p>
            </div>
          </div>
        )}

        {/* Order Status Timeline */}
        {order?.timeline && order.timeline.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Order Timeline</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {order.timeline.map((event: any, index: number) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== order.timeline.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {event.message}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {new Date(event.timestamp).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">What's Next?</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• You will receive an order confirmation email shortly</p>
            <p>• We'll notify you when your order is shipped</p>
            <p>• Track your order status in your profile</p>
            <p>• Estimated delivery: 5-7 business days</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/profile"
            className="btn-primary text-center"
          >
            View Order History
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;