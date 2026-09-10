import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, ProductVariant, Order, BagCategory } from '../types';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Truck,
  DollarSign,
  Tag,
  Eye,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Save,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    products,
    orders,
    coupons,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateOrderTracking,
    addCoupon,
    currentUser,
    quickSwitchRole,
    setActivePage,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons'>('overview');

  // Product Editing / Creation Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState<boolean>(false);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');

  // New Coupon State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(15);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;

  // Inventory analysis
  const lowStockThreshold = 5;
  const lowStockItems: {
    product: Product;
    variant: ProductVariant;
  }[] = [];

  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stock <= lowStockThreshold) {
        lowStockItems.push({ product: p, variant: v });
      }
    });
  });

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilterStatus === 'all') return true;
    return o.orderStatus === orderFilterStatus;
  });

  // Handler to open create product form
  const handleOpenCreateProduct = () => {
    const newEmptyProduct: Product = {
      id: '',
      name: '',
      description: '',
      price: 350,
      category: 'handbags',
      collection: 'Modern Classic',
      materials: ['Full-grain European calfskin', 'Brushed 24k gold-finish fittings'],
      dimensions: '25 cm × 18 cm × 10 cm',
      weight: '620 g',
      features: ['Magnetic flap clasp', 'Detachable shoulder strap'],
      care: 'Condition biannually with organic beeswax cream.',
      defaultVariantId: 'var-1',
      variants: [
        {
          variantId: 'var-1',
          colorName: 'Noir Black',
          colorCode: '#1A1A1A',
          sku: 'AUR-NEW-01',
          stock: 12,
          images: [
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
            'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800',
          ],
        },
        {
          variantId: 'var-2',
          colorName: 'Crème Ivory',
          colorCode: '#F4EFE6',
          sku: 'AUR-NEW-02',
          stock: 8,
          images: [
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
          ],
        },
      ],
      rating: 5.0,
      reviewCount: 0,
      isFeatured: true,
      isNewArrival: true,
      createdAt: new Date().toISOString(),
    };
    setEditingProduct(newEmptyProduct);
    setIsCreatingProduct(true);
  };

  // Handler to save product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    if (isCreatingProduct) {
      const generatedId = editingProduct.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      addProduct({ ...editingProduct, id: generatedId });
    } else {
      updateProduct(editingProduct);
    }

    setEditingProduct(null);
    setIsCreatingProduct(false);
  };

  // Handler to add a color variation to editing product
  const handleAddVariantToEditingProduct = () => {
    if (!editingProduct) return;
    const newVarId = 'var-' + Date.now();
    const newVariant: ProductVariant = {
      variantId: newVarId,
      colorName: 'New Colorway',
      colorCode: '#8B4513',
      sku: 'SKU-' + Date.now().toString().slice(-4),
      stock: 10,
      images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'],
    };

    setEditingProduct({
      ...editingProduct,
      variants: [...editingProduct.variants, newVariant],
    });
  };

  // Handler to remove a variant
  const handleRemoveVariant = (variantId: string) => {
    if (!editingProduct || editingProduct.variants.length <= 1) {
      alert('A product must maintain at least one color variation.');
      return;
    }
    const updated = editingProduct.variants.filter((v) => v.variantId !== variantId);
    setEditingProduct({
      ...editingProduct,
      variants: updated,
      defaultVariantId:
        editingProduct.defaultVariantId === variantId
          ? updated[0].variantId
          : editingProduct.defaultVariantId,
    });
  };

  // Handler for adding coupon
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: newCouponType === 'percentage' ? newCouponDiscount : undefined,
      discountAmount: newCouponType === 'fixed' ? newCouponDiscount : undefined,
      description: newCouponDesc || `${newCouponDiscount}% VIP Courtesy Voucher`,
      isActive: true,
      minPurchase: 100,
    });
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  // Non-admin warning and fast access toggle
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Bar Notification if not in admin role */}
        {!isAdmin && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-amber-700 shrink-0" />
              <span>
                You are currently viewing in <strong>Customer Mode</strong>. As requested, you can switch to the <strong>Atelier Director (Admin)</strong> view with 1 click:
              </span>
            </div>
            <button
              onClick={() => quickSwitchRole('admin')}
              className="px-4 py-1.5 bg-[#1E3329] text-white rounded-lg text-xs font-semibold whitespace-nowrap"
            >
              Switch to Director Admin Mode
            </button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E3DC] mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C2A277] font-semibold">
              Atelier Backstage
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1E3329] mt-1">
              Director Executive Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateProduct}
              className="px-5 py-2.5 bg-[#1E3329] hover:bg-[#15241D] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded-xl transition shadow-sm flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Create Product</span>
            </button>

            <button
              onClick={() => setActivePage('shop')}
              className="px-4 py-2.5 border border-[#E8E3DC] text-[#1E3329] hover:bg-white text-xs uppercase tracking-wider font-medium rounded-xl transition"
            >
              Customer View
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8E3DC] mb-8 text-xs uppercase tracking-wider font-semibold gap-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-[#1E3329] border-b-2 border-[#1E3329]'
                : 'text-[#8C8275] hover:text-[#1E3329]'
            }`}
          >
            <TrendingUp size={16} />
            <span>Overview & Health</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'text-[#1E3329] border-b-2 border-[#1E3329]'
                : 'text-[#8C8275] hover:text-[#1E3329]'
            }`}
          >
            <Layers size={16} />
            <span>Products & Color Variations ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'text-[#1E3329] border-b-2 border-[#1E3329]'
                : 'text-[#8C8275] hover:text-[#1E3329]'
            }`}
          >
            <ShoppingBag size={16} />
            <span>Orders & Dispatches ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`pb-3 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'text-[#1E3329] border-b-2 border-[#1E3329]'
                : 'text-[#8C8275] hover:text-[#1E3329]'
            }`}
          >
            <Tag size={16} />
            <span>VIP Vouchers ({coupons.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#8C8275] font-semibold">
                  Gross Revenue
                </span>
                <p className="font-serif-luxury text-3xl text-[#1E3329] mt-2">
                  ${totalRevenue.toLocaleString()}
                </p>
                <span className="text-[11px] text-emerald-800 font-medium mt-1 inline-block">
                  ↑ Across {totalOrdersCount} settled commissions
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#8C8275] font-semibold">
                  Active Creations
                </span>
                <p className="font-serif-luxury text-3xl text-[#1E3329] mt-2">{products.length}</p>
                <span className="text-[11px] text-[#6B726D] mt-1 inline-block">
                  {products.reduce((acc, p) => acc + p.variants.length, 0)} colorway editions
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#8C8275] font-semibold">
                  Pending Atelier Orders
                </span>
                <p className="font-serif-luxury text-3xl text-[#1E3329] mt-2">
                  {orders.filter((o) => o.orderStatus === 'processing' || o.orderStatus === 'pending').length}
                </p>
                <span className="text-[11px] text-amber-700 mt-1 inline-block">
                  Requires fulfillment or dispatch
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#8C8275] font-semibold">
                  Low Stock Variations
                </span>
                <p className="font-serif-luxury text-3xl text-[#9C4331] mt-2">
                  {lowStockItems.length}
                </p>
                <span className="text-[11px] text-[#9C4331] mt-1 inline-block">
                  {lowStockItems.length > 0 ? 'Restock recommended' : 'Atelier fully stocked'}
                </span>
              </div>
            </div>

            {/* Low-Stock Variations Warning Box */}
            {lowStockItems.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-xs">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9C4331] flex items-center gap-2 mb-4">
                  <AlertTriangle size={16} />
                  <span>Colorway Inventory Alerts (≤ {lowStockThreshold} Units)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {lowStockItems.map(({ product, variant }, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={variant.images[0] || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200'}
                          alt={variant.colorName}
                          className="w-10 h-12 object-cover rounded-md bg-white border border-[#E8E3DC]"
                        />
                        <div>
                          <p className="font-medium text-[#1E3329]">{product.name}</p>
                          <p className="text-[11px] text-[#6B726D]">Color: {variant.colorName}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-rose-700 bg-white px-2 py-1 rounded border border-rose-200">
                        {variant.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders List in Overview */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DC]">
                <h3 className="font-serif-luxury text-xl text-[#1E3329]">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs uppercase tracking-wider font-semibold text-[#1E3329] hover:text-[#C2A277] flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="divide-y divide-[#E8E3DC] text-xs">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#1E3329]">
                        {order.orderNumber} • {order.customer.fullName}
                      </p>
                      <p className="text-[11px] text-[#8C8275]">
                        {order.createdAt} • {order.items.length} items ({order.items.map((i) => i.colorName).join(', ')})
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-serif-luxury text-sm font-semibold text-[#1E3329]">
                        ${order.total}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS (CRUD with Color Variations Manager) */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-[#6B726D]">
                Manage product details, pricing, stock and color-specific photographic galleries.
              </p>
              <button
                onClick={handleOpenCreateProduct}
                className="px-5 py-2.5 bg-[#1E3329] hover:bg-[#15241D] text-white rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-[#E8E3DC] shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E3DC] text-[#8C8275] uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Creation</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Color Variations</th>
                    <th className="py-3.5 px-4">Total Stock</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3DC]">
                  {products.map((product) => {
                    const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
                    const defaultVar =
                      product.variants.find((v) => v.variantId === product.defaultVariantId) ||
                      product.variants[0];

                    return (
                      <tr key={product.id} className="hover:bg-[#FAF8F5]/50 transition">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={defaultVar?.images[0] || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200'}
                            alt={product.name}
                            className="w-12 h-14 object-cover rounded-lg bg-[#F2EDE4] border border-[#E8E3DC]"
                          />
                          <div>
                            <p className="font-serif-luxury text-sm text-[#1E3329] font-medium">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-[#8C8275]">{product.collection}</p>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 capitalize text-[#555C57]">
                          {product.category.replace('-', ' ')}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-serif-luxury text-sm font-semibold text-[#1E3329]">
                            ${product.salePrice || product.price}
                          </span>
                          {product.salePrice && (
                            <span className="text-[11px] text-[#8C8275] line-through ml-1.5">
                              ${product.price}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            {product.variants.map((v) => (
                              <span
                                key={v.variantId}
                                title={`${v.colorName} (${v.stock} in stock)`}
                                className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-inner"
                                style={{ backgroundColor: v.colorCode }}
                              ></span>
                            ))}
                            <span className="text-[11px] text-[#8C8275] ml-1">
                              ({product.variants.length} colors)
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`font-semibold ${
                              totalStock <= 5 ? 'text-rose-700' : 'text-[#1E3329]'
                            }`}
                          >
                            {totalStock} units
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setIsCreatingProduct(false);
                              }}
                              className="p-1.5 text-[#555C57] hover:text-[#1E3329] hover:bg-[#FAF8F5] rounded-lg transition"
                              title="Edit product and colorways"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${product.name}?`)) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="p-1.5 text-[#8C8275] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-full capitalize font-medium transition ${
                    orderFilterStatus === st
                      ? 'bg-[#1E3329] text-white shadow-xs'
                      : 'bg-white text-[#555C57] border border-[#E8E3DC] hover:border-[#1E3329]'
                  }`}
                >
                  {st} ({st === 'all' ? orders.length : orders.filter((o) => o.orderStatus === st).length})
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-[#E8E3DC] shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E3DC] text-[#8C8275] uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Order Ref</th>
                    <th className="py-3.5 px-4">Patron & Destination</th>
                    <th className="py-3.5 px-4">Commissioned Items (Selected Colors)</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Status & Dispatch</th>
                    <th className="py-3.5 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3DC]">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAF8F5]/40 transition">
                      <td className="py-4 px-4 font-mono font-semibold text-[#1E3329]">
                        {order.orderNumber}
                        <span className="block font-sans-luxury text-[11px] text-[#8C8275] font-normal">
                          {order.createdAt}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-semibold text-[#1E3329]">{order.customer.fullName}</p>
                        <p className="text-[11px] text-[#8C8275] truncate max-w-xs">
                          {order.customer.city}, {order.customer.country}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px]">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                                style={{ backgroundColor: item.colorCode }}
                              ></span>
                              <span className="font-medium text-[#1E3329]">{item.productName}</span>
                              <span className="text-[#8C8275]">({item.colorName} × {item.quantity})</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4 font-serif-luxury text-sm font-semibold text-[#1E3329]">
                        ${order.total}
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg px-2.5 py-1 text-xs font-medium text-[#1E3329] focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {order.trackingNumber && (
                          <span className="block text-[10px] text-[#8C8275] mt-1 font-mono truncate max-w-[140px]">
                            Track: {order.trackingNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-[#555C57] hover:text-[#1E3329] hover:bg-[#FAF8F5] rounded-lg transition inline-flex items-center gap-1"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS & PROMOTIONAL CODES */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-xs space-y-4">
              <h3 className="font-serif-luxury text-xl text-[#1E3329]">Create Promotional Voucher</h3>

              <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-[#1E3329] mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMER25"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl font-mono uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-[#1E3329] mb-1">Discount Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as any)}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-[#1E3329] mb-1">Value</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={1000}
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#1E3329] mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. 25% Off Summer Solstice Privilege"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1E3329] text-white text-xs uppercase tracking-wider font-semibold rounded-xl hover:bg-[#15241D] transition"
                >
                  Activate Voucher
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-xs space-y-4">
              <h3 className="font-serif-luxury text-xl text-[#1E3329]">Active Privilege Vouchers</h3>

              <div className="divide-y divide-[#E8E3DC] text-xs">
                {coupons.map((c) => (
                  <div key={c.code} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#1E3329] bg-[#FAF8F5] px-2.5 py-0.5 rounded border border-[#E8E3DC]">
                          {c.code}
                        </span>
                        <span className="text-emerald-800 font-semibold">
                          {c.discountPercent ? `${c.discountPercent}% Off` : `$${c.discountAmount} Off`}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8C8275] mt-1">{c.description}</p>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PRODUCT EDIT / CREATE MODAL WITH COLOR VARIATION MANAGEMENT   */}
        {/* ============================================================== */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#E8E3DC] shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E3DC]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C2A277] font-semibold">
                    {isCreatingProduct ? 'Atelier New Edition' : 'Catalog Modification'}
                  </span>
                  <h2 className="font-serif-luxury text-2xl text-[#1E3329]">
                    {isCreatingProduct ? 'Create New Luxury Handbag' : `Edit: ${editingProduct.name}`}
                  </h2>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1 text-[#8C8275] hover:text-[#1E3329]"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
                {/* General Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#1E3329] mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#1E3329] mb-1">Category *</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value as BagCategory,
                        })
                      }
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl"
                    >
                      <option value="handbags">Handbags</option>
                      <option value="totes">Tote Bags</option>
                      <option value="shoulder-bags">Shoulder Bags</option>
                      <option value="crossbody">Crossbody Bags</option>
                      <option value="mini-bags">Mini Bags</option>
                      <option value="wallets">Wallets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-[#1E3329] mb-1">Regular Price ($) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#1E3329] mb-1">Sale Price ($) (optional)</label>
                    <input
                      type="number"
                      min={1}
                      value={editingProduct.salePrice || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          salePrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="Leave blank for regular price"
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#1E3329] mb-1">Narrative Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl"
                  ></textarea>
                </div>

                {/* CRITICAL COLOR VARIATIONS MANAGEMENT SECTION */}
                <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E8E3DC] space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8E3DC]">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1E3329]">
                        Color Variations & Color-Specific Galleries
                      </h3>
                      <p className="text-[11px] text-[#6B726D]">
                        Each colorway stores its own stock, color swatch code, and dedicated photographic image set.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddVariantToEditingProduct}
                      className="px-3 py-1.5 bg-[#1E3329] text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
                    >
                      <Plus size={13} />
                      <span>Add Colorway</span>
                    </button>
                  </div>

                  {/* Variation Rows */}
                  <div className="space-y-4">
                    {editingProduct.variants.map((variant, vIdx) => (
                      <div
                        key={variant.variantId}
                        className="p-4 bg-white rounded-xl border border-[#E8E3DC] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full border border-black/15 shadow-inner"
                              style={{ backgroundColor: variant.colorCode }}
                            ></span>
                            <span className="font-semibold text-xs text-[#1E3329]">
                              Variation #{vIdx + 1}: {variant.colorName}
                            </span>
                            {variant.variantId === editingProduct.defaultVariantId && (
                              <span className="text-[10px] bg-[#E8DAC6] text-[#1E3329] px-2 py-0.5 rounded-full font-medium">
                                Default Active
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-[11px] text-[#8C8275] flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="defaultVariant"
                                checked={editingProduct.defaultVariantId === variant.variantId}
                                onChange={() =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    defaultVariantId: variant.variantId,
                                  })
                                }
                              />
                              <span>Set Default</span>
                            </label>

                            {editingProduct.variants.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveVariant(variant.variantId)}
                                className="text-rose-600 hover:text-rose-800 p-1"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Variant input fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-medium text-[#1E3329] mb-1">Color Name</label>
                            <input
                              type="text"
                              required
                              value={variant.colorName}
                              onChange={(e) => {
                                const newVars = [...editingProduct.variants];
                                newVars[vIdx].colorName = e.target.value;
                                setEditingProduct({ ...editingProduct, variants: newVars });
                              }}
                              className="w-full p-2 bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block font-medium text-[#1E3329] mb-1">Color Hex Code</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={variant.colorCode}
                                onChange={(e) => {
                                  const newVars = [...editingProduct.variants];
                                  newVars[vIdx].colorCode = e.target.value;
                                  setEditingProduct({ ...editingProduct, variants: newVars });
                                }}
                                className="w-8 h-8 rounded border border-[#E8E3DC] p-0 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={variant.colorCode}
                                onChange={(e) => {
                                  const newVars = [...editingProduct.variants];
                                  newVars[vIdx].colorCode = e.target.value;
                                  setEditingProduct({ ...editingProduct, variants: newVars });
                                }}
                                className="w-full p-2 bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-medium text-[#1E3329] mb-1">Stock Quantity</label>
                            <input
                              type="number"
                              min={0}
                              value={variant.stock}
                              onChange={(e) => {
                                const newVars = [...editingProduct.variants];
                                newVars[vIdx].stock = Number(e.target.value);
                                setEditingProduct({ ...editingProduct, variants: newVars });
                              }}
                              className="w-full p-2 bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg font-mono"
                            />
                          </div>
                        </div>

                        {/* Image URLs for THIS specific colorway */}
                        <div>
                          <label className="block font-medium text-[#1E3329] mb-1">
                            Assigned Image URLs for {variant.colorName} (comma separated)
                          </label>
                          <textarea
                            rows={2}
                            value={variant.images.join(', ')}
                            onChange={(e) => {
                              const urls = e.target.value
                                .split(',')
                                .map((u) => u.trim())
                                .filter(Boolean);
                              const newVars = [...editingProduct.variants];
                              newVars[vIdx].images = urls;
                              setEditingProduct({ ...editingProduct, variants: newVars });
                            }}
                            placeholder="https://images.unsplash.com/..., https://..."
                            className="w-full p-2 bg-[#FAF8F5] border border-[#E8E3DC] rounded-lg font-mono text-[11px]"
                          ></textarea>

                          {/* Image Thumbnails preview */}
                          <div className="flex gap-2 mt-2">
                            {variant.images.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt={`Preview ${i}`}
                                className="w-10 h-12 object-cover rounded border border-[#E8E3DC]"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E3DC]">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-5 py-2.5 border border-[#E8E3DC] rounded-xl text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1E3329] text-white rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#15241D] flex items-center gap-2"
                  >
                    <Save size={14} />
                    <span>Save Product & Variations</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ORDER DETAILS INSPECT MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#E8E3DC] shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E3DC]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C2A277] font-semibold">
                    Order Inspection
                  </span>
                  <h2 className="font-serif-luxury text-2xl text-[#1E3329]">
                    {selectedOrder.orderNumber}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-[#8C8275] hover:text-[#1E3329]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Update Strip */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3DC] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <label className="block text-[#8C8275] mb-1 font-medium">Order Status</label>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => {
                      updateOrderStatus(selectedOrder.id, e.target.value as any);
                      setSelectedOrder({
                        ...selectedOrder,
                        orderStatus: e.target.value as any,
                      });
                    }}
                    className="p-2 bg-white border border-[#E8E3DC] rounded-lg font-semibold"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8C8275] mb-1 font-medium">Tracking Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={selectedOrder.trackingNumber || ''}
                      placeholder="e.g. DHL-998234-FR"
                      onBlur={(e) => {
                        updateOrderTracking(selectedOrder.id, e.target.value, 'DHL Express');
                      }}
                      className="p-2 bg-white border border-[#E8E3DC] rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1E3329] mb-3">
                  Purchased Items & Selected Colorways
                </h4>
                <div className="divide-y divide-[#E8E3DC] border-y border-[#E8E3DC]">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-12 h-14 object-cover rounded-lg bg-[#F2EDE4] border border-[#E8E3DC]"
                        />
                        <div>
                          <p className="font-semibold text-[#1E3329]">{item.productName}</p>
                          <p className="text-[11px] text-[#6B726D]">
                            Color: {item.colorName} • Qty: {item.quantity}
                          </p>
                          <p className="text-[10px] font-mono text-[#8C8275]">SKU: {item.sku}</p>
                        </div>
                      </div>

                      <span className="font-serif-luxury text-sm text-[#1E3329]">
                        ${(item.salePrice || item.price) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="text-xs space-y-1 text-[#555C57] pt-2">
                <h4 className="font-semibold text-[#1E3329] uppercase tracking-wider text-[11px]">
                  Shipping Destination
                </h4>
                <p className="font-medium text-[#1E3329]">{selectedOrder.customer.fullName}</p>
                <p>{selectedOrder.customer.addressLine1}</p>
                {selectedOrder.customer.addressLine2 && <p>{selectedOrder.customer.addressLine2}</p>}
                <p>
                  {selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.postalCode}
                </p>
                <p>{selectedOrder.customer.country}</p>
                <p className="text-[#8C8275]">{selectedOrder.customer.email} • {selectedOrder.customer.phone}</p>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E8E3DC]">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 bg-[#1E3329] text-white rounded-xl text-xs uppercase tracking-wider font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
