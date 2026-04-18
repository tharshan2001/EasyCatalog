import React, { useEffect, useState, useRef, useCallback } from "react";
import { LayoutGrid, Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ProductCard from "./ProductCard";
import FilterPanel from "./FilterPanel";
import api from "../store/api";

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 100000 });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [scrolled, setScrolled] = useState(false);

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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data?.categories ?? []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

const fetchProducts = async (reset = false) => {
    try {
      if (loadingRef.current) return;
      if (!reset && !hasMore) return;
      
      loadingRef.current = true;
      
      const params = { limit: 12 };
      if (!reset && cursor) params.cursor = cursor;
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (priceFilter.min > 0) params.minPrice = priceFilter.min;
      if (priceFilter.max < 100000) params.maxPrice = priceFilter.max;
      
      const res = await api.get("/products", { params });
      const data = res.data;
      
      if (reset) {
        setProducts(data.products || []);
      } else {
        setProducts((prev) => [...prev, ...(data.products || [])]);
      }
      setHasMore(data.hasMore);
      if (data.hasMore && data.products?.length > 0) {
        setCursor(data.products[data.products.length - 1]._id);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    fetchProducts(true);
  }, [search, priceFilter, selectedCategory]);

  const lastProductRef = useCallback((node) => {
    if (!node || !hasMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          fetchProducts(false);
        }
      },
      { rootMargin: "200px" }
    );
    
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, cursor]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      setCursor(null);
      fetchProducts(true);
    }, 500);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCursor(null);
    fetchProducts(true);
  };

  return (
    <div className=" bg-stone-50">
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
                Ebee.lk
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
          <aside className="hidden lg:block w-64 lg:sticky lg:top-20 lg:self-start">
            <div className="space-y-6">
                {/* Category Filter */}
              {categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
                    Categories
                  </h3>
                  <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200/50 space-y-2">
                    <button
                      onClick={() => handleCategoryChange("")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === ""
                          ? "bg-yellow-400 text-white font-medium"
                          : "text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => handleCategoryChange(cat._id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat._id
                            ? "bg-yellow-400 text-white font-medium"
                            : "text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
<FilterPanel
                  onFilter={(f) => {
                    setPriceFilter(f);
                    setCursor(null);
                    fetchProducts(true);
                  }}
                />
            </div>
          </aside>

          {/* Mobile Filters */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-black/20"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="fixed left-0 top-0 w-72 bg-white p-8 shadow-xl">
                <div className="flex justify-between mb-6">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <button onClick={() => setIsFilterOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
                <FilterPanel
                  onFilter={(f) => {
                    setPriceFilter(f);
                    setCursor(null);
                    fetchProducts(true);
                    setIsFilterOpen(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1">
            {/* <div className="text-xs text-gray-500 mb-2">Showing {products.length} products (page {page})</div> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  ref={index === products.length - 1 ? lastProductRef : null}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {loadingRef.current && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!hasMore && products.length > 0 && (
              <p className="text-center py-12 text-stone-400">
                end of the collection
              </p>
            )}

            {!loadingRef.current && products.length === 0 && (
              <p className="text-center py-12 text-stone-400">
                No products found
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}