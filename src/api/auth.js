// src/api/auth.js
import axiosClient from './axiosClient';

// Функция для авторизации пользователя
export const login = (username, password) => {
    return axiosClient.post('/auth/login', { username, password });
};

// Функция для проверки токена
export const checkAuth = () => {
    return axiosClient.get('/auth/me');
};

// Функция для выхода из системы (только очистка, localStorage теперь в контексте)
export const logout = () => {
    // Здесь можно добавить вызов API для логаута на сервере
    // return axiosClient.post('/auth/logout');
    console.log('Logout called');
};

// DEPRECATED: Эти функции больше не нужны, используйте useAuth()
export const isAuthenticated = () => {
    console.warn('isAuthenticated is deprecated, use useAuth() instead');
    return !!localStorage.getItem('token');
};

export const getUserRole = () => {
    console.warn('getUserRole is deprecated, use useAuth() instead');
    return localStorage.getItem('userRole');
};