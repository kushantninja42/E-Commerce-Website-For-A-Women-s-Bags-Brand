import { Product, Order, ProductReview, UserProfile, CartItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/initialProducts';
import { INITIAL_ORDERS } from '../data/initialOrders';
import { isFirebaseConfigured, db } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  PRODUCTS: 'aurelle_products_v2',
  ORDERS: 'aurelle_orders_v2',
  REVIEWS: 'aurelle_reviews_v2',
  CART: 'aurelle_cart_v2',
  WISHLIST: 'aurelle_wishlist_v2',
  USER: 'aurelle_user_v2',
};

export const StoreService = {
  getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read products from localStorage', e);
    }
    // Set initial
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      if (isFirebaseConfigured && db) {
        // Asynchronously persist to firestore in the background
        products.forEach(async (p) => {
          try {
            await setDoc(doc(db!, 'products', p.id), p);
          } catch (err) {
            console.error('Firestore saveProduct error:', err);
          }
        });
      }
    } catch (e) {
      console.warn('Failed to save products', e);
    }
  },

  getOrders(): Order[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read orders from localStorage', e);
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      if (isFirebaseConfigured && db) {
        orders.forEach(async (o) => {
          try {
            await setDoc(doc(db!, 'orders', o.id), o);
          } catch (err) {
            console.error('Firestore saveOrder error:', err);
          }
        });
      }
    } catch (e) {
      console.warn('Failed to save orders', e);
    }
  },

  getReviews(): ProductReview[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read reviews', e);
    }
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    return INITIAL_REVIEWS;
  },

  saveReviews(reviews: ProductReview[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save reviews', e);
    }
  },

  getCart(): CartItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read cart', e);
    }
    return [];
  },

  saveCart(cart: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart', e);
    }
  },

  getWishlist(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read wishlist', e);
    }
    return ['aur-luna-structured-bag', 'aur-vivienne-curved-shoulder'];
  },

  saveWishlist(wishlist: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist', e);
    }
  },

  getUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read user profile', e);
    }
    // Default demo user: Customer
    const demoCustomer: UserProfile = {
      uid: 'user-demo-claire',
      email: 'claire@example.com',
      name: 'Claire Dupont',
      role: 'customer',
      phone: '+1 (555) 782-3344',
      defaultAddress: {
        fullName: 'Claire Dupont',
        email: 'claire@example.com',
        phone: '+1 (555) 782-3344',
        addressLine1: '320 Park Avenue',
        city: 'New York',
        state: 'NY',
        postalCode: '10022',
        country: 'United States',
      },
      wishlist: ['aur-luna-structured-bag', 'aur-vivienne-curved-shoulder'],
      createdAt: '2026-01-01T00:00:00Z',
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoCustomer));
    return demoCustomer;
  },

  saveUser(user: UserProfile | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.warn('Failed to save user', e);
    }
  },
};
