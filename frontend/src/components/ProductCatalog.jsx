import React, { useEffect, useState, useRef, useCallback } from 'react';
import { LayoutGrid, Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';
import api from '../store/api';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [lastCreatedAt, setLastCreatedAt] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000 });
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const observer = useRef();
  const loadingRef = useRef(false);
  const debounceRef = useRef(null);

  const fetchProducts = async (reset = false) => {
    if (loadingRef.current || (!hasMore && !reset)) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await api.get('/products', {
        params: {
          limit: 12,
          lastCreatedAt: reset ? undefined : lastCreatedAt,
          minPrice: priceFilter.min,
          maxPrice: priceFilter.max,
          search: search || undefined,
        },
      });

      let newProducts = res.data.products || [];

      // Deduplicate against already loaded products
      const existingIds = new Set(products.map(p => p._id));
      newProducts = newProducts.filter(p => !existingIds.has(p._id));

      setProducts(prev => reset ? newProducts : [...prev, ...newProducts]);
      setHasMore(res.data.hasMore);

      if (newProducts.length > 0) {
        setLastCreatedAt(newProducts[newProducts.length - 1].createdAt);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      setProducts([]);      // clear previous products
      setLastCreatedAt(null);
      setHasMore(true);
    }, 500);
  };

  useEffect(() => { fetchProducts(true); }, [search, priceFilter]);

  const lastProductRef = useCallback(node => {
    if (loadingRef.current) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) fetchProducts();
    }, { threshold: 0.1 });

    if (node) observer.current.observe(node);
  }, [hasMore, products]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-sm">
                  <LayoutGrid size={20} className="text-stone-900" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] leading-none mb-1">Inventory</p>
                  <h1 className="text-xl md:text-2xl font-black text-stone-900">Catalog</h1>
                </div>
              </div>
              
              {/* Mobile Filter Toggle */}
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden p-2 bg-stone-100 rounded-lg text-stone-600"
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>

            <div className="relative group mt-3 md:mt-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-yellow-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-stone-100 border-transparent border focus:bg-white focus:border-yellow-400 rounded-xl outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel onFilter={(f) => { setPriceFilter(f); setProducts([]); setLastCreatedAt(null); setHasMore(true); }} />
          </aside>

          {/* Mobile Sidebar Overlay */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
              <div className="fixed inset-y-0 left-0 w-72 bg-white p-6 shadow-xl animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button onClick={() => setIsFilterOpen(false)}><X size={24}/></button>
                </div>
                <FilterPanel onFilter={(f) => { setPriceFilter(f); setProducts([]); setLastCreatedAt(null); setHasMore(true); setIsFilterOpen(false); }} />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product, index) => {
                const key = `${product._id}-${index}`; // ensures unique key
                return (
                  <div key={key} ref={index === products.length - 1 ? lastProductRef : null}>
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </div>

            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!hasMore && !loading && (
              <p className="text-center py-12 text-stone-400 font-medium tracking-wide">
                 end of the collection
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}