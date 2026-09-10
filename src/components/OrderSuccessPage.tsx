import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Printer,
  ShoppingBag,
  Award,
  Clock,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { latestOrder, setActivePage } = useShop();

  if (!latestOrder) {
    return (
      <div className="py-24 text-center bg-[#FAF8F5]">
        <ShoppingBag size={40} className="mx-auto text-[#C2A277] mb-3" />
        <h2 className="font-serif-luxury text-2xl text-[#1E3329]">No active order session found</h2>
        <button
          onClick={() => setActivePage('shop')}
          className="mt-4 px-6 py-2.5 bg-[#1E3329] text-white text-xs uppercase tracking-wider rounded-full"
        >
          Explore Atelier Collections
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-[#E8E3DC] shadow-sm p-8 sm:p-12 space-y-8">
          {/* Header Banner */}
          <div className="text-center space-y-3 pb-8 border-b border-[#E8E3DC]">
            <div className="w-16 h-16 bg-[#E8DAC6]/40 text-[#1E3329] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C2A277]/50">
              <CheckCircle2 size={32} className="text-[#1E3329]" />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C2A277] font-semibold">
              Thank You for Your Patronage
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1E3329]">
              Your Order Has Been Confirmed
            </h1>
            <p className="text-xs sm:text-sm text-[#6B726D] max-w-lg mx-auto">
              Our master artisans have received your commission. A confirmation email with individual tracking details has been sent to{' '}
              <strong className="text-[#1E3329]">{latestOrder.customer.email}</strong>.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E3DC] text-xs mt-2">
              <span className="text-[#8C8275]">Order Reference:</span>
              <span className="font-mono font-bold text-[#1E3329]">{latestOrder.orderNumber}</span>
            </div>
          </div>

          {/* Key Status Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DC] space-y-1">
              <div className="flex items-center gap-1.5 text-[#1E3329] font-medium">
                <Clock size={14} className="text-[#C2A277]" />
                <span>Atelier Status</span>
              </div>
              <p className="font-semibold text-emerald-800 uppercase tracking-wider text-[11px]">
                {latestOrder.orderStatus}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DC] space-y-1">
              <div className="flex items-center gap-1.5 text-[#1E3329] font-medium">
                <Truck size={14} className="text-[#C2A277]" />
                <span>Estimated Delivery</span>
              </div>
              <p className="font-semibold text-[#1E3329]">
                {latestOrder.estimatedDelivery || '3–5 Business Days'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DC] space-y-1">
              <div className="flex items-center gap-1.5 text-[#1E3329] font-medium">
                <Award size={14} className="text-[#C2A277]" />
                <span>Authentication</span>
              </div>
              <p className="font-semibold text-[#1E3329]">
                Bespoke Certificate Enclosed
              </p>
            </div>
          </div>

          {/* Ordered Creations List with Preserved Colorway */}
          <div className="space-y-4">
            <h3 className="font-serif-luxury text-xl text-[#1E3329]">
              Commissioned Creations
            </h3>

            <div className="divide-y divide-[#E8E3DC] border-y border-[#E8E3DC]">
              {latestOrder.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-16 h-20 object-cover rounded-lg bg-[#F2EDE4] border border-[#E8E3DC] shrink-0"
                    />
                    <div>
                      <h4 className="font-serif-luxury text-base text-[#1E3329]">
                        {item.productName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#6B726D] mt-0.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: item.colorCode }}
                        ></span>
                        <span>Edition: {item.colorName}</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#8C8275]">
                        SKU: {item.sku}
                      </span>
                    </div>
                  </div>

                  <span className="font-serif-luxury text-base text-[#1E3329] font-medium">
                    ${(item.salePrice || item.price) * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#555C57] pt-2">
            <div>
              <h4 className="font-serif-luxury text-sm text-[#1E3329] mb-2 uppercase tracking-wider">
                Delivery Address
              </h4>
              <p className="font-medium text-[#1E3329]">{latestOrder.customer.fullName}</p>
              <p>{latestOrder.customer.addressLine1}</p>
              {latestOrder.customer.addressLine2 && <p>{latestOrder.customer.addressLine2}</p>}
              <p>
                {latestOrder.customer.city}, {latestOrder.customer.state} {latestOrder.customer.postalCode}
              </p>
              <p>{latestOrder.customer.country}</p>
              <p className="mt-1 text-[#8C8275]">{latestOrder.customer.phone}</p>
            </div>

            <div className="space-y-2 md:text-right">
              <h4 className="font-serif-luxury text-sm text-[#1E3329] mb-2 uppercase tracking-wider">
                Payment Summary
              </h4>
              <div className="flex justify-between md:justify-end md:gap-8">
                <span>Subtotal:</span>
                <span className="font-medium text-[#1E3329]">${latestOrder.subtotal}</span>
              </div>
              {latestOrder.discount > 0 && (
                <div className="flex justify-between md:justify-end md:gap-8 text-emerald-800">
                  <span>Privilege Courtesy:</span>
                  <span>-${latestOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between md:justify-end md:gap-8">
                <span>Insured Courier:</span>
                <span>{latestOrder.shipping === 0 ? 'Complimentary' : `$${latestOrder.shipping}`}</span>
              </div>
              <div className="flex justify-between md:justify-end md:gap-8 pt-2 border-t border-[#E8E3DC] font-serif-luxury text-xl text-[#1E3329]">
                <span>Total Settled:</span>
                <span className="font-semibold">${latestOrder.total}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#E8E3DC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePrint}
              className="text-xs uppercase tracking-wider font-semibold text-[#6B726D] hover:text-[#1E3329] flex items-center gap-2"
            >
              <Printer size={14} />
              <span>Print Order Receipt</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setActivePage('account')}
                className="flex-1 sm:flex-none px-6 py-3 border border-[#1E3329] text-[#1E3329] hover:bg-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded-full transition"
              >
                Track In Account
              </button>
              <button
                onClick={() => setActivePage('shop')}
                className="flex-1 sm:flex-none px-6 py-3 bg-[#1E3329] hover:bg-[#15241D] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded-full transition flex items-center justify-center gap-2"
              >
                <span>Continue Exploring</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
