import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../../store/api';
import { useFilter } from './context/FilterContext';
import ProductCard from '../ProductCard';

export default function ProductGrid() {
  const { getQueryParams } = useFilter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  const cursorRef = useRef(null);
  const loadingRef = useRef(false);
  const productsRef = useRef([]);

  const loadMore = (isInitial = false) => {
    if (loadingRef.current || (!isInitial && !hasMore)) return;
    
    loadingRef.current = true;
    if (isInitial) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    const currentProducts = isInitial ? [] : productsRef.current;

    api.get(`/products/search/advanced?${getQueryParams()}${!isInitial && cursorRef.current ? `&cursor=${cursorRef.current}` : ''}&limit=12`)
      .then(({ data }) => {
        const newProducts = isInitial ? data.products : [...currentProducts, ...data.products];
        
        setProducts(newProducts);
        productsRef.current = newProducts;
        setHasMore(data.hasMore);
        
        if (data.hasMore && data.products.length > 0) {
          const lastProduct = data.products[data.products.length - 1];
          cursorRef.current = lastProduct._id;
        } else {
          cursorRef.current = null;
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load products');
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
        loadingRef.current = false;
      });
  };

  useEffect(() => {
    cursorRef.current = null;
    productsRef.current = [];
    setProducts([]);
    setHasMore(true);
    loadMore(true);
  }, [getQueryParams()]);

  useEffect(() => {
    if (loadingMore || !hasMore || products.length === 0) return;

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
  }, [products.length, loadingMore, hasMore, getQueryParams]);

  if (error) {
    return (
      <div className="card">
        <p style={{ color: '#ff4f00' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className='mt-15'>
      <div style={{ 
        marginBottom: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        color: '#939084',
        fontSize: '14px'
      }}>
        <span>{loading ? 'Loading...' : `${products.length} products`}</span>
        {loadingMore && <Loader2 className="w-3 h-3 animate-spin" style={{ color: '#ff4f00' }} />}
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#ff4f00' }} />
        </div>
      ) : products.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
          <p style={{ color: '#939084' }}>No products found</p>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product, index) => (
              <div
                key={product._id}
                data-last-card={index === products.length - 1 ? 'true' : undefined}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {loadingMore && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#ff4f00' }} />
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <p style={{ textAlign: 'center', color: '#c5c0b1', padding: '16px 0', fontSize: '14px' }}>
              No more products
            </p>
          )}
        </>
      )}
    </div>
  );
}