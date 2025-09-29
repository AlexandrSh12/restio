// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';

import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import ChefPage from './pages/ChefPage';
import ConfirmOrderPage from './pages/ConfirmOrderPage';
import SuccessPage from './pages/SuccessPage';
import AdminPage from './pages/admin/AdminPage';

import './App.css';

function App() {
    return (
        <AuthProvider>
            <OrderProvider>
                <Router>
                    <Routes>
                        {/* Публичный маршрут для входа */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Защищенные маршруты для официантов и админов */}
                        <Route path="/" element={
                            <ProtectedRoute allowedRoles={['WAITER', 'ADMIN']}>
                                <MenuPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/menu" element={
                            <ProtectedRoute allowedRoles={['WAITER', 'ADMIN']}>
                                <MenuPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/confirm" element={
                            <ProtectedRoute allowedRoles={['WAITER', 'ADMIN']}>
                                <ConfirmOrderPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/success" element={
                            <ProtectedRoute allowedRoles={['WAITER', 'ADMIN']}>
                                <SuccessPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/chef" element={
                            <ProtectedRoute allowedRoles={['WAITER', 'ADMIN', 'CHEF']}>
                                <ChefPage />
                            </ProtectedRoute>
                        } />

                        {/* Маршрут только для администраторов */}
                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminPage />
                            </ProtectedRoute>
                        } />

                        {/* Перенаправление на страницу логина для неизвестных маршрутов */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Router>
            </OrderProvider>
        </AuthProvider>
    );
}

export default App;