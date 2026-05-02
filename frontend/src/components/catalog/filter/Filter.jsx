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

  const activeCount = [
    search, 
    category, 
    (priceRange?.min ?? minPrice) !== minPrice || (priceRange?.max ?? maxPrice) !== maxPrice
  ].filter(Boolean).length;

  const priceLabel = (priceRange?.min ?? minPrice) === minPrice && (priceRange?.max ?? maxPrice) === maxPrice
    ? 'Price' 
    : `LKR ${(priceRange?.min ?? minPrice).toLocaleString()} - ${(priceRange?.max ?? maxPrice).toLocaleString()}`;

  return (
    // Main container is now a column on mobile, and a flex row on desktop (lg:flex-row)
    <div className="w-full flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 mb-4">
      
      {/* Search & Mobile Toggle Block */}
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <div className="relative flex-1 lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#939084' }} />
          <input
            type="text"
            placeholder="Search..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-white border rounded-md focus:outline-none transition-colors"
            style={{ borderColor: '#c5c0b1', color: '#201515' }}
          />
          {localSearch && (
            <button 
              onClick={() => handleSearchChange('')} 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              style={{ color: '#939084' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded-md transition-colors"
          style={{ borderColor: '#c5c0b1', color: '#201515' }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white" style={{ backgroundColor: '#ff4f00' }}>
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Block */}
      <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto lg:flex-1`}>
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-sm bg-white border rounded-md focus:outline-none flex-1 min-w-[140px]"
          style={{ borderColor: '#c5c0b1', color: '#201515' }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <div className="w-full sm:w-auto flex items-center gap-3 px-3 py-2 bg-white border rounded-md flex-1 min-w-[220px] lg:max-w-[300px]" style={{ borderColor: '#c5c0b1' }}>
          <span className="text-sm font-medium whitespace-nowrap min-w-[60px]" style={{ color: '#201515' }}>{priceLabel}</span>
          <div className="flex-1 w-full px-2">
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
                    height: '16px',
                    width: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#ff4f00',
                    border: '2px solid white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                />
              )}
            />
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSort(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-sm bg-white border rounded-md focus:outline-none min-w-[140px]"
          style={{ borderColor: '#c5c0b1', color: '#201515' }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={`${opt.id}-${opt.sortOrder}`} value={opt.id}>{opt.label}</option>
          ))}
        </select>

        {activeCount > 0 && (
          <button
            onClick={handleClear}
            className="w-full sm:w-auto px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: '#ff4f00' }}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}