// src/components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../../api/auth';

// Компонент для защиты маршрутов
export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const isLoggedIn = isAuthenticated();
    const userRole = getUserRole();

    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Если указаны разрешенные роли и роль пользователя не входит в список,
    // перенаправляем на страницу по умолчанию (меню)
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/menu" replace />;
    }

    // Если все проверки пройдены, отображаем запрашиваемый компонент
    return children;
}