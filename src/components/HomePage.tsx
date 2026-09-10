import React from 'react';
import { HeroBanner } from './HeroBanner';
import { CategorySection } from './CategorySection';
import { ProductCard } from './ProductCard';
import { CuratedEditorial } from './CuratedEditorial';
import { TestimonialsSection, TrustFeatures } from './TestimonialsSection';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles, Instagram } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, setActivePage } = useShop();

  const featuredCreations = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestsellerCreations = products.filter((p) => p.isBestseller).slice(0, 3);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <div>
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Trust Badges & Atelier Guarantees */}
      <TrustFeatures />

      {/* 3. Category Showcase */}
      <CategorySection />

      {/* 4. Featured Iconic Silhouettes */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8E3DC] gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C8275] font-semibold">
                Signature Curations
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1E3329] mt-1">
                Iconic Atelier Pieces
              </h2>
            </div>
            <button
              onClick={() => setActivePage('shop', undefined, 'all')}
              className="text-xs uppercase tracking-[0.2em] font-semibold text-[#1E3329] hover:text-[#C2A277] transition flex items-center gap-1.5"
            >
              <span>Explore All Icons</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCreations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Heritage Narrative */}
      <CuratedEditorial />

      {/* 6. Bestsellers & Collector Favorites */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8E3DC] gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C8275] font-semibold">
                Most Coveted
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1E3329] mt-1">
                Bestselling Companions
              </h2>
            </div>
            <button
              onClick={() => setActivePage('shop', undefined, 'all')}
              className="text-xs uppercase tracking-[0.2em] font-semibold text-[#1E3329] hover:text-[#C2A277] transition flex items-center gap-1.5"
            >
              <span>View Full Selection</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bestsellerCreations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Patron Reflections & Testimonials */}
      <TestimonialsSection />

      {/* 8. Instagram & Patron Community Mosaic */}
      <section className="py-16 bg-white border-t border-[#E8E3DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C8275] font-semibold flex items-center justify-center gap-1.5">
              <Instagram size={14} className="text-[#C2A277]" />
              #AurelleAtelier
            </span>
            <h2 className="font-serif-luxury text-3xl text-[#1E3329]">
              Styled Around the Globe
            </h2>
            <p className="text-xs text-[#6B726D]">
              Tag @AurelleAtelier on Instagram to be featured in our private salon gallery.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="group relative aspect-square rounded-xl overflow-hidden shadow-xs cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80"
                alt="Aurelle in Paris"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-serif-luxury">
                @camille.parisian
              </div>
            </div>

            <div className="group relative aspect-square rounded-xl overflow-hidden shadow-xs cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80"
                alt="Luna in Milan"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-serif-luxury">
                @eleanor_ny
              </div>
            </div>

            <div className="group relative aspect-square rounded-xl overflow-hidden shadow-xs cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&auto=format&fit=crop&q=80"
                alt="Mini Vanity in London"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-serif-luxury">
                @vivienne.t
              </div>
            </div>

            <div className="group relative aspect-square rounded-xl overflow-hidden shadow-xs cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80"
                alt="Solene Tote in Tokyo"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-serif-luxury">
                @atelier.voyages
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
