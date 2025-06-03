// src/App.jsx (обновленная версия)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import ConfirmOrderPage from './pages/ConfirmOrderPage';
import SuccessPage from './pages/SuccessPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/admin/AdminPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { OrderProvider } from "./context/OrderContext.jsx";

function App() {
    return (
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
    );
}

export default App;