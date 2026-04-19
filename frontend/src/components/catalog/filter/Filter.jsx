import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Range, getTrackBackground } from 'react-range';
import { useFilter } from '../context/FilterContext';

export default function Filter() {
  const {
    search,
    category,
    priceRange,
    sortBy,
    SORT_OPTIONS,
    categories,
    priceStats,
    setSearch,
    setCategory,
    setPriceRange,
    setSort,
    resetFilters,
  } = useFilter();

  const minPrice = priceStats?.min ?? 0;
  const maxPrice = priceStats?.max ?? 100000;

  const [localSearch, setLocalSearch] = useState(search);
  const [localPrice, setLocalPrice] = useState([
    priceRange?.min ?? minPrice,
    priceRange?.max ?? maxPrice
  ]);
  const [showFilters, setShowFilters] = useState(false);
  const searchDebounceRef = useRef(null);
  const priceDebounceRef = useRef(null);

  const handleSearchChange = useCallback((value) => {
    setLocalSearch(value);
    
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    
    searchDebounceRef.current = setTimeout(() => {
      setSearch(value);
    }, 400);
  }, [setSearch]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    setLocalPrice([
      priceRange?.min ?? minPrice,
      priceRange?.max ?? maxPrice
    ]);
  }, [priceRange, minPrice, maxPrice]);

  const handlePriceChange = useCallback((values) => {
    setLocalPrice(values);
    
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
    }
    
    priceDebounceRef.current = setTimeout(() => {
      setPriceRange({ min: values[0], max: values[1] });
    }, 300);
  }, [setPriceRange]);

  const handleClear = useCallback(() => {
    setLocalSearch('');
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
    }
    setSearch('');
    setLocalPrice([minPrice, maxPrice]);
    setCategory('');
    setSort('_id');
    setPriceRange({ min: null, max: null });
    resetFilters();
  }, [setSearch, setCategory, setSort, resetFilters, setPriceRange, minPrice, maxPrice]);

  const activeCount = [search, category, (priceRange?.min ?? minPrice) > minPrice || (priceRange?.max ?? maxPrice) < maxPrice].filter(Boolean).length;

  const priceLabel = (priceRange?.min ?? minPrice) === minPrice && (priceRange?.max ?? maxPrice) === maxPrice
    ? 'Price' 
    : `LKR ${(priceRange?.min ?? minPrice).toLocaleString()} - ${(priceRange?.max ?? maxPrice).toLocaleString()}`;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-1 md:flex-none md:w-48 lg:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#939084' }} />
          <input
            type="text"
            placeholder="Search..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 md:py-2 text-sm bg-white border rounded-md focus:outline-none"
            style={{ borderColor: '#c5c0b1', color: '#201515' }}
          />
          {localSearch && (
            <button 
              onClick={() => handleSearchChange('')} 
              className="absolute right-2 top-1/2 -translate-y-1/2"
              style={{ color: '#939084' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border rounded-md"
          style={{ borderColor: '#c5c0b1', color: '#201515' }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white" style={{ backgroundColor: '#ff4f00' }}>
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-wrap items-center gap-2`}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-2.5 py-1.5 text-sm bg-white border rounded-md focus:outline-none flex-1 min-w-[100px]"
          style={{ borderColor: '#c5c0b1', color: '#201515' }}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-2 px-2 py-1 bg-white border rounded-md flex-1 min-w-[180px] md:min-w-[220px]" style={{ borderColor: '#c5c0b1' }}>
          <span className="text-xs whitespace-nowrap hidden sm:block" style={{ color: '#201515' }}>{priceLabel}</span>
          <span className="text-xs whitespace-nowrap sm:hidden" style={{ color: '#201515' }}>{priceLabel}</span>
          <div className="flex-1">
            <Range
              step={1000}
              min={minPrice}
              max={maxPrice}
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
                      colors: ['#c5c0b1', '#ff4f00', '#c5c0b1'],
                      min: minPrice,
                      max: maxPrice,
                    }),
                    borderRadius: '2px',
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  key={props.key}
                  style={{
                    ...props.style,
                    height: '14px',
                    width: '14px',
                    borderRadius: '50%',
                    backgroundColor: '#ff4f00',
                    border: '2px solid white',
                  }}
                />
              )}
            />
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSort(e.target.value)}
          className="px-2.5 py-1.5 text-sm bg-white border rounded-md focus:outline-none"
          style={{ borderColor: '#c5c0b1', color: '#201515' }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={`${opt.id}-${opt.sortOrder}`} value={opt.id}>{opt.label}</option>
          ))}
        </select>

        {activeCount > 0 && (
          <button
            onClick={handleClear}
            className="px-2.5 py-1.5 text-sm font-medium hover:opacity-80"
            style={{ color: '#ff4f00' }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}