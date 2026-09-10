import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Order,
  ProductReview,
  UserProfile,
  CartItem,
  ActivePage,
  BagCategory,
  OrderStatus,
  Coupon,
} from '../types';
import { StoreService } from '../services/storeService';
import { ACTIVE_COUPONS } from '../data/initialProducts';

interface ShopContextType {
  products: Product[];
  orders: Order[];
  reviews: ProductReview[];
  cart: CartItem[];
  wishlist: string[];
  currentUser: UserProfile | null;
  activePage: ActivePage;
  selectedProductId: string | null;
  selectedCategory: BagCategory | 'all';
  searchQuery: string;
  appliedCoupon: Coupon | null;
  lastCreatedOrder: Order | null;
  
  // Navigation
  setActivePage: (page: ActivePage, productId?: string, category?: BagCategory | 'all') => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: BagCategory | 'all') => void;
  
  // Cart
  addToCart: (product: Product, variantId: string, quantity?: number) => { success: boolean; message: string };
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  cartItemCount: number;
  
  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Coupon
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Orders
  placeOrder: (orderData: {
    customer: Order['customer'];
    paymentMethod: Order['paymentMethod'];
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string, trackingNumber?: string) => void;
  
  // Product Management (Admin)
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  // Reviews
  addReview: (review: Omit<ProductReview, 'id' | 'date'>) => void;
  
  // Auth
  login: (email: string, role?: 'admin' | 'customer', name?: string) => void;
  logout: () => void;
  quickSwitchRole: (role: 'admin' | 'customer') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => StoreService.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => StoreService.getOrders());
  const [reviews, setReviews] = useState<ProductReview[]>(() => StoreService.getReviews());
  const [cart, setCart] = useState<CartItem[]>(() => StoreService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => StoreService.getWishlist());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => StoreService.getUser());

  const [activePage, setActivePageInternal] = useState<ActivePage>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BagCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Sync state to local storage when changed
  useEffect(() => {
    StoreService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    StoreService.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    StoreService.saveReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    StoreService.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    StoreService.saveWishlist(wishlist);
  }, [wishlist]);

  useEffect(() => {
    StoreService.saveUser(currentUser);
  }, [currentUser]);

  // Scroll to top on page change
  const setActivePage = (page: ActivePage, productId?: string, category?: BagCategory | 'all') => {
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    if (category !== undefined) {
      setSelectedCategory(category);
    }
    setActivePageInternal(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const itemPrice = item.salePrice || item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      cartDiscount = (cartSubtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount) {
      cartDiscount = Math.min(appliedCoupon.discountAmount, cartSubtotal);
    }
  }

  // Complimentary luxury shipping on orders over $300, else $25 flat
  const cartShipping = cartSubtotal === 0 ? 0 : cartSubtotal >= 300 ? 0 : 25;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Add to cart with color variation preservation
  const addToCart = (product: Product, variantId: string, quantity = 1) => {
    const variant = product.variants.find((v) => v.variantId === variantId) || product.variants[0];
    if (!variant) {
      return { success: false, message: 'Selected variant is not available' };
    }

    if (variant.stock <= 0) {
      return { success: false, message: 'This color variation is currently out of stock' };
    }

    const cartItemId = `${product.id}_${variant.variantId}`;
    const existingIndex = cart.findIndex((item) => item.id === cartItemId);

    if (existingIndex > -1) {
      const existingItem = cart[existingIndex];
      const newQty = existingItem.quantity + quantity;
      if (newQty > variant.stock) {
        return {
          success: false,
          message: `Only ${variant.stock} available in stock for this color`,
        };
      }
      const updated = [...cart];
      updated[existingIndex] = { ...existingItem, quantity: newQty };
      setCart(updated);
    } else {
      if (quantity > variant.stock) {
        return {
          success: false,
          message: `Only ${variant.stock} available in stock for this color`,
        };
      }
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        productName: product.name,
        variantId: variant.variantId,
        colorName: variant.colorName,
        colorCode: variant.colorCode,
        image: variant.images[0] || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
        price: variant.priceOverride || product.price,
        salePrice: product.salePrice,
        quantity,
        maxStock: variant.stock,
      };
      setCart([...cart, newItem]);
    }

    return { success: true, message: `Added ${product.name} (${variant.colorName}) to your shopping bag` };
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const clampedQty = Math.min(quantity, item.maxStock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (currentUser) {
        setCurrentUser({ ...currentUser, wishlist: updated });
      }
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon application
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = ACTIVE_COUPONS.find((c) => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid promotional code' };
    }
    if (found.minSpend && cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `This coupon requires a minimum spend of $${found.minSpend}`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon applied: ${found.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Place Order with Stock Decrement and Database Record Creation
  const placeOrder = async (orderData: {
    customer: Order['customer'];
    paymentMethod: Order['paymentMethod'];
  }): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Your shopping bag is empty' };
    }

    // 1. Verify stock for all items
    for (const item of cart) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return { success: false, error: `Product ${item.productName} no longer exists` };
      }
      const variant = product.variants.find((v) => v.variantId === item.variantId);
      if (!variant || variant.stock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${item.productName} in ${item.colorName}. Only ${variant?.stock || 0} remaining.`,
        };
      }
    }

    // 2. Decrement inventory
    const updatedProducts = products.map((product) => {
      const itemsForProduct = cart.filter((i) => i.productId === product.id);
      if (itemsForProduct.length === 0) return product;

      const updatedVariants = product.variants.map((v) => {
        const cartMatch = itemsForProduct.find((i) => i.variantId === v.variantId);
        if (cartMatch) {
          const newStock = Math.max(0, v.stock - cartMatch.quantity);
          return {
            ...v,
            stock: newStock,
            isAvailable: newStock > 0,
          };
        }
        return v;
      });

      return {
        ...product,
        variants: updatedVariants,
      };
    });

    // 3. Generate unique order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `AUR-${new Date().getFullYear()}-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      variantId: item.variantId,
      colorName: item.colorName,
      colorCode: item.colorCode,
      image: item.image,
      unitPrice: item.salePrice || item.price,
      quantity: item.quantity,
      totalPrice: (item.salePrice || item.price) * item.quantity,
    }));

    const newOrder: Order = {
      id: orderId,
      createdAt: timestamp,
      customer: orderData.customer,
      items: orderItems,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingFee: cartShipping,
      total: cartTotal,
      couponCode: appliedCoupon?.code,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'paid',
      status: 'confirmed',
      trackingNumber: `AUR-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      statusHistory: [
        {
          status: 'pending',
          timestamp,
          note: 'Order submitted online',
        },
        {
          status: 'confirmed',
          timestamp: new Date(Date.now() + 1000).toISOString(),
          note: `Payment authorized via ${orderData.paymentMethod.toUpperCase()}`,
        },
      ],
    };

    // 4. Update state and save
    setProducts(updatedProducts);
    setOrders([newOrder, ...orders]);
    setLastCreatedOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);

    return { success: true, order: newOrder };
  };

  // Update order status (Admin operation)
  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    trackingNumber?: string
  ) => {
    const timestamp = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const defaultNotes: Record<OrderStatus, string> = {
            pending: 'Order pending review',
            confirmed: 'Order confirmed and authorized',
            processing: 'Crafting & luxury dust bag presentation underway in atelier',
            shipped: 'Handed to courier for insured white-glove dispatch',
            delivered: 'Package delivered to recipient',
            cancelled: 'Order cancelled by customer or atelier',
          };

          const statusHistory = [
            ...order.statusHistory,
            {
              status: newStatus,
              timestamp,
              note: note || defaultNotes[newStatus],
            },
          ];

          return {
            ...order,
            status: newStatus,
            trackingNumber: trackingNumber || order.trackingNumber,
            statusHistory,
          };
        }
        return order;
      })
    );
  };

  // Product CRUD
  const addProduct = (product: Product) => {
    setProducts([product, ...products]);
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Reviews
  const addReview = (newReviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };
    setReviews([newRev, ...reviews]);

    // Update product rating and reviewCount
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === newReviewData.productId) {
          const newCount = p.reviewCount + 1;
          const newRating = Number(((p.rating * p.reviewCount + newReviewData.rating) / newCount).toFixed(1));
          return {
            ...p,
            reviewCount: newCount,
            rating: newRating,
          };
        }
        return p;
      })
    );
  };

  // Auth
  const login = (email: string, role: 'admin' | 'customer' = 'customer', name?: string) => {
    const defaultName = role === 'admin' ? 'Atelier Director' : name || email.split('@')[0];
    const user: UserProfile = {
      uid: `usr-${Date.now()}`,
      email,
      name: defaultName,
      role,
      wishlist,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePage('home');
  };

  const quickSwitchRole = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      login('admin@aurelle.com', 'admin', 'Hélène de Valois (Admin)');
    } else {
      login('claire@example.com', 'customer', 'Claire Dupont');
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        orders,
        reviews,
        cart,
        wishlist,
        currentUser,
        activePage,
        selectedProductId,
        selectedCategory,
        searchQuery,
        appliedCoupon,
        lastCreatedOrder,
        setActivePage,
        setSearchQuery,
        setSelectedCategory,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        cartItemCount,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        login,
        logout,
        quickSwitchRole,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
