import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { setActivePage, addToCart, toggleWishlist, isInWishlist } = useShop();

  // Selected variant state for the card (allows previewing other colors directly in the listing!)
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.defaultVariantId || product.variants[0]?.variantId
  );
  const [isHovered, setIsHovered] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const activeVariant =
    product.variants.find((v) => v.variantId === selectedVariantId) || product.variants[0];

  const primaryImage = activeVariant?.images[0] || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800';
  const secondaryImage = activeVariant?.images[1] || primaryImage;
  const currentImage = isHovered ? secondaryImage : primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = addToCart(product, activeVariant.variantId, 1);
    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const isFavorite = isInWishlist(product.id);

  return (
    <div
      onClick={() => setActivePage('product', product.id)}
      className="group cursor-pointer flex flex-col h-full bg-[#FAF8F5] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E8E3DC]/60 hover:border-[#C2A277]/50"
    >
      {/* Image Presentation Container */}
      <div
        className="relative w-full aspect-[4/5] bg-[#F2EDE4] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={currentImage}
          alt={`${product.name} in ${activeVariant.colorName}`}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.salePrice && (
            <span className="bg-[#1E3329] text-[#FAF8F5] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              Sale
            </span>
          )}
          {product.isBestseller && !product.salePrice && (
            <span className="bg-[#C2A277] text-[#1E3329] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-white text-[#1E3329] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-[#E8E3DC] shadow-xs">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          type="button"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/85 hover:bg-white text-[#1E3329] shadow-xs backdrop-blur-xs transition-transform duration-200 hover:scale-110 z-10"
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            className={isFavorite ? 'fill-[#9C4331] text-[#9C4331]' : 'text-[#1E3329]'}
          />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            type="button"
            className="w-full py-2.5 bg-[#1E3329]/95 hover:bg-[#15241D] text-[#FAF8F5] text-xs font-semibold tracking-widest uppercase rounded-lg shadow-md backdrop-blur-xs flex items-center justify-center gap-2 transition duration-200"
          >
            {addedNotice ? (
              <>
                <Check size={14} className="text-[#C2A277]" />
                Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                Quick Add ({activeVariant.colorName})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#8C8275] mb-1">
            <span className="uppercase tracking-widest font-medium">
              {product.collection || product.category.replace('-', ' ')}
            </span>
            <div className="flex items-center gap-1 text-[#1E3329]">
              <Star size={12} className="fill-[#C2A277] text-[#C2A277]" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-[#8C8275]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif-luxury text-lg text-[#1E3329] leading-snug group-hover:text-[#C2A277] transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-1 flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-sm font-semibold text-[#1E3329] font-sans-luxury">
                  ${product.salePrice}
                </span>
                <span className="text-xs text-[#8C8275] line-through font-sans-luxury">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-[#1E3329] font-sans-luxury">
                ${product.price}
              </span>
            )}
          </div>
        </div>

        {/* Interactive Color Variation Swatches */}
        <div className="pt-2 border-t border-[#E8E3DC]/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.variants.map((variant) => {
              const isSelected = variant.variantId === selectedVariantId;
              return (
                <button
                  key={variant.variantId}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariantId(variant.variantId);
                  }}
                  type="button"
                  title={`${variant.colorName} (${variant.stock} in stock)`}
                  className={`relative w-4 h-4 rounded-full transition-transform duration-150 ${
                    isSelected
                      ? 'ring-2 ring-offset-1 ring-[#1E3329] scale-110'
                      : 'hover:scale-110 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: variant.colorCode }}
                >
                  {variant.stock === 0 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] text-red-500 font-bold">
                      ×
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <span className="text-[11px] text-[#8C8275] truncate max-w-[120px]">
            {activeVariant.colorName}
          </span>
        </div>
      </div>
    </div>
  );
};
