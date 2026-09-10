import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActivePage,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMessage({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md bg-white p-8 sm:p-12 rounded-2xl border border-[#E8E3DC] shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center mx-auto text-[#C2A277]">
            <ShoppingBag size={28} />
          </div>
          <h2 className="font-serif-luxury text-3xl text-[#1E3329]">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-[#6B726D] leading-relaxed">
            Your shopping bag awaits your discerning choice. Browse our latest arrivals or explore our iconic handcrafted collections.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActivePage('shop')}
              className="px-8 py-3.5 bg-[#1E3329] hover:bg-[#15241D] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-full transition shadow-md"
            >
              Explore Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8E3DC] gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C8275] font-semibold">
              Order Review
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1E3329] mt-1">
              Your Shopping Bag ({cart.length} creations)
            </h1>
          </div>
          <button
            onClick={() => setActivePage('shop')}
            className="text-xs uppercase tracking-wider font-semibold text-[#1E3329] hover:text-[#C2A277] transition flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* 2-Column Bag & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E8E3DC] divide-y divide-[#E8E3DC] shadow-xs overflow-hidden">
              {cart.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  {/* Image with exact color variation */}
                  <img
                    src={item.image}
                    alt={`${item.productName} in ${item.colorName}`}
                    className="w-24 h-28 object-cover rounded-xl bg-[#F2EDE4] border border-[#E8E3DC] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <h3 className="font-serif-luxury text-xl text-[#1E3329] leading-tight">
                      {item.productName}
                    </h3>

                    {/* Preserved Color Variation Details */}
                    <div className="flex items-center gap-2 text-xs text-[#555C57] pt-0.5">
                      <span
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: item.colorCode }}
                      ></span>
                      <span>Selected Colorway: <strong className="text-[#1E3329]">{item.colorName}</strong></span>
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <span className="font-serif-luxury text-lg text-[#1E3329]">
                        ${item.salePrice || item.price}
                      </span>
                      {item.salePrice && (
                        <span className="text-xs text-[#8C8275] line-through font-sans-luxury">
                          ${item.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    <div className="flex items-center border border-[#E8E3DC] rounded-xl bg-[#FAF8F5] px-3 py-1 text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-[#6B726D] hover:text-[#1E3329]"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold text-[#1E3329]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-1 text-[#6B726D] hover:text-[#1E3329] disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-[#8C8275] hover:text-[#9C4331] flex items-center gap-1 transition"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center px-2 text-xs text-[#8C8275]">
              <button onClick={clearCart} className="hover:text-[#9C4331] transition">
                Clear all bag items
              </button>
              <span>Items reserved for 30 minutes in atelier</span>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-xs space-y-6">
              <h2 className="font-serif-luxury text-xl text-[#1E3329] pb-3 border-b border-[#E8E3DC]">
                Order Summary
              </h2>

              {/* Promo Code Box */}
              <div className="space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8275]" />
                    <input
                      type="text"
                      placeholder="Promotional code (e.g. AURELLE15)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl focus:outline-none focus:border-[#1E3329]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1E3329] text-[#FAF8F5] text-xs uppercase font-semibold rounded-xl hover:bg-[#2D483B] transition"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="flex items-center justify-between p-2.5 bg-[#F4EFEB] rounded-xl border border-[#C2A277]/40 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                      <Check size={14} className="text-emerald-700" />
                      <span>{appliedCoupon.code} applied ({appliedCoupon.description})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-1 text-[#8C8275] hover:text-[#9C4331]"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {couponMessage && !appliedCoupon && (
                  <p className={`text-xs ${couponMessage.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Line items */}
              <div className="space-y-2.5 text-xs text-[#555C57]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#1E3329]">${cartSubtotal}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Privilege Courtesy ({appliedCoupon?.code})</span>
                    <span>-${cartDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured White-Glove Shipping</span>
                  <span>{cartShipping === 0 ? 'Complimentary' : `$${cartShipping}`}</span>
                </div>

                <div className="pt-3 border-t border-[#E8E3DC] flex justify-between items-baseline font-serif-luxury text-2xl text-[#1E3329]">
                  <span>Total Due</span>
                  <span className="font-semibold">${cartTotal}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setActivePage('checkout')}
                className="w-full py-4 bg-[#1E3329] hover:bg-[#15241D] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xl transition shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-[11px] text-[#8C8275] flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-[#C2A277]" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
