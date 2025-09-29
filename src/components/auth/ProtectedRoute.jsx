// src/components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, loading, isAuthenticated, hasRole } = useAuth();

    // Показываем лоадер пока проверяем аутентификацию
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Загрузка...</div>
            </div>
        );
    }

    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Если указаны разрешенные роли и роль пользователя не входит в список,
    // перенаправляем на страницу по умолчанию
    if (!hasRole(allowedRoles)) {
        return <Navigate to="/menu" replace />;
    }

    // Если все проверки пройдены, отображаем запрашиваемый компонент
    return children;
}