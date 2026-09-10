import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setActivePage } = useShop();

  return (
    <section className="relative bg-[#F4EFEB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DAC6]/60 border border-[#C2A277]/40 text-[#1E3329] text-xs uppercase tracking-widest font-medium">
              <Sparkles size={12} className="text-[#A48356]" />
              <span>Spring / Summer 2026 Collection</span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-[#1E3329] font-normal leading-[1.12] tracking-tight">
              Sculpted in Leather. <br className="hidden sm:inline" />
              <span className="italic font-light text-[#A48356]">Defined by Grace.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#555C57] font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Every Aurelle creation is sculpted from certified full-grain Italian calfskin,
              finished with bespoke brushed gold fittings and designed to grow more luminous with every journey.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setActivePage('shop', undefined, 'all')}
                className="w-full sm:w-auto px-8 py-4 bg-[#1E3329] hover:bg-[#15241D] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 group"
              >
                <span>Explore The Atelier</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActivePage('shop', undefined, 'handbags')}
                className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-[#FAF8F5] text-[#1E3329] border border-[#1E3329]/30 hover:border-[#1E3329] text-xs uppercase tracking-[0.2em] font-semibold rounded-full transition-all"
              >
                Signature Handbags
              </button>
            </div>

            {/* Quick Atelier Metric Bar */}
            <div className="grid grid-cols-3 pt-6 border-t border-[#E8E3DC] max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="font-serif-luxury text-2xl text-[#1E3329]">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-[#8C8275]">Italian Calfskin</p>
              </div>
              <div>
                <p className="font-serif-luxury text-2xl text-[#1E3329]">18 hrs</p>
                <p className="text-[11px] uppercase tracking-wider text-[#8C8275]">Hand Finishing</p>
              </div>
              <div>
                <p className="font-serif-luxury text-2xl text-[#1E3329]">Lifetime</p>
                <p className="text-[11px] uppercase tracking-wider text-[#8C8275]">Care Guarantee</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Collage */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=85"
                  alt="Aurelle Luna Handbag in Noir"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-[#E8DAC6]">
                    Featured Masterpiece
                  </span>
                  <p className="font-serif-luxury text-2xl">The Luna Structured Bag</p>
                  <p className="text-xs text-[#FAF8F5]/90">Sculpted Trapeze Silhouette in Noir & Gold</p>
                </div>
              </div>

              {/* Floating Floating Accent Card */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-[#E8E3DC] items-center gap-4 max-w-xs animate-in fade-in duration-500">
                <img
                  src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=300&auto=format&fit=crop&q=80"
                  alt="Micro Vanity in Crème"
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div>
                  <p className="text-xs font-semibold text-[#1E3329]">Instant Color Switching</p>
                  <p className="text-[11px] text-[#6B726D]">Over 4 bespoke artisan hues per silhouette</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
