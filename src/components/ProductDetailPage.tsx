import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    setActivePage,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    addReview,
  } = useShop();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  // Selected Color Variant state
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product?.defaultVariantId || product?.variants[0]?.variantId || ''
  );

  // Selected Image index within the active color variant's image list
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'materials' | 'dimensions' | 'care' | 'shipping'>('materials');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  // Whenever product changes or selectedProductId changes, reset to default variant
  useEffect(() => {
    if (product) {
      const defaultVar =
        product.variants.find((v) => v.variantId === product.defaultVariantId) ||
        product.variants[0];
      if (defaultVar) {
        setSelectedVariantId(defaultVar.variantId);
        setActiveImageIndex(0);
        setQuantity(1);
      }
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <p className="text-[#6B726D]">Product not found</p>
        <button
          onClick={() => setActivePage('shop')}
          className="mt-4 px-6 py-2 bg-[#1E3329] text-white rounded-full text-xs uppercase"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Find active variant object
  const activeVariant =
    product.variants.find((v) => v.variantId === selectedVariantId) || product.variants[0];

  // Images strictly for the currently selected color variation!
  const currentImages = activeVariant?.images?.length
    ? activeVariant.images
    : ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200'];

  const mainImageUrl = currentImages[activeImageIndex] || currentImages[0];

  // Handler for color variant change: updates variant AND resets active image index to 0
  const handleColorSelect = (variantId: string) => {
    setSelectedVariantId(variantId);
    setActiveImageIndex(0);
    // adjust quantity if current quantity exceeds new variant's stock
    const nextVar = product.variants.find((v) => v.variantId === variantId);
    if (nextVar && quantity > nextVar.stock) {
      setQuantity(Math.max(1, nextVar.stock));
    }
  };

  const handleAddToCart = () => {
    const res = addToCart(product, activeVariant.variantId, quantity);
    if (res.success) {
      setAddedNotice(res.message);
      setTimeout(() => setAddedNotice(null), 3000);
    } else {
      alert(res.message);
    }
  };

  const handleBuyNow = () => {
    const res = addToCart(product, activeVariant.variantId, quantity);
    if (res.success) {
      setActivePage('checkout');
    } else {
      alert(res.message);
    }
  };

  const isFavorited = isInWishlist(product.id);

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    addReview({
      productId: product.id,
      userName: reviewName,
      rating: reviewRating,
      title: reviewTitle || 'Exceptional craftsmanship',
      comment: reviewComment,
      colorPurchased: activeVariant.colorName,
      verifiedPurchase: true,
    });
    setShowReviewForm(false);
    setReviewName('');
    setReviewComment('');
    setReviewTitle('');
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const displayPrice = activeVariant.priceOverride || product.salePrice || product.price;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#8C8275] mb-8">
          <button onClick={() => setActivePage('home')} className="hover:text-[#1E3329]">
            Home
          </button>
          <ChevronRight size={12} />
          <button
            onClick={() => setActivePage('shop', undefined, product.category)}
            className="hover:text-[#1E3329] capitalize"
          >
            {product.category.replace('-', ' ')}
          </button>
          <ChevronRight size={12} />
          <span className="text-[#1E3329] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Color-Specific Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#F2EDE4] border border-[#E8E3DC] shadow-sm">
              <img
                src={mainImageUrl}
                alt={`${product.name} in ${activeVariant.colorName}`}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Color Variation Badge overlay */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#1E3329] border border-[#E8E3DC] flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: activeVariant.colorCode }}
                ></span>
                <span>{activeVariant.colorName}</span>
              </div>

              {/* Wishlist Quick Toggle on Image */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white text-[#1E3329] shadow-sm backdrop-blur-xs transition"
                aria-label="Toggle wishlist"
              >
                <Heart
                  size={18}
                  className={isFavorited ? 'fill-[#9C4331] text-[#9C4331]' : 'text-[#1E3329]'}
                />
              </button>
            </div>

            {/* Thumbnail Strip (Updates automatically to the selected color variation!) */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {currentImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 sm:w-24 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#1E3329] ring-2 ring-[#C2A277]/40 scale-105'
                      : 'border-[#E8E3DC] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <p className="text-[11px] text-[#8C8275] italic text-center sm:text-left">
              * Displaying studio imagery specifically for the <strong>{activeVariant.colorName}</strong> edition.
            </p>
          </div>

          {/* Right Column: Product Purchasing Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tagline / Collection */}
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C2A277] font-semibold">
                {product.collection || 'Atelier Limited Edition'}
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1E3329] leading-tight font-normal">
                {product.name}
              </h1>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center justify-between py-2 border-b border-[#E8E3DC]">
              <div className="flex items-baseline gap-3">
                <span className="font-serif-luxury text-3xl text-[#1E3329]">
                  ${displayPrice}
                </span>
                {product.salePrice && (
                  <span className="text-base text-[#8C8275] line-through font-sans-luxury">
                    ${product.price}
                  </span>
                )}
                {product.salePrice && (
                  <span className="bg-[#1E3329] text-[#FAF8F5] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    Save ${product.price - product.salePrice}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex text-[#C2A277]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(product.rating) ? 'fill-[#C2A277]' : 'text-[#D8D2C7]'}
                    />
                  ))}
                </div>
                <span className="font-semibold text-[#1E3329]">{product.rating}</span>
                <span className="text-[#8C8275]">({product.reviewCount} patrons)</span>
              </div>
            </div>

            {/* Short Narrative Description */}
            <p className="text-sm text-[#555C57] leading-relaxed">
              {product.description}
            </p>

            {/* CRITICAL COLOR VARIATION SELECTOR */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#1E3329]">
                  Select Colorway:{' '}
                  <strong className="text-[#C2A277] normal-case text-sm font-serif-luxury ml-1">
                    {activeVariant.colorName}
                  </strong>
                </span>
                <span className="text-xs text-[#8C8275]">
                  SKU: <span className="font-mono text-[#1E3329]">{activeVariant.sku}</span>
                </span>
              </div>

              {/* Swatches */}
              <div className="flex items-center gap-3">
                {product.variants.map((variant) => {
                  const isSelected = variant.variantId === selectedVariantId;
                  return (
                    <button
                      key={variant.variantId}
                      type="button"
                      onClick={() => handleColorSelect(variant.variantId)}
                      className={`group relative p-1 rounded-full transition-all duration-200 ${
                        isSelected
                          ? 'ring-2 ring-[#1E3329] ring-offset-2 scale-110'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      title={`${variant.colorName} (${variant.stock} available)`}
                    >
                      <span
                        className="block w-7 h-7 rounded-full shadow-inner border border-black/15"
                        style={{ backgroundColor: variant.colorCode }}
                      ></span>

                      {/* Tooltip on hover */}
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#1E3329] text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-20">
                        {variant.colorName}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live Stock Indicator for Selected Variant */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                {activeVariant.stock > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span className="text-emerald-800 font-medium">
                      In Stock at Atelier — {activeVariant.stock} units available in {activeVariant.colorName}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    <span className="text-rose-700 font-medium">
                      Currently out of stock in {activeVariant.colorName}. Please select another color.
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart Controls */}
            <div className="space-y-4 pt-4 border-t border-[#E8E3DC]">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-[#E8E3DC] rounded-xl bg-white px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || activeVariant.stock === 0}
                    className="p-1 text-[#6B726D] hover:text-[#1E3329] disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-[#1E3329]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(activeVariant.stock, quantity + 1))}
                    disabled={quantity >= activeVariant.stock || activeVariant.stock === 0}
                    className="p-1 text-[#6B726D] hover:text-[#1E3329] disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Primary Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={activeVariant.stock === 0}
                  className="flex-1 py-3.5 px-6 bg-[#1E3329] hover:bg-[#15241D] disabled:bg-gray-300 disabled:cursor-not-allowed text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>
                    {activeVariant.stock === 0
                      ? 'Sold Out'
                      : `Add to Bag • $${displayPrice * quantity}`}
                  </span>
                </button>
              </div>

              {/* Buy Now Button */}
              {activeVariant.stock > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 bg-[#FAF8F5] hover:bg-white text-[#1E3329] border border-[#1E3329] text-xs uppercase tracking-[0.2em] font-semibold rounded-xl transition shadow-xs"
                >
                  Instant White-Glove Checkout
                </button>
              )}

              {/* Notice Confirmation */}
              {addedNotice && (
                <div className="p-3 bg-[#E8DAC6]/40 border border-[#C2A277] rounded-xl text-xs text-[#1E3329] flex items-center gap-2 animate-in fade-in">
                  <Check size={16} className="text-[#1E3329]" />
                  <span>{addedNotice}</span>
                </div>
              )}
            </div>

            {/* Atelier Assurance Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E8E3DC] text-[11px] text-[#6B726D]">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#C2A277] shrink-0" />
                <span>Complimentary insured shipping over $300</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={16} className="text-[#C2A277] shrink-0" />
                <span>30-day effortless returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-[#C2A277] shrink-0" />
                <span>Individually numbered certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#C2A277] shrink-0" />
                <span>Lifetime repair atelier service</span>
              </div>
            </div>

            {/* Tabbed Specifications & Materials */}
            <div className="pt-6 border-t border-[#E8E3DC]">
              {/* Tab headers */}
              <div className="flex border-b border-[#E8E3DC] text-xs uppercase tracking-wider font-semibold">
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`pb-3 pr-4 transition ${
                    activeTab === 'materials'
                      ? 'text-[#1E3329] border-b-2 border-[#1E3329]'
                      : 'text-[#8C8275] hover:text-[#1E3329]'
                  }`}
                >
                  Materials
                </button>
                <button
                  onClick={() => setActiveTab('dimensions')}
                  className={`pb-3 px-4 transition ${
                    activeTab === 'dimensions'
                      ? 'text-[#1E3329] border-b-2 border-[#1E3329]'
                      : 'text-[#8C8275] hover:text-[#1E3329]'
                  }`}
                >
                  Dimensions
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-3 px-4 transition ${
                    activeTab === 'care'
                      ? 'text-[#1E3329] border-b-2 border-[#1E3329]'
                      : 'text-[#8C8275] hover:text-[#1E3329]'
                  }`}
                >
                  Care Guide
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-3 pl-4 transition ${
                    activeTab === 'shipping'
                      ? 'text-[#1E3329] border-b-2 border-[#1E3329]'
                      : 'text-[#8C8275] hover:text-[#1E3329]'
                  }`}
                >
                  Shipping
                </button>
              </div>

              {/* Tab content */}
              <div className="py-4 text-xs text-[#555C57] leading-relaxed">
                {activeTab === 'materials' && (
                  <ul className="space-y-2 list-disc pl-4">
                    {product.materials.map((mat, i) => (
                      <li key={i}>{mat}</li>
                    ))}
                    <li>Features tone-matched edge dye on every colorway cut</li>
                  </ul>
                )}
                {activeTab === 'dimensions' && (
                  <div className="space-y-2">
                    <p><strong>Dimensions:</strong> {product.dimensions}</p>
                    <p><strong>Weight:</strong> {product.weight}</p>
                    <p><strong>Features:</strong></p>
                    <ul className="list-disc pl-4 space-y-1">
                      {product.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'care' && (
                  <div className="space-y-2">
                    <p>{product.care}</p>
                    <p>Every order arrives with a 100% organic cotton dust cover and protective storage box.</p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p>Dispatched from our Paris atelier within 24 business hours.</p>
                    <p>Complimentary insured delivery for orders $300 and above. Signature delivery required for all shipments.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-20 pt-12 border-t border-[#E8E3DC]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C8275] font-semibold">
                Patron Appraisals
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#1E3329] mt-1">
                Verified Customer Reviews ({productReviews.length})
              </h2>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-2.5 bg-white border border-[#1E3329] text-[#1E3329] rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#1E3329] hover:text-white transition"
            >
              {showReviewForm ? 'Close Form' : 'Write a Review'}
            </button>
          </div>

          {/* Write a review form */}
          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-10 p-6 bg-white rounded-2xl border border-[#E8E3DC] shadow-sm space-y-4 max-w-xl"
            >
              <h3 className="font-serif-luxury text-xl text-[#1E3329]">Share Your Experience</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-[#1E3329] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Madeleine B."
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#1E3329] mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg"
                  >
                    <option value={5}>5 Stars - Perfection</option>
                    <option value={4}>4 Stars - Splendid</option>
                    <option value={3}>3 Stars - Good</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1E3329] mb-1">Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Incredible leather grain and timeless silhouette"
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1E3329] mb-1">Your Review</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the feel, structure, and color accuracy in person..."
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-xs text-[#8C8275]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1E3329] text-white text-xs uppercase tracking-wider rounded-lg font-semibold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}

          {/* Review List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productReviews.length === 0 ? (
              <p className="text-xs text-[#8C8275] italic">
                Be the premier collector to review this bespoke piece.
              </p>
            ) : (
              productReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 bg-white rounded-xl border border-[#E8E3DC] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#C2A277]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={13} className="fill-[#C2A277]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#8C8275]">{rev.date}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-[#1E3329]">{rev.title}</h4>
                  <p className="text-xs text-[#555C57] leading-relaxed">{rev.comment}</p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#8C8275]">
                    <span className="font-medium text-[#1E3329]">{rev.userName}</span>
                    {rev.colorPurchased && (
                      <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E3DC]">
                        Purchased: {rev.colorPurchased}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Collections Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#E8E3DC]">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C8275] font-semibold">
                Harmonious Pairings
              </span>
              <h2 className="font-serif-luxury text-3xl text-[#1E3329] mt-1">
                You May Also Admire
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
