import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
      isActive(path)
        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  // Show only the username part before @
  const displayName = user?.email?.split('@')[0] || '';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0f1117]/90 backdrop-blur-xl shadow-xl shadow-black/30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* ── Brand + Nav Links (left group) ── */}
        <div className="flex items-center gap-10">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-md shadow-indigo-900/60 group-hover:bg-indigo-500 transition-colors">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-.001M13 16H9m4 0h4m0 0l2-.001M17 16V9a1 1 0 00-1-1h-1.5a1 1 0 00-.8.4L12 11" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Drive<span className="text-indigo-400">Deal</span>
            </span>
          </Link>

          {/* Nav Links */}
          {token && (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className={navLinkClass('/admin')}>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    Admin Panel
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>
        {/* ── Right Section ── */}
        <div className="flex items-center gap-2">
          {token ? (
            <>
              {/* Bell icon */}
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* User avatar + name + role */}
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-2.5 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white uppercase shadow-md shadow-indigo-900/50">
                  {displayName.charAt(0)}
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-semibold text-slate-200 capitalize">
                    {displayName}
                  </span>
                  <span className={`text-[10px] font-medium capitalize ${user?.role === 'admin' ? 'text-amber-400' : 'text-indigo-400'}`}>
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-red-700/50 hover:bg-red-900/30 hover:text-red-300 transition-all duration-200"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Logout
              </button>

              {/* Mobile hamburger */}
              <button
                className="ml-1 flex md:hidden items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/40 hover:bg-indigo-500 transition-all">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {menuOpen && token && (
        <div className="md:hidden border-t border-white/5 bg-[#0f1117]/95 px-4 py-3 space-y-1">
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={`block rounded-lg px-3 py-2 text-sm font-medium ${isActive('/dashboard') ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Dashboard
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm font-medium ${isActive('/admin') ? 'bg-amber-600/20 text-amber-300' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Admin Panel
            </Link>
          )}
          <div className="pt-2 border-t border-white/5">
            <p className="px-3 text-xs text-slate-500 capitalize">{displayName} · {user?.role}</p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
