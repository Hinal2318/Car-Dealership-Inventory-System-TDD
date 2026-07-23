import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Strip out empty values so they are not sent as query params
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '')
    );
    onSearch(activeFilters);
  };

  const handleReset = () => {
    const cleared = { make: '', model: '', category: '', minPrice: '', maxPrice: '' };
    setFilters(cleared);
    onSearch({});
  };

  const inputClass =
    'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg"
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
        Filter Vehicles
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Make */}
        <div>
          <label htmlFor="search-make" className="mb-1 block text-xs font-medium text-slate-400">
            Make
          </label>
          <input
            id="search-make"
            name="make"
            type="text"
            value={filters.make}
            onChange={handleChange}
            placeholder="e.g. Toyota"
            className={inputClass}
          />
        </div>

        {/* Model */}
        <div>
          <label htmlFor="search-model" className="mb-1 block text-xs font-medium text-slate-400">
            Model
          </label>
          <input
            id="search-model"
            name="model"
            type="text"
            value={filters.model}
            onChange={handleChange}
            placeholder="e.g. Camry"
            className={inputClass}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="search-category" className="mb-1 block text-xs font-medium text-slate-400">
            Category
          </label>
          <input
            id="search-category"
            name="category"
            type="text"
            value={filters.category}
            onChange={handleChange}
            placeholder="e.g. Sedan"
            className={inputClass}
          />
        </div>

        {/* Min Price */}
        <div>
          <label htmlFor="search-minPrice" className="mb-1 block text-xs font-medium text-slate-400">
            Min Price ($)
          </label>
          <input
            id="search-minPrice"
            name="minPrice"
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="e.g. 5000"
            className={inputClass}
          />
        </div>

        {/* Max Price */}
        <div>
          <label htmlFor="search-maxPrice" className="mb-1 block text-xs font-medium text-slate-400">
            Max Price ($)
          </label>
          <input
            id="search-maxPrice"
            name="maxPrice"
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="e.g. 50000"
            className={inputClass}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-600 bg-slate-700 px-5 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-600 hover:text-white transition-all"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
