import React, { useEffect, useState, useRef, useCallback } from 'react';
import { LayoutGrid, Search, Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import api from '../store/api';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [lastCreatedAt, setLastCreatedAt] = useState(null); // cursor for infinite scroll
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef();
  const loadingRef = useRef(false); // prevent multiple triggers

  // Fetch products from API
  const fetchProducts = async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await api.get('/products', {
        params: {
          limit: 10,
          lastCreatedAt: lastCreatedAt || undefined
        }
      });

      const newProducts = res.data.products || [];

      // Deduplicate
      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const filtered = newProducts.filter(p => !existingIds.has(p._id));
        return [...prev, ...filtered];
      });

      if (newProducts.length > 0) {
        setLastCreatedAt(newProducts[newProducts.length - 1].createdAt);
      }

      setHasMore(res.data.hasMore);

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // IntersectionObserver for last product
  const lastProductRef = useCallback(node => {
    if (loadingRef.current) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        fetchProducts();
      }
    }, { threshold: 0.1 });

    if (node) observer.current.observe(node);
  }, [hasMore]);

  return (
    <div className="min-h-screen bg-stone-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <LayoutGrid size={18} className="text-stone-900" />
              </div>
              <span className="font-bold text-stone-400 uppercase tracking-widest text-xs">Inventory</span>
            </div>
            <h1 className="text-4xl font-black text-stone-900">Product Catalog</h1>
          </div>

          {/* Search */}
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition-all w-64 text-sm"
              />
            </div>
            <button className="p-2.5 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
              <Filter size={20} className="text-stone-600" />
            </button>
          </div>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => {
            if (index === products.length - 1) {
              return (
                <div ref={lastProductRef} key={product._id}>
                  <ProductCard product={product} />
                </div>
              );
            }
            return <ProductCard key={product._id} product={product} />;
          })}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-6 text-stone-500">
            Loading more products...
          </div>
        )}

        {/* End Message */}
        {!hasMore && (
          <div className="text-center py-6 text-stone-400">
            No more products
          </div>
        )}

      </div>
    </div>
  );
}