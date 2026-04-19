import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import api from '../../../store/api';

const FilterContext = createContext(null);

const SORT_OPTIONS = [
  { id: '_id', label: 'Newest', sortOrder: 'desc' },
  { id: '_id', label: 'Oldest', sortOrder: 'asc' },
  { id: 'price', label: 'Price: Low', sortOrder: 'asc' },
  { id: 'price', label: 'Price: High', sortOrder: 'desc' },
  { id: 'name', label: 'Name A-Z', sortOrder: 'asc' },
  { id: 'name', label: 'Name Z-A', sortOrder: 'desc' },
];

const initialState = {
  search: '',
  category: '',
  priceRange: { min: null, max: null },
  sortBy: '_id',
  sortOrder: 'desc',
  categories: [],
  categoriesLoading: false,
  priceStats: { min: 0, max: 100000 },
};

function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_CATEGORIES_LOADING':
      return { ...state, categoriesLoading: action.payload };
    case 'SET_PRICE_STATS':
      return { ...state, priceStats: action.payload };
    case 'RESET_FILTERS':
      return { 
        ...state, 
        search: '', 
        category: '', 
        priceRange: { min: state.priceStats?.min ?? 0, max: state.priceStats?.max ?? 100000 }, 
        sortBy: '_id', 
        sortOrder: 'desc' 
      };
    default:
      return state;
  }
}

export function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: 'SET_CATEGORIES_LOADING', payload: true });
      try {
        const [catRes, statsRes] = await Promise.allSettled([
          api.get('/categories'),
          api.get('/products/stats')
        ]);
        
        if (catRes.status === 'fulfilled') {
          dispatch({ type: 'SET_CATEGORIES', payload: catRes.value.data.categories || [] });
        }
        
        if (statsRes.status === 'fulfilled' && statsRes.value.data) {
          dispatch({ type: 'SET_PRICE_STATS', payload: statsRes.value.data });
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        dispatch({ type: 'SET_CATEGORIES_LOADING', payload: false });
      }
    }
    fetchData();
  }, []);

  const setSearch = useCallback((value) => dispatch({ type: 'SET_SEARCH', payload: value }), []);
  const setCategory = useCallback((value) => dispatch({ type: 'SET_CATEGORY', payload: value }), []);
  const setPriceRange = useCallback((value) => dispatch({ type: 'SET_PRICE_RANGE', payload: value }), []);
  const setSort = useCallback((sortId) => {
    const option = SORT_OPTIONS.find(o => o.id === sortId);
    if (option) {
      dispatch({ type: 'SET_SORT', payload: { sortBy: option.id, sortOrder: option.sortOrder } });
    }
  }, []);
  const resetFilters = useCallback(() => dispatch({ type: 'RESET_FILTERS' }), []);

  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (state.search) params.append('search', state.search);
    if (state.category) params.append('category', state.category);
    if (state.priceRange && state.priceRange.min != null && state.priceRange.min > 0) {
      params.append('minPrice', state.priceRange.min);
    }
    if (state.priceRange && state.priceRange.max != null && state.priceRange.max > 0) {
      params.append('maxPrice', state.priceRange.max);
    }
    params.append('sortBy', state.sortBy);
    params.append('sortOrder', state.sortOrder);
    return params.toString();
  }, [state.search, state.category, state.priceRange, state.sortBy, state.sortOrder]);

  const value = {
    ...state,
    SORT_OPTIONS,
    setSearch,
    setCategory,
    setPriceRange,
    setSort,
    resetFilters,
    getQueryParams,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within FilterProvider');
  }
  return context;
}