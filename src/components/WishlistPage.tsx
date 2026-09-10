import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, setActivePage } = useShop();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8E3DC] gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C8275] font-semibold">
              Private Curations
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1E3329] mt-1">
              Your Curated Wishlist ({wishlistProducts.length})
            </h1>
          </div>

          <button
            onClick={() => setActivePage('shop')}
            className="text-xs uppercase tracking-wider font-semibold text-[#1E3329] hover:text-[#C2A277] transition flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Discover More Creations</span>
          </button>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E3DC] p-8 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center mx-auto text-[#C2A277]">
              <Heart size={28} />
            </div>
            <h2 className="font-serif-luxury text-2xl text-[#1E3329]">Your Wishlist is Empty</h2>
            <p className="text-xs text-[#6B726D]">
              Save pieces you love to your personal salon wishlist as you browse.
            </p>
            <button
              onClick={() => setActivePage('shop')}
              className="px-8 py-3.5 bg-[#1E3329] text-white rounded-full text-xs uppercase tracking-wider font-semibold"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
