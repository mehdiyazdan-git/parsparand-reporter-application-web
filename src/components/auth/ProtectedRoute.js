
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from "./useAuth";

const ProtectedRoute = ({ children }) => {
    const { getToken } = useAuth();
    const token = getToken();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;

