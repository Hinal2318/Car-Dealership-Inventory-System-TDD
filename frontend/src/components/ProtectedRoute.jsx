import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { token, user } = useContext(AuthContext);

    // If there is no authenticated token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If the route is admin-only and the user is not an admin, redirect to home/dashboard
    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Otherwise, render the protected children components
    return children;
};

export default ProtectedRoute;
