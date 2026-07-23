import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="border-b border-slate-800 bg-slate-900 px-6 py-4 text-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                {/* Brand / App Name */}
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white hover:text-indigo-400 transition-colors">
                    <span className="bg-gradient-to-r from-indigo-500 to-indigo-300 bg-clip-text text-transparent">
                        DriveDeal
                    </span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold tracking-wider">
                        Portal
                    </span>
                </Link>

                {/* Dynamic Navigation Links */}
                <div className="flex items-center space-x-6">
                    {token && (
                        <>
                            <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                                    Admin Panel
                                </Link>
                            )}
                        </>
                    )}
                </div>

                {/* Dynamic Authenticated Session Buttons */}
                <div className="flex items-center space-x-4">
                    {token ? (
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-semibold text-slate-200">{user?.email}</span>
                                <span className="text-xs text-indigo-400 capitalize">{user?.role}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link
                                to="/login"
                                className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm font-medium transition-all"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
