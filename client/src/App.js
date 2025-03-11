import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ReportItem from './pages/ReportItem';
import ItemDetails from './pages/ItemDetails';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import { Container, CircularProgress, Box } from '@mui/material';

// Private Route Component
const PrivateRoute = ({ element }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return user ? element : <Navigate to="/login" />;
};

function App() {
    const { checkAuth } = useAuth();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <div className="app-container">
            <Navbar />
            <Container sx={{ mt: 4, mb: 4 }}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
                    <Route path="/report-item" element={<PrivateRoute element={<ReportItem />} />} />
                    <Route path="/items/:id" element={<PrivateRoute element={<ItemDetails />} />} />
                    <Route path="/notifications" element={<PrivateRoute element={<Notifications />} />} />
                    <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
                    {/* Add more routes as needed */}
                </Routes>
            </Container>
        </div>
    );
}

export default App;