import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in
    const checkAuth = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (token) {
            try {
                // Configure axios header
                setAuthToken(token);

                // Get user profile
                const res = await axios.get('/api/users/profile');
                setUser(res.data);
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('token');
                setAuthToken(null);
                setUser(null);
            }
        } else {
            setUser(null);
        }

        setLoading(false);
    }, []);

    // Login
    const login = async (universityId, password) => {
        try {
            const res = await axios.post('/api/auth/login', { universityId, password });

            // Save token to localStorage
            localStorage.setItem('token', res.data.token);

            // Set axios header
            setAuthToken(res.data.token);

            // Set user state
            setUser(res.data.user);

            return res.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Login failed');
        }
    };

    // Register
    const register = async (userData) => {
        try {
            const res = await axios.post('/api/auth/register', userData);
            return res.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Registration failed');
        }
    };

    // Logout
    const logout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');

        // Remove axios header
        setAuthToken(null);

        // Clear user state
        setUser(null);
    };

    // Update profile
    const updateProfile = async (userData) => {
        try {
            const res = await axios.put('/api/users/profile', userData);
            setUser({ ...user, ...res.data });
            return res.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Profile update failed');
        }
    };

    // Set auth token for axios requests
    const setAuthToken = (token) => {
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
        } else {
            delete axios.defaults.headers.common['x-auth-token'];
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        checkAuth
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;