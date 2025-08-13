import React from 'react';
import { Link } from 'react-router-dom';

const Bundles: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-gray-900 mb-4">Bundles</h1>
        <p className="text-gray-700 mb-6 max-w-2xl">
          Build your duo or trio and save more. Layer complementary notes for a signature that’s uniquely yours.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
          <li>Duo: Save 10%</li>
          <li>Trio: Save 15%</li>
          <li>Perfect for gifting and travel</li>
        </ul>
        <Link to="/products" className="btn-primary">Start Building</Link>
      </div>
    </div>
  );
};

export default Bundles;