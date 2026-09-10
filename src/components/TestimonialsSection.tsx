import React from 'react';
import { Star, ShieldCheck, RefreshCw, Truck, Award } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'The Luna Bag in Noir is the single most complimented accessory in my wardrobe. The weight of the gold lock and the richness of the leather rivals bags five times the cost.',
      author: 'Camille Leroux',
      role: 'Fashion Editor, Paris',
      item: 'Luna Structured Bag in Noir Black',
    },
    {
      quote:
        'Selecting the Crème Ivory variation was effortless on the site. When it arrived in its velvet dust bag, the color was even more stunning than on screen. Flawless stitching.',
      author: 'Eleanor Sterling',
      role: 'Architect, New York',
      item: 'Vivienne Arc Flap in French Vanilla',
    },
    {
      quote:
        'Finally a grand tote that does not collapse when set down! The Solène fits my laptop and sketchbook with pure European sophistication. Truly an heirloom piece.',
      author: 'Dr. Vivienne Thorne',
      role: 'Curator, London',
      item: 'Solène Grand Everyday Tote in Warm Caramel',
    },
  ];

  return (
    <section className="py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C8275] font-semibold">
            Patron Reflections
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1E3329] mt-1">
            Praised by Modern Connoisseurs
          </h2>
          <div className="flex items-center justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="fill-[#C2A277] text-[#C2A277]" />
            ))}
            <span className="text-xs font-semibold text-[#1E3329] ml-2">4.9 / 5.0 Average Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-[#E8E3DC] shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-[#C2A277]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#C2A277]" />
                  ))}
                </div>
                <p className="font-serif-luxury text-lg text-[#1E3329] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-[#E8E3DC] mt-6">
                <p className="text-sm font-semibold text-[#1E3329]">{t.author}</p>
                <p className="text-xs text-[#8C8275]">{t.role}</p>
                <p className="text-[11px] text-[#A48356] font-medium mt-1 uppercase tracking-wider">
                  Verified Patron • {t.item}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TrustFeatures: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'Insured White-Glove Dispatch',
      desc: 'Complimentary shipping on orders over $300 with signature delivery confirmation.',
    },
    {
      icon: Award,
      title: 'Artisan Authenticity Certificate',
      desc: 'Each creation is individually numbered and accompanied by a master leather certificate.',
    },
    {
      icon: RefreshCw,
      title: '30-Day Complimentary Returns',
      desc: 'Enjoy effortless return pickup and exchanges in original pristine packaging.',
    },
    {
      icon: ShieldCheck,
      title: 'Lifetime Atelier Care Guarantee',
      desc: 'Complimentary stitching repairs and leather conditioning support for life.',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-[#E8E3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E3DC] text-[#1E3329] shrink-0">
                  <Icon size={22} className="text-[#A48356]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1E3329] mb-1">{feat.title}</h4>
                  <p className="text-xs text-[#6B726D] leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
