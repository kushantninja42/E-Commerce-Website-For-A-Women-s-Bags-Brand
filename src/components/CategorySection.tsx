import React from 'react';
import { CATEGORIES } from '../data/initialProducts';
import { useShop } from '../context/ShopContext';
import { ArrowUpRight } from 'lucide-react';
import { BagCategory } from '../types';

export const CategorySection: React.FC = () => {
  const { setActivePage } = useShop();

  const handleCategoryClick = (id: BagCategory) => {
    setActivePage('shop', undefined, id);
  };

  return (
    <section className="py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E8E3DC]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C8275] font-semibold">
              Curated Classifications
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1E3329] mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => setActivePage('shop', undefined, 'all')}
            className="mt-3 md:mt-0 text-xs uppercase tracking-[0.2em] font-semibold text-[#1E3329] hover:text-[#C2A277] transition flex items-center gap-1 group"
          >
            <span>View All Collections</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group cursor-pointer flex flex-col rounded-xl overflow-hidden bg-white border border-[#E8E3DC]/70 hover:border-[#C2A277] transition-all duration-300 hover:shadow-md"
            >
              <div className="relative aspect-[3/4] w-full bg-[#F2EDE4] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-serif-luxury text-sm sm:text-base leading-tight font-medium">
                    {category.name}
                  </p>
                  <p className="text-[10px] text-[#FAF8F5]/80 uppercase tracking-widest mt-0.5">
                    {category.itemCount || 3} Styles
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
