import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../../store/api';
import { useFilter } from './context/FilterContext';
import ProductCard from '../ProductCard';

export default function ProductGrid() {
  const { getQueryParams, sortBy } = useFilter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  const cursorRef = useRef(null);
  const loadingRef = useRef(false);

  const loadMore = async (isInitial = false) => {
    if (loadingRef.current || !hasMore) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams(getQueryParams());
      if (!isInitial && cursorRef.current) {
        params.append('cursor', cursorRef.current);
      }
      params.append('limit', '12');

      const { data } = await api.get(`/products/search/advanced?${params}`);
      
      const newProducts = isInitial ? data.products : [...products, ...data.products];
      
      setProducts(newProducts);
      setHasMore(data.hasMore);
      
      if (data.hasMore && data.products.length > 0) {
        const lastProduct = data.products[data.products.length - 1];
        cursorRef.current = lastProduct[sortBy];
      } else {
        cursorRef.current = null;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    cursorRef.current = null;
    setProducts([]);
    setHasMore(true);
    loadMore(true);
  }, [getQueryParams]);

  useEffect(() => {
    if (loading || !hasMore || products.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(false);
        }
      },
      { rootMargin: '300px' }
    );
    
    const lastCard = document.querySelector('[data-last-card]');
    if (lastCard) observer.observe(lastCard);
    
    return () => observer.disconnect();
  }, [products.length, loading, hasMore, sortBy, getQueryParams, loadMore]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-stone-200">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
      <div className="mb-4 text-sm text-stone-500">
        Showing {products.length} products
      </div>
      
      {products.length === 0 && !loading ? (
        <p className="text-center text-stone-500 py-12">No products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <div
              key={product._id}
              data-last-card={index === products.length - 1 ? 'true' : undefined}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
        </div>
      )}
      
      {!hasMore && products.length > 0 && (
        <p className="text-center text-stone-400 py-4">No more products to load</p>
      )}
    </div>
  );
}