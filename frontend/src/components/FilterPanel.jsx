import React, { useState } from "react";

export default function FilterPanel({ onFilter, minLimit = 0, maxLimit = 100000 }) {
  const [minValue, setMinValue] = useState(minLimit);
  const [maxValue, setMaxValue] = useState(maxLimit);

  // Ensure min slider doesn't exceed maxValue and vice versa
  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    setMinValue(Math.min(value, maxValue));
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    setMaxValue(Math.max(value, minValue));
  };

  const applyFilter = () => {
    onFilter({ min: minValue, max: maxValue });
  };

  const resetFilter = () => {
    setMinValue(minLimit);
    setMaxValue(maxLimit);
    onFilter({ min: minLimit, max: maxLimit });
  };

  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-24">
      <div>
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
          Price Range
        </h3>
        
        <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200/50 space-y-4">
          {/* Display current min and max */}
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] text-stone-500 font-bold uppercase block">Min</span>
              <span className="font-mono font-bold text-stone-900">LKR {minValue}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-500 font-bold uppercase block">Max</span>
              <span className="font-mono font-bold text-yellow-600">LKR {maxValue}</span>
            </div>
          </div>

          {/* Min slider */}
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step={100}
            value={minValue}
            onChange={handleMinChange}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />

          {/* Max slider */}
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step={100}
            value={maxValue}
            onChange={handleMaxChange}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>
      </div>

      <button
        onClick={applyFilter}
        className="w-full bg-yellow-400 text-white font-bold py-3.5 rounded-xl hover:bg-yellow-500 hover:text-stone-900 shadow-lg shadow-stone-200 transition-all active:scale-[0.98]"
      >
        Apply Filters
      </button>
      
      <button 
        onClick={resetFilter}
        className="text-xs font-bold text-stone-500 hover:text-stone-600 transition-colors uppercase tracking-widest text-center"
      >
        Reset to Default
      </button>
    </div>
  );
}