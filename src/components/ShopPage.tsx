import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { BagCategory } from '../types';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 600]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest' | 'rating'>('featured');
  const [visibleCount, setVisibleCount] = useState(9);

  const categories: { label: string; id: BagCategory | 'all' }[] = [
    { label: 'All Collections', id: 'all' },
    { label: 'Handbags & Satchels', id: 'handbags' },
    { label: 'Tote Bags', id: 'totes' },
    { label: 'Shoulder Bags', id: 'shoulder-bags' },
    { label: 'Crossbody Bags', id: 'crossbody' },
    { label: 'Mini Bags', id: 'mini-bags' },
    { label: 'Wallets', id: 'wallets' },
  ];

  const colorPalette = [
    { name: 'Noir', code: '#1A1A1A' },
    { name: 'Crème', code: '#F4EFE6' },
    { name: 'Cognac', code: '#8B4513' },
    { name: 'Burgundy', code: '#5B1E2B' },
    { name: 'Forest', code: '#1E3329' },
    { name: 'Taupe', code: '#A89F91' },
  ];

  const collections = ['Modern Classic', 'Atelier Heritage', 'Minimalist Edit'];

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const toggleCollection = (col: string) => {
    setSelectedCollections((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedColors([]);
    setSelectedCollections([]);
    setPriceRange([0, 600]);
    setOnlyInStock(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedColors.length > 0 ||
    selectedCollections.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 600 ||
    onlyInStock ||
    Boolean(searchQuery);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchColor = p.variants.some((v) => v.colorName.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchCat && !matchColor) return false;
      }

      // 2. Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // 3. Price
      const effectivePrice = p.salePrice || p.price;
      if (effectivePrice < priceRange[0] || effectivePrice > priceRange[1]) {
        return false;
      }

      // 4. Color
      if (selectedColors.length > 0) {
        const hasMatchingColor = p.variants.some((variant) =>
          selectedColors.some((c) => variant.colorName.toLowerCase().includes(c.toLowerCase()))
        );
        if (!hasMatchingColor) return false;
      }

      // 5. Collection
      if (selectedCollections.length > 0) {
        if (!p.collection || !selectedCollections.includes(p.collection)) {
          return false;
        }
      }

      // 6. In Stock
      if (onlyInStock) {
        const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
        if (totalStock <= 0) return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery, selectedColors, selectedCollections, priceRange, onlyInStock]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      case 'price-high':
        return list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      case 'featured':
      default:
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Category Header */}
        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C8275] font-semibold">
            Catalog & Editions
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#1E3329] mt-1">
            {selectedCategory === 'all'
              ? 'Complete Leather Collection'
              : categories.find((c) => c.id === selectedCategory)?.label}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B726D] mt-2 max-w-2xl">
            Each bag is crafted with vegetable-tanned Italian calfskin and custom brushed hardware. Select any color swatch to preview instant shade variations.
          </p>
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#E8E3DC] scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase font-medium whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#1E3329] text-[#FAF8F5] shadow-xs'
                    : 'bg-white text-[#1E3329] border border-[#E8E3DC] hover:border-[#C2A277]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search, Filter Toggle, Sort Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-[#E8E3DC] shadow-xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg text-xs font-semibold text-[#1E3329]"
            >
              <Filter size={14} />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {/* Search within shop */}
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8275]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bags or leather..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg focus:outline-none focus:border-[#1E3329]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8275] hover:text-[#1E3329]"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto text-xs">
            <span className="text-[#8C8275]">
              Showing <strong className="text-[#1E3329]">{sortedProducts.length}</strong> creations
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[#8C8275] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg px-3 py-1.5 text-xs font-medium text-[#1E3329] focus:outline-none focus:border-[#1E3329]"
              >
                <option value="featured">Featured Curations</option>
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Patron Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-[#E8E3DC] space-y-6">
              {/* Header with Clear button */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DC]">
                <h3 className="text-xs font-semibold tracking-wider uppercase text-[#1E3329] flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-[#C2A277]" />
                  Refine Selection
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] text-[#9C4331] hover:underline flex items-center gap-1"
                  >
                    <RotateCcw size={10} />
                    Reset
                  </button>
                )}
              </div>

              {/* Color Variations Filter */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1E3329] mb-3">
                  Colorway Variations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {colorPalette.map((color) => {
                    const isSelected = selectedColors.includes(color.name);
                    return (
                      <button
                        key={color.name}
                        onClick={() => toggleColor(color.name)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition border ${
                          isSelected
                            ? 'bg-[#1E3329] text-white border-[#1E3329]'
                            : 'bg-[#FAF8F5] text-[#1E3329] border-[#E8E3DC] hover:border-[#1E3329]'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: color.code }}
                        ></span>
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#1E3329] mb-2">
                  <span className="uppercase tracking-wider">Price Range</span>
                  <span className="text-[#A48356] font-mono">
                    ${priceRange[0]} — ${priceRange[1]}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={600}
                  step={20}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-[#1E3329] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#8C8275] mt-1">
                  <span>$100</span>
                  <span>$350</span>
                  <span>$600</span>
                </div>
              </div>

              {/* Collections Filter */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1E3329] mb-2">
                  Curated Collection
                </h4>
                <div className="space-y-1.5 text-xs">
                  {collections.map((col) => {
                    const isSelected = selectedCollections.includes(col);
                    return (
                      <label
                        key={col}
                        className="flex items-center gap-2 cursor-pointer text-[#555C57] hover:text-[#1E3329]"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCollection(col)}
                          className="rounded text-[#1E3329] focus:ring-0"
                        />
                        <span>{col}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* In Stock Only Toggle */}
              <div className="pt-3 border-t border-[#E8E3DC]">
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="font-medium text-[#1E3329]">In Stock in Atelier Only</span>
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded text-[#1E3329] focus:ring-0"
                  />
                </label>
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9">
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E3DC] space-y-4">
                <Sparkles size={36} className="mx-auto text-[#C2A277]" />
                <h3 className="font-serif-luxury text-2xl text-[#1E3329]">No Creations Found</h3>
                <p className="text-xs text-[#6B726D] max-w-md mx-auto">
                  No products matched your exact filter combination. Try resetting your price or color filters to discover available atelier editions.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#1E3329] text-[#FAF8F5] rounded-full text-xs uppercase tracking-wider font-medium hover:bg-[#2D483B] transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More Button if more exist */}
                {sortedProducts.length > visibleCount && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="px-8 py-3.5 bg-white hover:bg-[#FAF8F5] text-[#1E3329] border border-[#1E3329] rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition shadow-xs hover:shadow"
                    >
                      Load More Creations ({sortedProducts.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Responsive Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E3DC]">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-[#1E3329]">
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#6B726D] hover:text-[#1E3329]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Colorways */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1E3329] mb-3">
                  Colorway
                </h4>
                <div className="flex flex-wrap gap-2">
                  {colorPalette.map((color) => {
                    const isSelected = selectedColors.includes(color.name);
                    return (
                      <button
                        key={color.name}
                        onClick={() => toggleColor(color.name)}
                        className={`px-3 py-1 rounded-full text-xs transition border ${
                          isSelected
                            ? 'bg-[#1E3329] text-white border-[#1E3329]'
                            : 'bg-[#FAF8F5] text-[#1E3329] border-[#E8E3DC]'
                        }`}
                      >
                        {color.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#1E3329] mb-2">
                  <span>Max Price: ${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={600}
                  step={20}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-[#1E3329]"
                />
              </div>

              {/* In stock */}
              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span>In Stock Only</span>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-[#1E3329]"
                />
              </label>
            </div>

            <div className="pt-6 border-t border-[#E8E3DC] flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 text-xs uppercase tracking-wider border border-[#E8E3DC] rounded-xl font-medium"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 text-xs uppercase tracking-wider bg-[#1E3329] text-white rounded-xl font-semibold"
              >
                View {sortedProducts.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
