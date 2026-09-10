import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './components/HomePage';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { AccountPage } from './components/AccountPage';
import { WishlistPage } from './components/WishlistPage';
import { AdminPanel } from './components/AdminPanel';
import { LookbookPage } from './components/LookbookPage';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activePage, currentUser } = useShop();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E3329] selection:bg-[#E8DAC6] selection:text-[#1E3329]">
      {/* Primary Brand Navigation */}
      <Navbar onOpenCart={() => setIsCartDrawerOpen(true)} />

      {/* Slide-over Quick Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activePage === 'home' && <HomePage />}
        {activePage === 'shop' && <ShopPage />}
        {activePage === 'product' && <ProductDetailPage />}
        {activePage === 'cart' && <CartPage />}
        {activePage === 'checkout' && <CheckoutPage />}
        {activePage === 'order-success' && <OrderSuccessPage />}
        {activePage === 'account' && <AccountPage />}
        {activePage === 'wishlist' && <WishlistPage />}
        {activePage === 'admin' && <AdminPanel />}
        {activePage === 'lookbook' && <LookbookPage />}
      </main>

      {/* Atelier Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
