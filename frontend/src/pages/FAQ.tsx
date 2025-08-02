import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    // General Questions
    {
      question: "What is Ukiyo Lifestyle?",
      answer: "Ukiyo Lifestyle is an online lifestyle store offering curated products for modern living. We focus on quality, sustainability, and unique designs that enhance your daily life.",
      category: "general"
    },
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking the 'Sign Up' button in the header. Simply provide your email, name, and create a password. You can also sign up during checkout.",
      category: "general"
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take your privacy seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your consent.",
      category: "general"
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship within India only. We're working on expanding our shipping to other countries soon.",
      category: "general"
    },

    // Ordering
    {
      question: "How do I place an order?",
      answer: "Browse our products, add items to your cart, and proceed to checkout. Fill in your shipping details, select payment method, and confirm your order.",
      category: "ordering"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay. We also offer Cash on Delivery.",
      category: "ordering"
    },
    {
      question: "Can I modify or cancel my order?",
      answer: "You can modify or cancel your order within 1 hour of placing it. After that, the order goes into processing and cannot be changed. Contact our support team for assistance.",
      category: "ordering"
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your order in your account under 'My Orders'.",
      category: "ordering"
    },

    // Shipping
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days, while express shipping takes 2-3 business days. Delivery times may vary based on your location.",
      category: "shipping"
    },
    {
          question: "Do you offer free shipping?",
    answer: "Yes, we offer free shipping on all orders. No minimum order value required.",
      category: "shipping"
    },
    {
      question: "What if my package is damaged during delivery?",
      answer: "If your package arrives damaged, please take photos and contact us immediately. We'll arrange a replacement or refund at no additional cost.",
      category: "shipping"
    },
    {
      question: "Can I change my shipping address after placing an order?",
      answer: "You can change your shipping address within 1 hour of placing the order. After that, contact our support team and we'll try to accommodate the change if the order hasn't been shipped.",
      category: "shipping"
    },

    // Returns & Refunds
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be unused and in original condition with all tags and packaging intact.",
      category: "returns"
    },
    {
      question: "How do I return an item?",
      answer: "Log into your account, go to 'My Orders', select the order you want to return, and follow the return process. We'll provide a prepaid shipping label.",
      category: "returns"
    },
    {
      question: "How long does it take to process a refund?",
      answer: "Refunds are processed within 7 business days after we receive your return. The time to appear in your account depends on your bank or payment provider.",
      category: "returns"
    },
    {
      question: "Are there any items that cannot be returned?",
      answer: "Personal care items, sale/discounted items (unless defective), and custom-made products cannot be returned for hygiene and quality reasons.",
      category: "returns"
    },

    // Product Information
    {
      question: "Are your products authentic?",
      answer: "Yes, all our products are 100% authentic. We source directly from authorized manufacturers and distributors to ensure quality and authenticity.",
      category: "products"
    },
    {
      question: "Do you offer size guides?",
      answer: "Yes, we provide detailed size guides for clothing and footwear. You can find them on individual product pages or in our size guide section.",
      category: "products"
    },
    {
      question: "What if a product is out of stock?",
      answer: "If a product is out of stock, you can join the waitlist to be notified when it's back in stock. We'll send you an email notification.",
      category: "products"
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes, we offer gift wrapping for an additional ₹50. You can select this option during checkout.",
      category: "products"
    }
  ];

  const categories = [
    { id: 'general', name: 'General', count: faqData.filter(item => item.category === 'general').length },
    { id: 'ordering', name: 'Ordering', count: faqData.filter(item => item.category === 'ordering').length },
    { id: 'shipping', name: 'Shipping', count: faqData.filter(item => item.category === 'shipping').length },
    { id: 'returns', name: 'Returns & Refunds', count: faqData.filter(item => item.category === 'returns').length },
    { id: 'products', name: 'Products', count: faqData.filter(item => item.category === 'products').length }
  ];

  const filteredFAQs = faqData.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
          
          {/* Category Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-primary-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Still Have Questions?</h2>
            <p className="text-gray-700 mb-4">
              Can't find the answer you're looking for? Our customer support team is here to help.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-medium text-gray-800">Email Support</p>
                <p className="text-primary-600">support@ukiyo.com</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-800">Phone Support</p>
                <p className="text-primary-600">+91 1800-123-4567</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-800">Live Chat</p>
                <p className="text-primary-600">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 