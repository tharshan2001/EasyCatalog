import { FilterProvider } from '../context/FilterContext';
import Filter from '../filter/Filter';

export default function CatalogLayout({ children }) {
  return (
    <FilterProvider>
      <div className="min-h-screen bg-stone-100">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12 md:h-16">
              <h1 className="text-lg md:text-xl font-bold text-stone-800">EasyCatalog</h1>
            </div>
          </div>
        </header>

        <div className="fixed top-12 md:top-16 left-0 right-0 z-40 bg-stone-100/95 backdrop-blur-sm border-b border-stone-200/50">
          <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8 py-2 md:py-3">
            <Filter />
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8 pt-28 md:pt-40">
          {children}
        </main>
      </div>
    </FilterProvider>
  );
}