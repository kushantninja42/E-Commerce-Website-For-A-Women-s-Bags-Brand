import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';

export const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    setActivePage,
  } = useShop();

  if (!isOpen) return null;

  const handleCheckoutClick = () => {
    onClose();
    setActivePage('checkout');
  };

  const handleViewBagClick = () => {
    onClose();
    setActivePage('cart');
  };

  const freeShippingThreshold = 300;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      {/* Slide-out Drawer */}
      <div className="relative ml-auto w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between z-50 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#E8E3DC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#1E3329]" />
            <h2 className="font-serif-luxury text-xl text-[#1E3329]">
              Your Shopping Bag ({cart.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8C8275] hover:text-[#1E3329] rounded-full hover:bg-[#F3EFEA] transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Complimentary Shipping Progress Bar */}
        <div className="px-6 py-3 bg-[#F4EFEB] border-b border-[#E8E3DC] text-xs">
          {cartSubtotal >= freeShippingThreshold ? (
            <p className="text-emerald-800 font-medium text-center">
              ✦ You qualify for complimentary white-glove shipping!
            </p>
          ) : (
            <div>
              <p className="text-[#555C57] mb-1 text-center">
                Add <strong className="text-[#1E3329]">${freeShippingThreshold - cartSubtotal}</strong> for complimentary insured delivery
              </p>
              <div className="w-full h-1.5 bg-[#E8E3DC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1E3329] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag size={40} className="mx-auto text-[#C2A277]/50" />
              <p className="font-serif-luxury text-xl text-[#1E3329]">Your bag is empty</p>
              <p className="text-xs text-[#8C8275] max-w-xs mx-auto">
                Explore our handcrafted leather silhouettes to find your signature companion.
              </p>
              <button
                onClick={() => {
                  onClose();
                  setActivePage('shop');
                }}
                className="mt-2 px-6 py-2.5 bg-[#1E3329] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded-full hover:bg-[#2D483B] transition"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl bg-white border border-[#E8E3DC] shadow-xs"
              >
                {/* Specific Color Variation Image */}
                <img
                  src={item.image}
                  alt={`${item.productName} in ${item.colorName}`}
                  className="w-20 h-24 object-cover rounded-lg bg-[#F2EDE4] shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif-luxury text-base text-[#1E3329] leading-tight line-clamp-1">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#8C8275] hover:text-[#9C4331] p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Preserved Color Variation Indicator */}
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-[#6B726D]">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: item.colorCode }}
                      ></span>
                      <span>Color: {item.colorName}</span>
                    </div>

                    <div className="mt-1 text-xs font-semibold text-[#1E3329]">
                      ${(item.salePrice || item.price) * item.quantity}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#E8E3DC] rounded-lg bg-[#FAF8F5] px-2 py-0.5 text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-[#6B726D] hover:text-[#1E3329]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-1 text-[#6B726D] hover:text-[#1E3329] disabled:opacity-30"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {item.quantity >= item.maxStock && (
                      <span className="text-[10px] text-amber-700">Max in stock</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations and Checkout */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E8E3DC] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B726D]">
                <span>Subtotal</span>
                <span>${cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Privilege Discount</span>
                  <span>-${cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B726D]">
                <span>Insured Delivery</span>
                <span>{cartShipping === 0 ? 'Complimentary' : `$${cartShipping}`}</span>
              </div>
              <div className="flex justify-between font-serif-luxury text-lg text-[#1E3329] pt-2 border-t border-[#E8E3DC]">
                <span>Estimated Total</span>
                <span className="font-semibold">${cartTotal}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-[#1E3329] hover:bg-[#15241D] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={handleViewBagClick}
                className="w-full py-2.5 bg-transparent hover:bg-[#FAF8F5] text-[#1E3329] border border-[#E8E3DC] text-xs uppercase tracking-wider font-medium rounded-xl transition"
              >
                View Full Bag & Promo Codes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
