import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Mail, Check, ArrowRight, Instagram, Facebook, Twitter, Pin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#15241D] text-[#FAF8F5] pt-16 pb-12 border-t border-[#1E3329]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Strip */}
        <div className="pb-12 border-b border-[#2D483B] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C2A277] font-semibold">
              The Aurelle Circle
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light">
              Receive private salon invitations & new edition alerts.
            </h3>
            <p className="text-xs text-[#E8DAC6]/70 max-w-md">
              Be the first to secure limited batch runs and receive our seasonal style dispatch directly from Paris.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-[#1E3329] border border-[#C2A277]/40 text-[#FAF8F5] text-sm">
                <Check size={18} className="text-[#C2A277]" />
                <span>Welcome to the Aurelle Circle. Your 15% preview voucher is active.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8275]"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#1E3329] border border-[#2D483B] text-sm text-[#FAF8F5] placeholder-[#8C8275] focus:outline-none focus:border-[#C2A277]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#C2A277] hover:bg-[#B39366] text-[#15241D] text-xs uppercase tracking-[0.2em] font-semibold rounded-xl transition flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Join</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Navigation Columns */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-xs">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <span className="font-serif-luxury text-2xl tracking-[0.2em] uppercase text-[#FAF8F5]">
              Aurelle
            </span>
            <p className="text-[#C2A277] tracking-[0.3em] uppercase text-[10px] -mt-2">
              Atelier de Maroquinerie • Paris
            </p>
            <p className="text-[#E8DAC6]/70 leading-relaxed max-w-sm">
              Sculptural silhouettes crafted from certified Italian vegetable-tanned leather.
              Honoring slow fashion, architectural grace, and lifetime companionship.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="p-2 rounded-full bg-[#1E3329] hover:bg-[#C2A277] hover:text-[#15241D] transition" aria-label="Instagram">
                <Instagram size={14} />
              </a>
              <a href="#" className="p-2 rounded-full bg-[#1E3329] hover:bg-[#C2A277] hover:text-[#15241D] transition" aria-label="Facebook">
                <Facebook size={14} />
              </a>
              <a href="#" className="p-2 rounded-full bg-[#1E3329] hover:bg-[#C2A277] hover:text-[#15241D] transition" aria-label="Twitter">
                <Twitter size={14} />
              </a>
            </div>
          </div>

          {/* Col 1: Collections */}
          <div className="space-y-3">
            <h4 className="uppercase tracking-[0.2em] font-semibold text-[#C2A277]">Collections</h4>
            <ul className="space-y-2 text-[#E8DAC6]/80">
              <li>
                <button onClick={() => setActivePage('shop', undefined, 'handbags')} className="hover:text-white transition">
                  Handbags & Satchels
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('shop', undefined, 'totes')} className="hover:text-white transition">
                  Everyday Totes
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('shop', undefined, 'shoulder-bags')} className="hover:text-white transition">
                  Shoulder Bags
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('shop', undefined, 'crossbody')} className="hover:text-white transition">
                  Crossbody Bags
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('shop', undefined, 'mini-bags')} className="hover:text-white transition">
                  Mini Bags & Vanity
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('shop', undefined, 'wallets')} className="hover:text-white transition">
                  Wallets & Small Leather
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Customer Care */}
          <div className="space-y-3">
            <h4 className="uppercase tracking-[0.2em] font-semibold text-[#C2A277]">Customer Care</h4>
            <ul className="space-y-2 text-[#E8DAC6]/80">
              <li>
                <button onClick={() => setActivePage('account')} className="hover:text-white transition">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('shop')} className="hover:text-white transition">
                  Complimentary Shipping
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('shop')} className="hover:text-white transition">
                  30-Day Returns Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('lookbook')} className="hover:text-white transition">
                  Leather Care & Restoration
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('account')} className="hover:text-white transition">
                  Artisan Certificate Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Atelier & Admin */}
          <div className="space-y-3">
            <h4 className="uppercase tracking-[0.2em] font-semibold text-[#C2A277]">The Atelier</h4>
            <ul className="space-y-2 text-[#E8DAC6]/80">
              <li>
                <button onClick={() => setActivePage('lookbook')} className="hover:text-white transition">
                  Editorial Lookbook
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('admin')} className="hover:text-white text-[#C2A277] font-semibold transition">
                  Director Admin Portal
                </button>
              </li>
              <li>
                <span className="text-[#8C8275]">28 Rue du Faubourg Saint-Honoré</span>
              </li>
              <li>
                <span className="text-[#8C8275]">75008 Paris, France</span>
              </li>
              <li>
                <span className="text-[#8C8275]">concierge@aurelle-atelier.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2D483B] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C8275] gap-4">
          <p>© 2026 Aurelle Atelier Paris Inc. Handcrafted luxury leather goods. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Charter</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
