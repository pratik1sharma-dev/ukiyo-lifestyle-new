import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const DiscoveryKit: React.FC = () => {
  const title = 'Discovery Kit — Try 3 Mini Solid Perfumes | Ukiyo';
  const description = 'Find your signature scent with 3 pocket‑friendly minis. Alcohol‑free, skin‑safe, designed for Indian weather. Redeem ₹299 on your next full‑size.';
  const url = `${window.location.origin}/discovery-kit`;
  const image = '/images/placeholders/placeholder-product.svg';
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-gray-900 mb-4">Discovery Kit</h1>
        <p className="text-gray-700 mb-6 max-w-2xl">
          Find your signature scent with 3 pocket‑friendly minis. Alcohol‑free, skin‑safe, and designed for Indian weather.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
          <li>Try 3 x 3g minis across different scent families</li>
          <li>Redeem ₹299 on your next full‑size purchase</li>
          <li>Travel‑friendly, spill‑proof tins</li>
        </ul>
        <div className="flex gap-3">
          <Link to="/products" className="btn-primary">Shop Solid Perfumes</Link>
          <Link to="/products?sort=popular" className="btn-outline">Browse Best Sellers</Link>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryKit;