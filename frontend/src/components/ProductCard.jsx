import React from 'react';

const ProductCard = ({ product }) => {
  const category = product.category;
  
  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden">
        {category && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2 py-1 rounded-full shadow-sm">
              {category.name}
            </span>
          </div>
        )}
        <div className="w-full h-full p-4 flex items-center justify-center">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-400 uppercase mb-1">
            {product.code}
          </p>
          <h3 className="text-base font-semibold text-gray-900 leading-tight group-hover:text-yellow-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto">
          <p className="text-xs text-gray-500 font-medium uppercase mb-1">Price</p>
          <p className="text-xl font-bold text-gray-900">
            <span className="text-yellow-600">LKR</span> {product.price}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;