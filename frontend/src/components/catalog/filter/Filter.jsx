import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Range, getTrackBackground } from 'react-range';
import { useFilter } from '../context/FilterContext';

const MIN_PRICE = 0;
const MAX_PRICE = 100000;

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
  const [localPrice, setLocalPrice] = useState([
    priceRange?.min ?? MIN_PRICE,
    priceRange?.max ?? MAX_PRICE
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(localSearch), 500);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  useEffect(() => {
    setLocalPrice([
      priceRange?.min ?? MIN_PRICE,
      priceRange?.max ?? MAX_PRICE
    ]);
  }, [priceRange]);

  const handlePriceChange = useCallback((values) => {
    setLocalPrice(values);
    setPriceRange({ min: values[0], max: values[1] });
  }, [setPriceRange]);

  const handleClear = useCallback(() => {
    setLocalSearch('');
    setLocalPrice([MIN_PRICE, MAX_PRICE]);
    setCategory('');
    setSort('_id');
    setPriceRange({ min: null, max: null });
    resetFilters();
  }, [setCategory, setSort, resetFilters, setPriceRange]);

  const activeCount = [search, category, (priceRange?.min ?? MIN_PRICE) > MIN_PRICE || (priceRange?.max ?? MAX_PRICE) < MAX_PRICE].filter(Boolean).length;

  const priceLabel = (priceRange?.min ?? MIN_PRICE) === MIN_PRICE && (priceRange?.max ?? MAX_PRICE) === MAX_PRICE
    ? 'Price' 
    : `LKR ${(priceRange?.min ?? MIN_PRICE).toLocaleString()} - ${(priceRange?.max ?? MAX_PRICE).toLocaleString()}`;

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

      <div className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-md">
        <span className="text-sm text-stone-600 whitespace-nowrap">{priceLabel}</span>
        <div className="w-32">
          <Range
            step={1000}
            min={MIN_PRICE}
            max={MAX_PRICE}
            values={localPrice}
            onChange={handlePriceChange}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '4px',
                  width: '100%',
                  background: getTrackBackground({
                    values: localPrice,
                    colors: ['#e5e5e5', '#eab308', '#e5e5e5'],
                    min: MIN_PRICE,
                    max: MAX_PRICE,
                  }),
                  borderRadius: '2px',
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props, index }) => (
              <div
                {...props}
                key={props.key}
                style={{
                  ...props.style,
                  height: '16px',
                  width: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#eab308',
                  border: '2px solid white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            )}
          />
        </div>
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