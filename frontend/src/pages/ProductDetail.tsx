import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductStore, useCartStore } from '../store';
import { productApi } from '../services/api';
import { Helmet } from 'react-helmet-async';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { currentProduct, loading, fetchProductBySlug } = useProductStore();
  const { addToCart, cart } = useCartStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');

  // Reviews & Q&A state
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (slug) {
      fetchProductBySlug(slug);
    }
  }, [slug, fetchProductBySlug]);

  useEffect(() => {
    if (currentProduct?.images?.length) {
      setSelectedImage(0);
    }
  }, [currentProduct]);

  useEffect(() => {
    // Load reviews and questions lazily after product loads
    const loadSocialProof = async () => {
      if (!slug) return;
      try {
        setReviewsLoading(true);
        const [r] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${slug}`).then(res => res.json())
        ]);
        if (r?.success) setReviews(r.data.reviews || []);
      } catch (e) {
        // no-op
      } finally {
        setReviewsLoading(false);
      }
      try {
        setQuestionsLoading(true);
        const q = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/questions/${slug}`).then(res => res.json());
        if (q?.success) setQuestions(q.data.questions || []);
      } catch (e) {
        // no-op
      } finally {
        setQuestionsLoading(false);
      }
    };
    loadSocialProof();
  }, [slug]);

  const [addToCartState, setAddToCartState] = useState<{
    isLoading: boolean;
    isSuccess: boolean;
    error: string | null;
  }>({
    isLoading: false,
    isSuccess: false,
    error: null
  });

  const handleAddToCart = async () => {
    if (!currentProduct) return;
    
    setAddToCartState({ isLoading: true, isSuccess: false, error: null });
    
    try {
      await addToCart(currentProduct._id, quantity, selectedVariant);
      setAddToCartState({ isLoading: false, isSuccess: true, error: null });
      
      setTimeout(() => {
        setAddToCartState(prev => ({ ...prev, isSuccess: false }));
      }, 2000);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      setAddToCartState({ 
        isLoading: false, 
        isSuccess: false, 
        error: error.message || 'Failed to add product to cart' 
      });
      
      setTimeout(() => {
        setAddToCartState(prev => ({ ...prev, error: null }));
      }, 3000);
    }
  };

  const handleBuyNow = async () => {
    if (!currentProduct) return;
    try {
      await addToCart(currentProduct._id, 1, selectedVariant);
      navigate('/checkout');
    } catch (error) {
      // If add to cart fails, do nothing special; error UI already handled
    }
  };

  const isInCart = !!cart?.items?.some((item: any) => item?.product?._id === currentProduct?._id);

  if (loading.isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (loading.error || !currentProduct) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="btn-primary"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const product = currentProduct;
  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const scentChips = product.scentProfile || product.tags || [];
  const strengthLabel = product.strength || 'Everyday';
  const wearText = product.wearDuration || '8 hours';

  const metaTitle = product.seo?.metaTitle || `${product.name} Solid Perfume | Alcohol‑Free Balm | Ukiyo`;
  const metaDescription = product.seo?.metaDescription || `${product.noteFamily || 'Fragrance'} notes with ${wearText}. Alcohol‑free, skin‑safe, travel‑friendly tin. Ships in 24 hrs from ${product.shippingOrigin || 'Delhi'}.`;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {product.seo?.keywords?.length ? (
          <meta name="keywords" content={product.seo.keywords.join(', ')} />
        ) : null}
        <link rel="canonical" href={`${window.location.origin}/products/${product.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.images,
            description: metaDescription,
            sku: product.sku,
            brand: { '@type': 'Brand', name: 'Ukiyo' },
            aggregateRating: product.reviewCount ? {
              '@type': 'AggregateRating',
              ratingValue: product.rating || 4.8,
              reviewCount: product.reviewCount,
            } : undefined,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: product.price,
              availability: product.inStock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock',
              url: `${window.location.origin}/products/${product.slug}`,
            },
          })}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category.slug}`} className="hover:text-primary-600">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage] || '/images/placeholders/placeholder-product.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            
            {/* Title and Category */}
            <div>
              <Link
                to={`/products?category=${product.category.slug}`}
                className="text-primary-600 text-sm font-medium hover:text-primary-700"
              >
                {product.category.name}
              </Link>
              <h1 className="text-3xl font-cormorant font-bold text-gray-900 mt-2 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.comparePrice.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Scent profile chips */}
            {scentChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {scentChips.map((chip, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                    {chip}
                  </span>
                ))}
              </div>
            )}

            {/* Strength meter */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {['Subtle','Everyday','Bold'].map(level => (
                  <span
                    key={level}
                    className={`h-2 w-10 rounded-full ${
                      level === 'Subtle' ? 'bg-green-200' : level === 'Everyday' ? 'bg-green-400' : 'bg-green-600'
                    } ${level === strengthLabel ? '' : 'opacity-30'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-700">{strengthLabel} {wearText}</span>
            </div>

            {/* Trust line */}
            <div className="text-sm text-gray-700">
              Alcohol‑Free • Skin‑Safe • Travel‑Ready • Made in India
              {product.vegan ?? true ? ' • Vegan' : ''}
              {product.crueltyFree ?? true ? ' • Cruelty‑Free' : ''}
              {product.ifraCompliant ?? true ? ' • IFRA‑Compliant' : ''}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Options</h3>
                <div className="space-y-4">
                  {product.variants.map((variant) => (
                    <div key={variant.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {variant.name}
                      </label>
                      <select
                        value={selectedVariant.includes(variant.name) ? selectedVariant : ''}
                        onChange={(e) => setSelectedVariant(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select {variant.name}</option>
                        {variant.options.map((option) => (
                          <option key={option} value={`${variant.name}: ${option}`}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and CTAs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-primary-500 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-primary-500 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addToCartState.isLoading}
                  className={`${
                    addToCartState.isSuccess
                      ? 'bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out'
                      : addToCartState.error
                      ? 'bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out'
                      : !product.inStock || addToCartState.isLoading
                      ? 'btn-ghost opacity-50 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {addToCartState.isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </>
                    ) : addToCartState.isSuccess ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart!
                      </>
                    ) : addToCartState.error ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Failed
                      </>
                    ) : (
                      isInCart ? 'Add More to Cart' : 'Add to Cart'
                    )}
                  </div>
                </button>
                <button onClick={handleBuyNow} className="btn-outline">Buy Now (UPI/Wallets)</button>
              </div>

              {/* Error Message */}
              {addToCartState.error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{addToCartState.error}</p>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="text-gray-900">{product.sku || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900">{product.category.name}</span>
                </div>
                {product.inventory.lowStockThreshold && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock Alert:</span>
                    <span className="text-gray-900">{product.inventory.lowStockThreshold} units</span>
                  </div>
                )}
              </div>
            </div>

            {/* SEO Information */}
            {product.seo && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                {product.seo.keywords && product.seo.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.seo.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Why solid perfume? */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why solid perfume?</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Alcohol‑free, gentle on skin</li>
                <li>No spills, no leaks — flight and gym‑bag friendly</li>
                <li>Precise application on pulse points; great for layering</li>
              </ul>
            </div>

            {/* Longevity & climate */}
            <div className="mt-12">
              <h2 className="text-2xl font-cormorant font-bold text-gray-900 mb-4">Longevity & climate</h2>
              <p className="text-gray-700">Lasts {product.wearDuration || '8 hours'} on skin; reapply after 4 hours in humid weather.</p>
              <p className="text-gray-700 mt-2">Tip: Warm on fingertip, dab on wrists, neck, behind ears.</p>
            </div>

            {/* Ingredients & safety */}
            {(product.ingredients?.length || product.allergens?.length || product.vegan || product.crueltyFree || product.ifraCompliant || product.shelfLifeMonths) && (
              <div className="mt-12">
                <h2 className="text-2xl font-cormorant font-bold text-gray-900 mb-4">Ingredients & safety</h2>
                {product.ingredients?.length ? (
                  <p className="text-gray-700">{product.ingredients.join(', ')}</p>
                ) : (
                  <p className="text-gray-700">Beeswax/Candelilla Wax, Shea Butter, Natural Oils, IFRA‑compliant fragrance</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-700">
                  {(product.vegan ?? true) && <span className="px-3 py-1 bg-gray-100 rounded-full">Vegan</span>}
                  {(product.crueltyFree ?? true) && <span className="px-3 py-1 bg-gray-100 rounded-full">Cruelty‑free</span>}
                  {(product.ifraCompliant ?? true) && <span className="px-3 py-1 bg-gray-100 rounded-full">IFRA‑compliant</span>}
                  <span className="px-3 py-1 bg-gray-100 rounded-full">Shelf life: {(product.shelfLifeMonths ?? 6)} months</span>
                  {product.allergens?.length ? (
                    <span className="px-3 py-1 bg-gray-100 rounded-full">Allergens: {product.allergens.join(', ')}</span>
                  ) : null}
                </div>
              </div>
            )}

            {/* Size & packaging */}
            <div className="mt-12">
              <h2 className="text-2xl font-cormorant font-bold text-gray-900 mb-4">Size & packaging</h2>
              <p className="text-gray-700">{product.tinSizeGrams ?? 10}g tin (approx. 3–4 months of daily use). Leak‑proof, pocket‑friendly tin; recyclable packaging.</p>
            </div>

            {/* Shipping & returns */}
            <div className="mt-12">
              <h2 className="text-2xl font-cormorant font-bold text-gray-900 mb-4">Shipping & returns</h2>
              <p className="text-gray-700">Ships in 24 hrs from {product.shippingOrigin ?? 'Delhi'} • Delivery in 2–5 days.</p>
              <p className="text-gray-700 mt-2">Hygiene policy: unopened Discovery Kits returnable within 10 days.</p>
            </div>



            {/* Related Products Section - Placeholder */}
            <div className="mt-16 border-t pt-16">
              <h2 className="text-2xl font-cormorant font-bold text-gray-900 mb-8">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                    <span className="text-gray-500">Related Product {item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scent pyramid */}
        {(product.notes?.top?.length || product.notes?.heart?.length || product.notes?.base?.length) && (
          <div className="mt-16 border-t pt-16">
            <h2 className="text-2xl font-cormorant font-bold text-gray-900 mb-6">Scent Pyramid</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Top</h4>
                <p className="text-gray-700">{product.notes?.top?.join(', ') || '—'}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Heart</h4>
                <p className="text-gray-700">{product.notes?.heart?.join(', ') || '—'}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Base</h4>
                <p className="text-gray-700">{product.notes?.base?.join(', ') || '—'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews & Q&A */}
        <div className="mt-16 border-t pt-16">
          <h2 className="text-2xl font-cormorant font-bold text-gray-900 mb-8">Reviews & Q&A</h2>
          {/* Reviews */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
            {reviewsLoading ? (
              <p className="text-gray-500">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-600">Be the first to review this fragrance.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{rev.name || 'Anonymous'}</span>
                        <span className="text-sm text-gray-600">{rev.scentFamily || product.noteFamily}</span>
                      </div>
                      <div className="text-sm text-gray-700">⭐ {rev.rating}</div>
                    </div>
                    {rev.title && <p className="mt-1 font-medium text-gray-900">{rev.title}</p>}
                    {rev.comment && <p className="mt-1 text-gray-700">{rev.comment}</p>}
                    <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-3">
                      {rev.longevityRating && <span>Longevity: {rev.longevityRating}/5</span>}
                      {rev.projectionRating && <span>Projection: {rev.projectionRating}/5</span>}
                      {rev.climateUsed && <span>Climate: {rev.climateUsed}</span>}
                      {rev.skinType && <span>Skin: {rev.skinType}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Q&A */}
          <div className="space-y-4 mt-10">
            <h3 className="text-lg font-semibold text-gray-900">Questions & Answers</h3>
            {questionsLoading ? (
              <p className="text-gray-500">Loading questions...</p>
            ) : questions.length === 0 ? (
              <p className="text-gray-600">No questions yet. Ask about longevity, projection, or layering tips.</p>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q._id} className="p-4 border border-gray-200 rounded-xl">
                    <p className="text-gray-900"><span className="font-medium">Q:</span> {q.question}</p>
                    {q.answers && q.answers.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {q.answers.map((a: any, idx: number) => (
                          <p key={idx} className="text-gray-700"><span className="font-medium">A:</span> {a.answer}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;