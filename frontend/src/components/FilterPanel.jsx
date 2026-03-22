import React, { useState } from 'react';

export default function FilterPanel({ onApply }) {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = () => {
    setLoading(true);
    onApply({
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-lg text-stone-800">Filters</h2>

      <div className="flex flex-col gap-2">
        <label className="text-stone-600 text-sm">Min Price</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-stone-600 text-sm">Max Price</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <button
        onClick={handleApply}
        disabled={loading}
        className="mt-2 bg-yellow-400 text-white py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
      >
        {loading ? 'Applying...' : 'Apply Filters'}
      </button>
    </div>
  );
}