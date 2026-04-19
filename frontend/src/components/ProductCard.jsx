import React from 'react';

const ProductCard = ({ product }) => {
  const category = product.category;
  
  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden">
        {category && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-white/90 backdrop-blur-sm text-xs font-medium text-stone-700 px-2 py-1 rounded-full shadow-sm">
              {category.name}
            </span>
          </div>
        )}
        <div className="w-full h-full p-4 flex items-center justify-center">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              <span className="text-4xl">📦</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <p className="text-xs font-medium text-stone-400 uppercase mb-1">
            {product.code || 'No code'}
          </p>
          <h3 className="text-sm font-semibold text-stone-800 leading-tight group-hover:text-yellow-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto">
          <p className="text-xs text-stone-500 font-medium uppercase mb-1">Price</p>
          <p className="text-xl font-bold text-stone-900">
            <span className="text-yellow-600">LKR</span> {product.price?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;