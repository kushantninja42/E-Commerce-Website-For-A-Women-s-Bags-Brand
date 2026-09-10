import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { BagCategory } from '../types';

export const Navbar: React.FC<{ onOpenCart: () => void; onOpenAuth: () => void }> = ({
  onOpenCart,
  onOpenAuth,
}) => {
  const {
    activePage,
    setActivePage,
    cartItemCount,
    wishlist,
    currentUser,
    logout,
    quickSwitchRole,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const categories: { label: string; id: BagCategory }[] = [
    { label: 'Handbags', id: 'handbags' },
    { label: 'Tote Bags', id: 'totes' },
    { label: 'Shoulder Bags', id: 'shoulder-bags' },
    { label: 'Crossbody', id: 'crossbody' },
    { label: 'Mini Bags', id: 'mini-bags' },
    { label: 'Wallets', id: 'wallets' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('shop');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E3DC] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#1E3329] text-[#F3EFEA] px-4 py-2 text-xs text-center font-medium tracking-wider flex items-center justify-between sm:justify-center relative">
        <div className="flex items-center gap-2 mx-auto">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C2A277]"></span>
          <span>Complimentary White-Glove Insured Delivery on orders over $300</span>
          <span className="hidden md:inline text-[#C2A277] font-semibold ml-2">
            Use code AURELLE15 for 15% off
          </span>
        </div>

        {/* Quick Demo Role Switcher in header */}
        <div className="hidden lg:flex items-center gap-2 absolute right-4 text-[11px]">
          <span className="text-[#C2A277]/80">Quick Demo Mode:</span>
          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => quickSwitchRole('customer')}
              className="bg-[#2D483B] hover:bg-[#3B5D4D] text-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#C2A277]/40 transition"
              title="Switch to Customer view"
            >
              Switch to Customer
            </button>
          ) : (
            <button
              onClick={() => quickSwitchRole('admin')}
              className="bg-[#C2A277] hover:bg-[#B39366] text-[#1E3329] font-semibold px-2.5 py-0.5 rounded-full transition shadow-xs"
              title="Switch to Admin Director view"
            >
              Enter Admin Portal
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1E3329] hover:text-[#C2A277] transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Left Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-7 text-[13px] tracking-widest uppercase font-medium text-[#2C3E35]">
            <button
              onClick={() => setActivePage('shop', undefined, 'all')}
              className={`hover:text-[#C2A277] transition relative py-1 ${
                activePage === 'shop' ? 'text-[#1E3329] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#1E3329]' : ''
              }`}
            >
              All Bags
            </button>
            <button
              onClick={() => setActivePage('shop', undefined, 'handbags')}
              className="hover:text-[#C2A277] transition py-1"
            >
              Handbags
            </button>
            <button
              onClick={() => setActivePage('shop', undefined, 'totes')}
              className="hover:text-[#C2A277] transition py-1"
            >
              Totes
            </button>
            <button
              onClick={() => setActivePage('shop', undefined, 'shoulder-bags')}
              className="hover:text-[#C2A277] transition py-1"
            >
              Shoulder Bags
            </button>
            <button
              onClick={() => setActivePage('shop', undefined, 'crossbody')}
              className="hover:text-[#C2A277] transition py-1"
            >
              Crossbody
            </button>
            <button
              onClick={() => setActivePage('lookbook')}
              className="hover:text-[#C2A277] transition py-1 text-[#C2A277]"
            >
              Lookbook
            </button>
          </nav>

          {/* Center Brand Identity */}
          <div className="flex-1 lg:flex-initial text-center">
            <button
              onClick={() => setActivePage('home')}
              className="group inline-flex flex-col items-center justify-center focus:outline-none"
            >
              <span className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.25em] text-[#1E3329] uppercase font-light group-hover:text-[#C2A277] transition-colors duration-300">
                Aurelle
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#8C8275] uppercase font-sans-luxury -mt-0.5">
                Atelier Paris
              </span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Button & Overlay */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#1E3329] hover:text-[#C2A277] transition"
                aria-label="Search collection"
              >
                <Search size={20} strokeWidth={1.75} />
              </button>

              {searchOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search bags, colors, leather..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="flex-1 bg-white border border-[#E8E3DC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1E3329]"
                    />
                    <button
                      type="submit"
                      className="bg-[#1E3329] text-[#FAF8F5] px-4 py-2 rounded-lg text-xs tracking-wider uppercase font-medium hover:bg-[#2D483B] transition"
                    >
                      Find
                    </button>
                  </form>
                  <div className="mt-3 pt-2 border-t border-[#E8E3DC] flex flex-wrap gap-1.5 text-[11px] text-[#6B726D]">
                    <span className="text-[#8C8275]">Trending:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('Luna');
                        setActivePage('shop');
                        setSearchOpen(false);
                      }}
                      className="hover:underline text-[#1E3329]"
                    >
                      Luna Top Handle
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('Bordeaux');
                        setActivePage('shop');
                        setSearchOpen(false);
                      }}
                      className="hover:underline text-[#1E3329]"
                    >
                      Bordeaux Burgundy
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('Tote');
                        setActivePage('shop');
                        setSearchOpen(false);
                      }}
                      className="hover:underline text-[#1E3329]"
                    >
                      Solène Tote
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              type="button"
              onClick={() => setActivePage('wishlist')}
              className="p-2 text-[#1E3329] hover:text-[#C2A277] transition relative"
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.75} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C2A277] text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon & Counter */}
            <button
              type="button"
              onClick={onOpenCart}
              className="p-2 text-[#1E3329] hover:text-[#C2A277] transition relative"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} strokeWidth={1.75} />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#1E3329] text-[#FAF8F5] text-[10px] rounded-full flex items-center justify-center font-semibold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account / Admin Menu */}
            <div className="relative">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-[#F3EFEA] transition border border-transparent hover:border-[#E8E3DC]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1E3329] text-[#F3EFEA] flex items-center justify-center text-xs font-medium">
                    {currentUser.name.charAt(0)}
                  </div>
                  {currentUser.role === 'admin' && (
                    <span className="hidden md:inline-block text-[10px] font-semibold bg-[#C2A277]/20 text-[#A48356] px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                  <ChevronDown size={14} className="text-[#6B726D]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="p-2 text-[#1E3329] hover:text-[#C2A277] transition"
                  aria-label="Account sign in"
                >
                  <User size={20} strokeWidth={1.75} />
                </button>
              )}

              {/* User Dropdown */}
              {userDropdownOpen && currentUser && (
                <div
                  className="absolute right-0 mt-3 w-64 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl shadow-xl py-2 z-50"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#E8E3DC]">
                    <p className="text-xs text-[#8C8275]">Signed in as</p>
                    <p className="text-sm font-semibold text-[#1E3329] truncate">{currentUser.name}</p>
                    <p className="text-xs text-[#6B726D] truncate">{currentUser.email}</p>
                  </div>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => setActivePage('admin')}
                      className="w-full text-left px-4 py-2 text-sm text-[#1E3329] hover:bg-[#F3EFEA] flex items-center gap-2 font-medium"
                    >
                      <LayoutDashboard size={16} className="text-[#C2A277]" />
                      Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => setActivePage('account')}
                    className="w-full text-left px-4 py-2 text-sm text-[#1E3329] hover:bg-[#F3EFEA] flex items-center gap-2"
                  >
                    <User size={16} className="text-[#6B726D]" />
                    Order History & Account
                  </button>

                  <button
                    onClick={() => setActivePage('wishlist')}
                    className="w-full text-left px-4 py-2 text-sm text-[#1E3329] hover:bg-[#F3EFEA] flex items-center gap-2"
                  >
                    <Heart size={16} className="text-[#6B726D]" />
                    Saved Wishlist ({wishlist.length})
                  </button>

                  <div className="border-t border-[#E8E3DC] my-1"></div>

                  <div className="px-4 py-1.5 text-[11px] text-[#8C8275]">
                    Switch Profile Role:
                  </div>
                  <div className="px-4 py-1 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        quickSwitchRole('customer');
                        setUserDropdownOpen(false);
                      }}
                      className={`flex-1 text-xs py-1 rounded border text-center transition ${
                        currentUser.role === 'customer'
                          ? 'bg-[#1E3329] text-white border-[#1E3329]'
                          : 'bg-white border-[#E8E3DC] text-[#1E3329] hover:border-[#1E3329]'
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        quickSwitchRole('admin');
                        setUserDropdownOpen(false);
                      }}
                      className={`flex-1 text-xs py-1 rounded border text-center transition ${
                        currentUser.role === 'admin'
                          ? 'bg-[#C2A277] text-[#1E3329] font-semibold border-[#C2A277]'
                          : 'bg-white border-[#E8E3DC] text-[#1E3329] hover:border-[#1E3329]'
                      }`}
                    >
                      Admin
                    </button>
                  </div>

                  <div className="border-t border-[#E8E3DC] my-1"></div>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-[#9C4331] hover:bg-[#F3EFEA] flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-28 bg-[#FAF8F5] z-40 p-6 overflow-y-auto border-t border-[#E8E3DC] animate-in slide-in-from-left duration-200">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8C8275] mb-3">Categories</p>
              <div className="space-y-3 text-base">
                <button
                  onClick={() => {
                    setActivePage('shop', undefined, 'all');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-1 text-[#1E3329] font-medium"
                >
                  View All Bags & Wallets
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActivePage('shop', undefined, cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-1 text-[#1E3329] hover:text-[#C2A277]"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E3DC] space-y-3">
              <button
                onClick={() => {
                  setActivePage('lookbook');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-[#C2A277] font-serif-luxury text-lg"
              >
                Editorial Lookbook
              </button>
              {currentUser?.role === 'admin' ? (
                <button
                  onClick={() => {
                    setActivePage('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-[#1E3329] font-semibold flex items-center gap-2"
                >
                  <LayoutDashboard size={18} className="text-[#C2A277]" />
                  Admin Dashboard Portal
                </button>
              ) : (
                <button
                  onClick={() => {
                    quickSwitchRole('admin');
                    setActivePage('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-[#1E3329] font-semibold flex items-center gap-2"
                >
                  <Sparkles size={18} className="text-[#C2A277]" />
                  Open Admin Mode
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
