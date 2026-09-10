export type BagCategory =
  | 'handbags'
  | 'totes'
  | 'shoulder-bags'
  | 'crossbody'
  | 'mini-bags'
  | 'wallets';

export interface ProductVariant {
  variantId: string;
  colorName: string;
  colorCode: string; // Hex color code for swatch representation
  images: string[]; // Array of image URLs specific to this color variation
  priceOverride?: number;
  stock: number;
  sku: string;
  isAvailable?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  tagline?: string;
  description: string;
  category: BagCategory;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  defaultVariantId: string;
  materials: string[];
  dimensions: string;
  weight: string;
  care: string;
  features: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isActive?: boolean;
  createdAt: string;
  collection?: string; // 'Modern Classic' | 'Atelier Heritage' | 'Minimalist Edit'
}

export interface CartItem {
  id: string; // `${productId}_${variantId}`
  productId: string;
  productName: string;
  variantId: string;
  colorName: string;
  colorCode: string;
  image: string;
  price: number;
  salePrice?: number;
  quantity: number;
  maxStock: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantId: string;
  colorName: string;
  colorCode: string;
  image: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
  paymentMethod: 'card' | 'razorpay' | 'stripe' | 'apple_pay' | 'test_mode';
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  trackingNumber?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  phone?: string;
  defaultAddress?: ShippingAddress;
  wishlist: string[]; // array of product IDs
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  colorPurchased?: string;
  verifiedPurchase: boolean;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend?: number;
  description: string;
}

export interface CategoryInfo {
  id: BagCategory;
  name: string;
  description: string;
  image: string;
  itemCount?: number;
}

export type ActivePage =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'account'
  | 'admin'
  | 'wishlist'
  | 'lookbook';
