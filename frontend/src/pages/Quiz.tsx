import React from 'react';
import { Link } from 'react-router-dom';

const Quiz: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-gray-900 mb-4">Find Your Scent in 60 Seconds</h1>
        <p className="text-gray-700 mb-8">
          Answer a few quick questions and we’ll recommend 2–3 solid perfumes that fit your vibe and weather.
        </p>
        <div className="flex gap-3">
          <Link to="/products?sort=popular" className="btn-outline">Skip to Best Sellers</Link>
          <button className="btn-primary">Start Quiz</button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;