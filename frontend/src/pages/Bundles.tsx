import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProductStore, useCartStore } from '../store';
import type { Product } from '../types';
import { cartApi } from '../services/api';
import { Helmet } from 'react-helmet-async';

const Bundles: React.FC = () => {
  const navigate = useNavigate();
  const { products, fetchProducts, loading } = useProductStore();
  const { addToCart } = useCartStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [giftNote, setGiftNote] = useState('');
  const [engraving, setEngraving] = useState('');

  useEffect(() => {
    if (!products || products.length === 0) {
      fetchProducts({ limit: 24, sort: 'popular' });
    }
  }, [products, fetchProducts]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev; // cap at 3
      return [...prev, id];
    });
  };

  const selectedProducts: Product[] = useMemo(
    () => products.filter((p) => selectedIds.includes(p._id)),
    [products, selectedIds]
  );

  const subtotal = useMemo(() => selectedProducts.reduce((sum, p) => sum + p.price, 0), [selectedProducts]);
  const discountPct = useMemo(() => (selectedProducts.length === 2 ? 10 : selectedProducts.length === 3 ? 15 : 0), [selectedProducts.length]);
  const discountAmount = useMemo(() => Math.round((subtotal * discountPct) / 100), [subtotal, discountPct]);
  const total = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount]);

  const buildBundle = async () => {
    if (selectedProducts.length < 2) return;
    for (const p of selectedProducts) {
      await addToCart(p._id, 1);
    }
    try {
      await cartApi.applyBundle(selectedProducts.map(p => p._id), giftNote, engraving);
    } catch {}
    navigate('/checkout', { state: { bundle: { count: selectedProducts.length, discountPct, giftNote, engraving } } });
  };

  const title = 'Build Your Duo/Trio — Save 10–15% | Ukiyo';
  const description = 'Select 2 or 3 solid perfumes. Save automatically at checkout. Optional gift note and tin engraving available.';
  const url = `${window.location.origin}/bundles`;
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-gray-900 mb-2">Build Your Duo/Trio</h1>
          <p className="text-gray-700">Pick 2 or 3 scents. Save automatically at checkout.</p>
        </div>

        {/* Builder Grid */}
        {loading.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const selected = selectedIds.includes(p._id);
              return (
                <button
                  key={p._id}
                  onClick={() => toggleSelect(p._id)}
                  className={`text-left card card-hover p-4 ${selected ? 'ring-2 ring-primary-600' : ''}`}
                >
                  <div className="bg-gray-100 rounded-lg overflow-hidden mb-3 aspect-square">
                    <img src={p.images[0] || '/images/placeholders/placeholder-product.svg'} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{p.name}</h3>
                    {(p.reviewCount ?? 0) > 0 && (
                      <span className="text-xs text-gray-600">⭐ {p.rating?.toFixed(1)}</span>
                    )}
                  </div>
                  <div className="text-gray-800 font-medium">₹{p.price.toLocaleString()}</div>
                  <div className="mt-2 text-xs text-gray-600">
                    {selected ? 'Selected' : 'Tap to select'}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Summary */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Selection ({selectedProducts.length})</h2>
            {selectedProducts.length === 0 ? (
              <p className="text-gray-600">Pick any 2 or 3 perfumes to unlock bundle savings.</p>
            ) : (
              <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
                {selectedProducts.map((p) => (
                  <li key={p._id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0] || '/images/placeholders/placeholder-product.svg'} className="w-12 h-12 rounded object-cover" />
                      <div>
                        <div className="font-medium text-gray-900">{p.name}</div>
                        {(p.reviewCount ?? 0) > 0 && <div className="text-xs text-gray-600">⭐ {p.rating?.toFixed(1)}</div>}
                      </div>
                    </div>
                    <div className="text-gray-900 font-medium">₹{p.price.toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Bundle Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Bundle Discount</span><span>{discountPct ? `₹${discountAmount.toLocaleString()} (${discountPct}%)` : '—'}</span></div>
              <div className="flex justify-between font-semibold text-gray-900"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
              <div className="text-xs text-gray-600">GST included • Free shipping</div>
            </div>

            {/* Gift note & engraving */}
            <div className="mt-6 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gift note (optional)</label>
                <textarea value={giftNote} onChange={(e) => setGiftNote(e.target.value)} rows={2} className="w-full input-primary" placeholder="Add a short note for the recipient" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tin engraving (optional)</label>
                <input value={engraving} onChange={(e) => setEngraving(e.target.value)} maxLength={20} className="w-full input-primary" placeholder="Max 20 characters" />
                <div className="text-xs text-gray-500 mt-1">Preview: “{engraving || 'Your text'}”</div>
              </div>
            </div>

            <button
              onClick={buildBundle}
              disabled={selectedProducts.length < 2}
              className={`mt-6 w-full ${selectedProducts.length < 2 ? 'btn-ghost opacity-50 cursor-not-allowed' : 'btn-primary'}`}
            >
              {selectedProducts.length < 2 ? 'Select 2–3 to continue' : `Checkout Duo/Trio (${discountPct}% off)`}
            </button>
            <div className="mt-3 text-xs text-gray-600">Discount applied automatically at checkout.</div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          <Link to="/products" className="text-primary-600 hover:text-primary-700">Or keep browsing products</Link>
        </div>
      </div>
    </div>
  );
};

export default Bundles;