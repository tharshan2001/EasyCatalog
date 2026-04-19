const ProductCard = ({ product }) => {
  const category = product.category;
  
  return (
    <div className="group flex flex-col" style={{
      background: '#fffefb',
      border: '1px solid #c5c0b1',
      borderRadius: '5px',
      overflow: 'hidden',
      transition: 'border-color 0.15s ease'
    }}>
      <div className="relative" style={{
        background: '#eceae3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '180px'
      }}>
        {category && (
          <div className="absolute top-2 left-2 z-10">
            <span style={{
              background: '#fffefb',
              padding: '2px 8px',
              borderRadius: '14px',
              fontSize: '11px',
              fontWeight: 500,
              color: '#36342e'
            }}>
              {category.name}
            </span>
          </div>
        )}
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
          />
        ) : (
          <span style={{ fontSize: '48px' }}>📦</span>
        )}
      </div>

      <div className="p-3 flex flex-col" style={{ flex: 1 }}>
        <div className="mb-1">
          <p className="label" style={{ fontSize: '10px', color: '#939084' }}>
            {product.code || '—'}
          </p>
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