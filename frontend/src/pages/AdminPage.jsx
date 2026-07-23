import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import VehicleForm from '../components/VehicleForm';

const AdminPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Edit state
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Restock state
  const [restockId, setRestockId] = useState(null);
  const [restockQty, setRestockQty] = useState(1);

  // Load vehicles on mount
  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get('/vehicles');
        setVehicles(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load vehicles.');
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  // --- Add Vehicle ---
  const handleAdd = async (data) => {
    const res = await axiosClient.post('/vehicles', data);
    setVehicles((prev) => [...prev, res.data]);
    showFeedback('success', `${data.make} ${data.model} added successfully.`);
  };

  // --- Update Vehicle ---
  const handleUpdate = async (data) => {
    const res = await axiosClient.put(`/vehicles/${editingVehicle._id}`, data);
    setVehicles((prev) =>
      prev.map((v) => (v._id === res.data._id ? res.data : v))
    );
    setEditingVehicle(null);
    showFeedback('success', `${data.make} ${data.model} updated successfully.`);
  };

  // --- Delete Vehicle ---
  const handleDelete = async (vehicle) => {
    if (!window.confirm(`Delete ${vehicle.make} ${vehicle.model}? This cannot be undone.`)) return;
    try {
      await axiosClient.delete(`/vehicles/${vehicle._id}`);
      setVehicles((prev) => prev.filter((v) => v._id !== vehicle._id));
      showFeedback('success', `${vehicle.make} ${vehicle.model} deleted.`);
    } catch (err) {
      showFeedback('error', err.response?.data?.error || 'Delete failed.');
    }
  };

  // --- Restock Vehicle ---
  const handleRestock = async (vehicle) => {
    try {
      const res = await axiosClient.post(`/vehicles/${vehicle._id}/restock`, {
        quantity: Number(restockQty),
      });
      setVehicles((prev) =>
        prev.map((v) => (v._id === res.data.vehicle._id ? res.data.vehicle : v))
      );
      setRestockId(null);
      setRestockQty(1);
      showFeedback('success', `${vehicle.make} ${vehicle.model} restocked by ${restockQty}.`);
    } catch (err) {
      showFeedback('error', err.response?.data?.error || 'Restock failed.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Admin{' '}
          <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
            Panel
          </span>
        </h1>
        <p className="mt-2 text-slate-400">Manage your vehicle inventory.</p>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div
          className={`mb-6 rounded-lg border p-4 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-900/50 border-emerald-600/50 text-emerald-200'
              : 'bg-red-900/50 border-red-500/50 text-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* ── Left: Add / Edit Vehicle ── */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg">
            <h2 className="mb-5 text-lg font-bold text-white">
              {editingVehicle ? `Edit: ${editingVehicle.make} ${editingVehicle.model}` : 'Add Vehicle'}
            </h2>

            <VehicleForm
              key={editingVehicle?._id || 'add'}
              initialValues={editingVehicle || undefined}
              onSubmit={editingVehicle ? handleUpdate : handleAdd}
            />

            {editingVehicle && (
              <button
                onClick={() => setEditingVehicle(null)}
                className="mt-3 w-full rounded-lg border border-slate-600 bg-slate-700 py-2 text-sm text-slate-300 hover:bg-slate-600 transition-all"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* ── Right: Vehicle List ── */}
        <div className="lg:col-span-2">
          <h2 className="mb-5 text-lg font-bold text-white">
            All Vehicles
            <span className="ml-2 rounded-full bg-slate-700 px-2.5 py-0.5 text-xs text-slate-300">
              {vehicles.length}
            </span>
          </h2>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <svg className="h-8 w-8 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-lg border border-red-500/50 bg-red-900/50 p-6 text-center text-red-200">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && vehicles.length === 0 && (
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 py-20 text-center text-slate-400">
              No vehicles found. Add one using the form.
            </div>
          )}

          {/* Vehicle Rows */}
          {!loading && !error && vehicles.length > 0 && (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="rounded-xl border border-slate-700 bg-slate-800 p-5 shadow transition-all hover:border-slate-600"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Vehicle Info */}
                    <div>
                      <p className="text-base font-bold text-white">
                        {vehicle.make} {vehicle.model}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-400">
                        {vehicle.category} &bull; ${vehicle.price.toLocaleString()} &bull;{' '}
                        <span className={vehicle.quantity === 0 ? 'text-red-400' : 'text-emerald-400'}>
                          {vehicle.quantity === 0 ? 'Out of stock' : `${vehicle.quantity} in stock`}
                        </span>
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditingVehicle(vehicle);
                          setRestockId(null);
                        }}
                        className="rounded-lg border border-indigo-700 bg-indigo-900/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-800 transition-all"
                      >
                        Edit
                      </button>

                      {/* Restock */}
                      <button
                        onClick={() => {
                          setRestockId(restockId === vehicle._id ? null : vehicle._id);
                          setRestockQty(1);
                          setEditingVehicle(null);
                        }}
                        className="rounded-lg border border-amber-700 bg-amber-900/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-800 transition-all"
                      >
                        Restock
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(vehicle)}
                        className="rounded-lg border border-red-700 bg-red-900/40 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-800 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Inline Restock Panel */}
                  {restockId === vehicle._id && (
                    <div className="mt-4 flex items-center gap-3 rounded-lg border border-amber-700/30 bg-amber-900/20 px-4 py-3">
                      <label htmlFor={`restock-${vehicle._id}`} className="text-sm text-amber-300">
                        Qty to add:
                      </label>
                      <input
                        id={`restock-${vehicle._id}`}
                        type="number"
                        min="1"
                        value={restockQty}
                        onChange={(e) => setRestockQty(e.target.value)}
                        className="w-20 rounded-lg border border-slate-600 bg-slate-700 px-2 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRestock(vehicle)}
                        className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition-all"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setRestockId(null)}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
