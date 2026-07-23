const VehicleCard = ({ vehicle, onPurchase }) => {
  const { make, model, category, price, quantity } = vehicle;
  const outOfStock = quantity === 0;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg hover:shadow-indigo-900/20 hover:border-slate-600 transition-all duration-200">
      {/* Category Badge */}
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-indigo-900/50 border border-indigo-700/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
          {category}
        </span>
        {/* Stock indicator */}
        <span
          className={`text-xs font-semibold ${
            outOfStock ? 'text-red-400' : 'text-emerald-400'
          }`}
        >
          {outOfStock ? 'Out of Stock' : `${quantity} in stock`}
        </span>
      </div>

      {/* Vehicle Info */}
      <div className="flex-1 space-y-1">
        <h3 className="text-xl font-bold text-white">
          {make} <span className="text-indigo-300">{model}</span>
        </h3>
        <p className="text-2xl font-extrabold text-white mt-2">
          ${price.toLocaleString()}
        </p>
      </div>

      {/* Purchase Button */}
      <button
        onClick={() => !outOfStock && onPurchase && onPurchase(vehicle)}
        disabled={outOfStock}
        className={`mt-6 w-full rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
          outOfStock
            ? 'cursor-not-allowed bg-slate-700 text-slate-500'
            : 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500'
        }`}
      >
        {outOfStock ? 'Unavailable' : 'Purchase'}
      </button>
    </div>
  );
};

export default VehicleCard;
