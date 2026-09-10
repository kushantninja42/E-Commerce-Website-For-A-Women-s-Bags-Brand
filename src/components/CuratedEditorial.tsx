import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight } from 'lucide-react';

export const CuratedEditorial: React.FC = () => {
  const { setActivePage } = useShop();

  return (
    <section className="py-16 bg-[#F4EFEB] border-y border-[#E8E3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Editorial Visual */}
          <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&auto=format&fit=crop&q=85"
              alt="Artisan leathercrafting atelier"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-6 left-6 bg-[#FAF8F5]/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest text-[#1E3329] font-medium">
              Atelier Heritage
            </div>
          </div>

          {/* Editorial Content */}
          <div className="space-y-6 lg:pl-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C8275] font-semibold">
              The Philosophy of Aurelle
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#1E3329] leading-[1.18]">
              Slow luxury, crafted without compromise.
            </h2>
            <p className="text-base text-[#555C57] leading-relaxed">
              In a world of fleeting cycles, Aurelle honors the enduring traditions of European leathercraft.
              Each bag begins in family-run Tuscan tanneries, utilizing natural chestnut and quebracho barks
              to develop a rich patina that evolves uniquely alongside its keeper.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1E3329] text-[#FAF8F5] flex items-center justify-center text-xs font-serif-luxury mt-0.5">
                  I
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1E3329]">Certified Traceable Leather</h4>
                  <p className="text-xs text-[#6B726D]">Sourced exclusively as certified by-products of European agriculture.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1E3329] text-[#FAF8F5] flex items-center justify-center text-xs font-serif-luxury mt-0.5">
                  II
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1E3329]">Seamless Color Variation Matching</h4>
                  <p className="text-xs text-[#6B726D]">Every single hue is tailored with bespoke coated edging and bespoke tone-matched thread.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1E3329] text-[#FAF8F5] flex items-center justify-center text-xs font-serif-luxury mt-0.5">
                  III
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1E3329]">Direct-to-Collector Transparency</h4>
                  <p className="text-xs text-[#6B726D]">No distributor markups. Exceptional luxury craftsmanship accessible directly.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setActivePage('shop', undefined, 'all')}
                className="px-8 py-3.5 bg-[#1E3329] hover:bg-[#15241D] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-full transition flex items-center gap-2"
              >
                <span>Explore Curated Styles</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
