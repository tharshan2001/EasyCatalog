import { Copy, Check } from "lucide-react";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const category = product.category;
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (product.code) {
      navigator.clipboard.writeText(product.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  
  return (
    <div className="group flex flex-col h-full" style={{
      background: '#fffefb',
      border: '1px solid #c5c0b1',
      borderRadius: '5px',
      overflow: 'hidden',
      transition: 'border-color 0.15s ease'
    }}>
      {/* Image Container */}
      <div className="relative w-full" style={{
        background: '#eceae3',
        height: '200px' // Increased slightly for a clearer view, adjust as needed
      }}>
        {category && (
          <div className="absolute top-2 left-2 z-10">
            <span style={{
              background: '#fffefb',
              padding: '2px 8px',
              borderRadius: '14px',
              fontSize: '11px',
              fontWeight: 500,
              color: '#36342e',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              {category.name}
            </span>
          </div>
        )}
        
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain', // Ensures the whole image is visible without cropping
              padding: '8px' // Optional: Gives a tiny edge margin so it doesn't touch the borders
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '48px' }}>📦</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-3 flex flex-col" style={{ flex: 1 }}>
        <div className="mb-1">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={copyCode}>
            <p className="label" style={{ fontSize: '10px', color: '#939084' }}>
              {product.code || '—'}
            </p>
            {product.code && (
              copied
                ? <Check size={12} style={{ color: '#ff4f00' }} />
                : <Copy size={10} style={{ color: '#c5c0b1' }} className="hover:text-[#ff4f00] transition-colors" />
            )}
          </div>
          <h3 className="group-hover:text-[#ff4f00] transition-colors" style={{
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '-0.48px',
            color: '#201515',
            lineHeight: 1.3
          }}>
            {product.name}
          </h3>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <p className="caption" style={{ fontSize: '11px', color: '#939084', textTransform: 'uppercase' }}>Price</p>
          <p style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#201515'
          }}>
            <span style={{ color: '#ff4f00', fontSize: '12px' }}>LKR</span> {product.price?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;