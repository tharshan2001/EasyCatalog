import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* Image */}
      <div className="relative aspect-square bg-stone-50 overflow-hidden flex items-center justify-center p-2">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <div className="mb-2">
          <p className="text-[10px] font-bold tracking-widest text-yellow-600 uppercase mb-1">
            CODE: {product.code}
          </p>
          <h3 className="text-lg font-bold text-stone-900 leading-tight group-hover:text-yellow-600 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto pt-2 border-t border-stone-50">
          <span className="text-[10px] text-stone-400 font-semibold uppercase">Price</span>
          <div className="text-2xl font-black text-stone-900">
            LKR {product.price}.00
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;