import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Truck,
  Check,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    placeOrder,
    setActivePage,
    currentUser,
  } = useShop();

  // Form State initialized with user address if saved
  const [formData, setFormData] = useState({
    fullName: currentUser?.defaultAddress?.fullName || currentUser?.name || 'Claire Dupont',
    email: currentUser?.email || 'claire@example.com',
    phone: currentUser?.phone || '+1 (555) 782-3344',
    addressLine1: currentUser?.defaultAddress?.addressLine1 || '320 Park Avenue',
    addressLine2: currentUser?.defaultAddress?.addressLine2 || 'Suite 14B',
    city: currentUser?.defaultAddress?.city || 'New York',
    state: currentUser?.defaultAddress?.state || 'NY',
    postalCode: currentUser?.defaultAddress?.postalCode || '10022',
    country: currentUser?.defaultAddress?.country || 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'stripe' | 'razorpay' | 'test_mode'>('test_mode');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-[#E8E3DC] space-y-4">
          <ShoppingBag size={32} className="mx-auto text-[#C2A277]" />
          <h2 className="font-serif-luxury text-2xl text-[#1E3329]">Your bag is empty</h2>
          <button
            onClick={() => setActivePage('shop')}
            className="px-6 py-2.5 bg-[#1E3329] text-white text-xs uppercase tracking-wider rounded-full"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.postalCode ||
      !formData.country
    ) {
      setErrorMessage('Please fill in all required delivery address fields.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate gateway authorization latency
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const res = await placeOrder({
        customer: formData,
        paymentMethod,
      });

      if (res.success && res.order) {
        setIsProcessing(false);
        setActivePage('order-success');
      } else {
        setIsProcessing(false);
        setErrorMessage(res.error || 'Unable to authorize transaction. Please verify stock.');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'An unexpected payment authorization error occurred.');
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#8C8275] mb-6">
          <button onClick={() => setActivePage('cart')} className="hover:text-[#1E3329] flex items-center gap-1">
            <ArrowLeft size={12} />
            <span>Return to Shopping Bag</span>
          </button>
        </div>

        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C8275] font-semibold">
            Atelier Checkout
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1E3329] mt-1">
            Delivery & Payment Authorization
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-xs space-y-4">
              <h2 className="font-serif-luxury text-xl text-[#1E3329] pb-2 border-b border-[#E8E3DC] flex items-center justify-between">
                <span>1. Collector Information</span>
                {currentUser && (
                  <span className="text-xs font-sans-luxury text-[#6B726D]">
                    Logged in as <strong>{currentUser.email}</strong>
                  </span>
                )}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-[#1E3329] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl focus:border-[#1E3329]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#1E3329] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl focus:border-[#1E3329]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1E3329] mb-1">Phone Number (for courier SMS updates) *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl focus:border-[#1E3329]"
                />
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-xs space-y-4">
              <h2 className="font-serif-luxury text-xl text-[#1E3329] pb-2 border-b border-[#E8E3DC]">
                2. Insured Delivery Destination
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-[#1E3329] mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    name="addressLine1"
                    placeholder="House / Apartment number and street name"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl focus:border-[#1E3329]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1E3329] mb-1">Apartment, Suite, Unit (optional)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl focus:border-[#1E3329]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-[#1E3329] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl focus:border-[#1E3329]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E3329] mb-1">State / Province *</label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl focus:border-[#1E3329]"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-medium text-[#1E3329] mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl focus:border-[#1E3329]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#1E3329] mb-1">Country / Region *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl focus:border-[#1E3329]"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Italy">Italy</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Japan">Japan</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E3DC]">
                <h2 className="font-serif-luxury text-xl text-[#1E3329]">
                  3. Payment Authorization
                </h2>
                <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                  <Lock size={12} />
                  SSL Protected
                </span>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('test_mode')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'test_mode'
                      ? 'border-[#1E3329] bg-[#FAF8F5] text-[#1E3329] font-semibold ring-1 ring-[#1E3329]'
                      : 'border-[#E8E3DC] text-[#6B726D] hover:border-[#1E3329]'
                  }`}
                >
                  <Sparkles size={16} className="text-[#C2A277]" />
                  <span>Instant Test Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'border-[#1E3329] bg-[#FAF8F5] text-[#1E3329] font-semibold ring-1 ring-[#1E3329]'
                      : 'border-[#E8E3DC] text-[#6B726D] hover:border-[#1E3329]'
                  }`}
                >
                  <CreditCard size={16} />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'stripe'
                      ? 'border-[#1E3329] bg-[#FAF8F5] text-[#1E3329] font-semibold ring-1 ring-[#1E3329]'
                      : 'border-[#E8E3DC] text-[#6B726D] hover:border-[#1E3329]'
                  }`}
                >
                  <ShieldCheck size={16} />
                  <span>Stripe / Razorpay</span>
                </button>
              </div>

              {/* Card Inputs */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3DC] space-y-3 text-xs">
                {paymentMethod === 'test_mode' ? (
                  <div className="space-y-1">
                    <p className="font-medium text-[#1E3329]">Development Sandbox Mode Active</p>
                    <p className="text-[#6B726D] leading-relaxed">
                      Orders placed in Test Mode instantly create confirmed records in the database, decrement real product variant inventory, and generate verifiable order tracking IDs.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block font-medium text-[#1E3329] mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2 bg-white border border-[#E8E3DC] rounded-lg font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-[#1E3329] mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2 bg-white border border-[#E8E3DC] rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-[#1E3329] mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full p-2 bg-white border border-[#E8E3DC] rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary with Preserved Variations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-xs space-y-6">
              <h3 className="font-serif-luxury text-xl text-[#1E3329] pb-3 border-b border-[#E8E3DC]">
                Order Breakdown ({cart.length} creations)
              </h3>

              {/* Items preview list */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-14 h-16 object-cover rounded-lg bg-[#F2EDE4] border border-[#E8E3DC] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1E3329] truncate">{item.productName}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#6B726D]">
                        <span
                          className="w-2 h-2 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: item.colorCode }}
                        ></span>
                        <span>{item.colorName} × {item.quantity}</span>
                      </div>
                      <p className="text-xs font-serif-luxury text-[#1E3329] font-medium">
                        ${(item.salePrice || item.price) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-4 border-t border-[#E8E3DC] space-y-2 text-xs text-[#555C57]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1E3329]">${cartSubtotal}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Privilege Courtesy ({appliedCoupon?.code})</span>
                    <span>-${cartDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Courier Delivery</span>
                  <span>{cartShipping === 0 ? 'Complimentary' : `$${cartShipping}`}</span>
                </div>
                <div className="pt-3 border-t border-[#E8E3DC] flex justify-between items-baseline font-serif-luxury text-2xl text-[#1E3329]">
                  <span>Total Amount</span>
                  <span className="font-semibold">${cartTotal}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-[#1E3329] hover:bg-[#15241D] disabled:bg-gray-400 text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authorizing Order with Atelier...</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Authorize & Place Order • ${cartTotal}</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-[11px] text-[#8C8275] text-center space-y-1">
                <p>By placing this order, you confirm the selected colorway editions.</p>
                <p>Includes certificate of European leather authenticity & dust packaging.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
