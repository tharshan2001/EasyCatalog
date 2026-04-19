import { useState, useEffect, useCallback } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { useFilter } from '../context/FilterContext';

export default function Filter() {
  const {
    search,
    category,
    priceRange,
    sortBy,
    SORT_OPTIONS,
    categories,
    setSearch,
    setCategory,
    setPriceRange,
    setSort,
    resetFilters,
  } = useFilter();

  const [localSearch, setLocalSearch] = useState(search);
  const [priceOpen, setPriceOpen] = useState(false);
  const [localPriceMin, setLocalPriceMin] = useState(priceRange?.min ?? 0);
  const [localPriceMax, setLocalPriceMax] = useState(priceRange?.max ?? 0);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(localSearch), 500);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const activeCount = [search, category, priceRange?.min > 0 || priceRange?.max > 0].filter(Boolean).length;

  const handlePriceApply = useCallback(() => {
    setPriceRange({ min: localPriceMin, max: localPriceMax });
    setPriceOpen(false);
  }, [localPriceMin, localPriceMax, setPriceRange]);

const handleClear = useCallback(() => {
    setLocalSearch('');
    setLocalPriceMin(0);
    setLocalPriceMax(0);
    setCategory('');
    setSort('_id');
    setPriceRange({ min: null, max: null });
    resetFilters();
  }, [setCategory, setSort, resetFilters, setPriceRange]);

  const priceLabel = (!priceRange?.min || priceRange.min === 0) && (!priceRange?.max || priceRange.max === 0)
    ? 'Price' 
    : `LKR ${(priceRange?.min || 0).toLocaleString()} - ${(priceRange?.max || 0).toLocaleString()}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        {localSearch && (
          <button onClick={() => setLocalSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 py-2 text-sm bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      <div className="relative">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-stone-200 rounded-md hover:bg-stone-50"
        >
          {priceLabel}
          {(priceRange?.min > 0 || priceRange?.max > 0) ? (
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
          ) : null}
          <ChevronDown className="w-3 h-3 text-stone-400" />
        </button>
        
        {priceOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-stone-200 p-3 z-50 min-w-[220px]">
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                placeholder="Min"
                value={localPriceMin}
                onChange={(e) => setLocalPriceMin(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="number"
                placeholder="Max"
                value={localPriceMax}
                onChange={(e) => setLocalPriceMax(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button
              onClick={handlePriceApply}
              className="w-full px-3 py-1.5 text-sm bg-yellow-400 text-stone-900 font-medium rounded-md hover:bg-yellow-500"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <select
        value={sortBy}
        onChange={(e) => setSort(e.target.value)}
        className="px-3 py-2 text-sm bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={`${opt.id}-${opt.sortOrder}`} value={opt.id}>{opt.label}</option>
        ))}
      </select>

      {activeCount > 0 && (
        <button
          onClick={handleClear}
          className="px-3 py-2 text-sm text-yellow-600 font-medium hover:text-yellow-700"
        >
          Clear ({activeCount})
        </button>
      )}
    </div>
  );
}