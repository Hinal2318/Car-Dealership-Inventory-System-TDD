import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import VehicleCard from '../components/VehicleCard';
import SearchBar from '../components/SearchBar';

const DashboardPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  // Fetch all vehicles on mount
  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosClient.get('/vehicles');
        setVehicles(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load vehicles.');
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, []);

  // Handle search with filters
  const handleSearch = async (filters) => {
    setLoading(true);
    setError('');
    try {
      const hasFilters = Object.keys(filters).length > 0;
      const response = hasFilters
        ? await axiosClient.get('/vehicles/search', { params: filters })
        : await axiosClient.get('/vehicles');
      setVehicles(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle vehicle purchase
  const handlePurchase = async (vehicle) => {
    setPurchaseError('');
    setPurchaseSuccess('');

    try {
      const response = await axiosClient.post(`/vehicles/${vehicle._id}/purchase`);
      const updatedVehicle = response.data.vehicle;

      // Update the quantity of the purchased vehicle in local state
      setVehicles((prev) =>
        prev.map((v) =>
          v._id === updatedVehicle._id ? { ...v, quantity: updatedVehicle.quantity } : v
        )
      );

      setPurchaseSuccess(`Successfully purchased ${vehicle.make} ${vehicle.model}!`);
      setTimeout(() => setPurchaseSuccess(''), 4000);
    } catch (err) {
      setPurchaseError(err.response?.data?.error || 'Purchase failed. Please try again.');
      setTimeout(() => setPurchaseError(''), 4000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Vehicle <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">Inventory</span>
        </h1>
        <p className="mt-2 text-slate-400">Browse and purchase available vehicles.</p>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Feedback Messages */}
      {purchaseSuccess && (
        <div className="mb-6 rounded-lg bg-emerald-900/50 border border-emerald-600/50 p-4 text-sm text-emerald-200">
          {purchaseSuccess}
        </div>
      )}
      {purchaseError && (
        <div className="mb-6 rounded-lg bg-red-900/50 border border-red-500/50 p-4 text-sm text-red-200">
          {purchaseError}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <svg className="h-10 w-10 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="rounded-lg bg-red-900/50 border border-red-500/50 p-6 text-center text-red-200">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && vehicles.length === 0 && (
        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 py-24 text-center text-slate-400">
          <p className="text-lg font-medium">No vehicles available at the moment.</p>
        </div>
      )}

      {/* Vehicle Grid */}
      {!loading && !error && vehicles.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
