import { useState } from 'react';

const defaultValues = {
  make: '',
  model: '',
  category: '',
  price: '',
  quantity: '',
};

const VehicleForm = ({ initialValues, onSubmit }) => {
  const isEditMode = Boolean(initialValues);
  const [formData, setFormData] = useState(() =>
    initialValues
      ? {
          make: initialValues.make || '',
          model: initialValues.model || '',
          category: initialValues.category || '',
          price: initialValues.price ?? '',
          quantity: initialValues.quantity ?? '',
        }
      : defaultValues
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({
        make: formData.make.trim(),
        model: formData.model.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      });

      // Reset form after successful add (not edit)
      if (!isEditMode) {
        setFormData(defaultValues);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';

  const labelClass = 'mb-1 block text-sm font-medium text-slate-300';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-900/50 border border-red-500/50 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Make */}
        <div>
          <label htmlFor="vehicle-make" className={labelClass}>Make</label>
          <input
            id="vehicle-make"
            name="make"
            type="text"
            required
            value={formData.make}
            onChange={handleChange}
            placeholder="e.g. Toyota"
            className={inputClass}
          />
        </div>

        {/* Model */}
        <div>
          <label htmlFor="vehicle-model" className={labelClass}>Model</label>
          <input
            id="vehicle-model"
            name="model"
            type="text"
            required
            value={formData.model}
            onChange={handleChange}
            placeholder="e.g. Camry"
            className={inputClass}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="vehicle-category" className={labelClass}>Category</label>
          <input
            id="vehicle-category"
            name="category"
            type="text"
            required
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Sedan"
            className={inputClass}
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="vehicle-price" className={labelClass}>Price ($)</label>
          <input
            id="vehicle-price"
            name="price"
            type="number"
            min="0"
            required
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 25000"
            className={inputClass}
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="vehicle-quantity" className={labelClass}>Quantity</label>
          <input
            id="vehicle-quantity"
            name="quantity"
            type="number"
            min="0"
            required
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g. 5"
            className={inputClass}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {isEditMode ? 'Saving...' : 'Adding...'}
          </span>
        ) : (
          isEditMode ? 'Save Changes' : 'Add Vehicle'
        )}
      </button>
    </form>
  );
};

export default VehicleForm;
