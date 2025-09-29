// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, checkAuth, logout as apiLogout } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Проверяем токен при загрузке приложения
    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('token');
            const savedRole = localStorage.getItem('userRole');

            if (savedToken && savedRole) {
                // Восстанавливаем пользователя из localStorage
                setUser({
                    username: 'user', // можно будет получить из API позже
                    role: savedRole
                });
                setToken(savedToken);
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (username, password) => {
        try {
            console.log('Попытка входа для пользователя:', username);

            const response = await apiLogin(username, password);
            console.log('Ответ сервера:', response.data);
            console.log('User object:', response.data.user);
            console.log('User roles:', response.data.user.roles);

            // Извлекаем роль из массива ролей или прямо из поля role
            let userRole;
            if (response.data.user.roles && response.data.user.roles.length > 0) {
                userRole = response.data.user.roles[0]; // берем первую роль из массива
            } else if (response.data.user.role) {
                userRole = response.data.user.role; // или прямо из поля role
            } else {
                console.error('Роль пользователя не найдена в ответе сервера');
                userRole = 'UNKNOWN';
            }

            console.log('Извлеченная роль:', userRole);

            // Сохраняем токен в localStorage (как было раньше)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', userRole);

            // Создаем объект пользователя с правильной структурой
            const userData = {
                ...response.data.user,
                role: userRole // добавляем поле role для совместимости
            };

            // Обновляем состояние
            setToken(response.data.token);
            setUser(userData);

            return { success: true, user: userData };
        } catch (err) {
            console.error('Ошибка авторизации:', err);

            let errorMessage = 'Ошибка авторизации';

            if (err.response) {
                // Сервер ответил, но с ошибкой (например, 401 или 404)
                if (err.response.status === 401) {
                    errorMessage = 'Неверный логин или пароль';
                } else if (err.response.status === 404) {
                    errorMessage = 'Пользователь не найден';
                } else {
                    errorMessage = `Ошибка: ${err.response.data?.message || 'Что-то пошло не так на сервере'}`;
                }
            } else if (err.request) {
                // Запрос был отправлен, но нет ответа (например, нет интернета или сервер не работает)
                errorMessage = 'Нет связи с сервером. Проверьте подключение к интернету.';
            } else {
                // Что-то ещё пошло не так при настройке запроса
                errorMessage = 'Произошла ошибка при попытке входа. Попробуйте ещё раз.';
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const logout = () => {
        // Очищаем localStorage (как было раньше)
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');

        // Очищаем состояние
        setToken(null);
        setUser(null);

        // Вызываем API logout если нужно
        apiLogout();
    };

    const isAuthenticated = () => {
        return !!token && !!user;
    };

    const hasRole = (allowedRoles) => {
        if (!user || !allowedRoles.length) return true;
        return allowedRoles.includes(user.role);
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};