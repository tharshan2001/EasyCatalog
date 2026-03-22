import React, { useEffect, useState, useRef, useCallback } from "react";
import { LayoutGrid, Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "./ProductCard";
import FilterPanel from "./FilterPanel";
import api from "../store/api";

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [lastCreatedAt, setLastCreatedAt] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000 });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [scrolled, setScrolled] = useState(false);

  const observer = useRef();
  const loadingRef = useRef(false);
  const debounceRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchProducts = async (reset = false) => {
    if (loadingRef.current || (!hasMore && !reset)) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await api.get("/products", {
        params: {
          limit: 12,
          lastCreatedAt: reset ? undefined : lastCreatedAt,
          minPrice: priceFilter.min,
          maxPrice: priceFilter.max,
          search: search || undefined,
        },
      });

      let newProducts = res.data.products || [];

      const existingIds = new Set(products.map((p) => p._id));
      newProducts = newProducts.filter((p) => !existingIds.has(p._id));

      setProducts((prev) => (reset ? newProducts : [...prev, ...newProducts]));
      setHasMore(res.data.hasMore);

      if (newProducts.length > 0) {
        setLastCreatedAt(newProducts[newProducts.length - 1].createdAt);
      }
    } catch (err) {
      console.error("Fetch error:", err);
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
      setProducts([]);
      setLastCreatedAt(null);
      setHasMore(true);
    }, 500);
  };

  useEffect(() => {
    fetchProducts(true);
  }, [search, priceFilter]);

  const lastProductRef = useCallback(
    (node) => {
      if (loadingRef.current) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) fetchProducts();
        },
        { threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [hasMore, products]
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* HEADER */}
      <header
        className={`sticky top-0 z-30 w-full backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md border-b border-stone-200"
            : "bg-white/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">

          {/* MOBILE HEADER */}
          <div className="flex items-center gap-2 md:hidden">
            
            {/* Logo LEFT */}
            <div
              className={`bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
                scrolled ? "w-10 h-10" : "w-12 h-12"
              }`}
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="object-contain w-full h-full"
              />
            </div>

            {/* Search CENTER */}
            <div className="relative group flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-yellow-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border-transparent border focus:bg-white focus:border-yellow-400 rounded-xl outline-none transition-all text-sm focus:shadow-sm"
              />
            </div>

            {/* Filter RIGHT */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="p-2 bg-stone-100 rounded-lg text-stone-600 active:scale-95 transition"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>

          {/* DESKTOP HEADER */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <h1 className="text-2xl font-black text-stone-900">
                Catalog
              </h1>
            </div>

            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-yellow-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-80 pl-10 pr-4 py-2.5 bg-stone-100 border-transparent border focus:bg-white focus:border-yellow-400 rounded-xl outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* Sidebar */}
          <aside className="hidden lg:block w-64">
            <FilterPanel
              onFilter={(f) => {
                setPriceFilter(f);
                setProducts([]);
                setLastCreatedAt(null);
                setHasMore(true);
              }}
            />
          </aside>

          {/* Mobile Filters */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-black/20"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="fixed left-0 top-0 h-full w-72 bg-white p-6 shadow-xl">
                <div className="flex justify-between mb-6">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <button onClick={() => setIsFilterOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
                <FilterPanel
                  onFilter={(f) => {
                    setPriceFilter(f);
                    setProducts([]);
                    setLastCreatedAt(null);
                    setHasMore(true);
                    setIsFilterOpen(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div
                  key={`${product._id}-${index}`}
                  ref={
                    index === products.length - 1
                      ? lastProductRef
                      : null
                  }
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!hasMore && !loading && (
              <p className="text-center py-12 text-stone-400">
                end of the collection
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}