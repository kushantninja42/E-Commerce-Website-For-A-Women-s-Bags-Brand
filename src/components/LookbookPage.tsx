import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles, Feather } from 'lucide-react';

export const LookbookPage: React.FC = () => {
  const { setActivePage } = useShop();

  const looks = [
    {
      season: 'Édition N° 01 — Spring Sunrise',
      title: 'Architectural Minimalist in Ivory & Camel',
      description:
        'A dialogue between soft tailored silhouettes and structured boxy geometry. Pair our Vivienne Arc Flap with warm cashmere overcoats and crisp raw linen.',
      image:
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&auto=format&fit=crop&q=85',
      featuredProduct: 'vivienne-arc-flap',
      productName: 'Vivienne Arc Flap',
      tag: 'Editorial Feature',
    },
    {
      season: 'Édition N° 02 — Saint-Germain Evening',
      title: 'Noir Trapeze & Brushed 24k Gold Accents',
      description:
        'Understated drama for twilight salons and gallery vernissages. The Luna bag’s sculpted profile adds intentional gravitas to fluid evening silks.',
      image:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=85',
      featuredProduct: 'luna-structured-bag',
      productName: 'The Luna Structured Bag',
      tag: 'Patron Favorite',
    },
    {
      season: 'Édition N° 03 — The Grand Voyage',
      title: 'Unstructured Comfort in Warm Caramel Grain',
      description:
        'Engineered for continental transits and studio mornings. The Solène Grand Tote balances effortless carry volume with precise edge-burnished European leathercraft.',
      image:
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&auto=format&fit=crop&q=85',
      featuredProduct: 'solene-grand-tote',
      productName: 'Solène Grand Everyday Tote',
      tag: 'Atelier Classic',
    },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DAC6]/50 border border-[#C2A277]/40 text-xs text-[#1E3329] uppercase tracking-widest font-semibold">
            <Feather size={12} className="text-[#A48356]" />
            <span>Seasonal Journal</span>
          </div>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#1E3329]">
            The Aurelle Lookbook
          </h1>
          <p className="text-xs sm:text-sm text-[#6B726D] leading-relaxed">
            Explorations in proportion, tone harmony, and organic materiality curated by our Paris design studio.
          </p>
        </div>

        {/* Looks List */}
        <div className="space-y-20">
          {looks.map((look, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div
                className={`lg:col-span-7 ${
                  idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-lg border border-[#E8E3DC]">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-[#1E3329]">
                    {look.tag}
                  </div>
                </div>
              </div>

              <div
                className={`lg:col-span-5 space-y-4 ${
                  idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <span className="text-xs uppercase tracking-[0.25em] text-[#C2A277] font-semibold">
                  {look.season}
                </span>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#1E3329] leading-tight">
                  {look.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#555C57] leading-relaxed">
                  {look.description}
                </p>

                <div className="pt-3">
                  <button
                    onClick={() => setActivePage('product', look.featuredProduct)}
                    className="px-6 py-3 bg-[#1E3329] hover:bg-[#15241D] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-full transition shadow-xs flex items-center gap-2"
                  >
                    <span>Acquire {look.productName}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
