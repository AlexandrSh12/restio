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

// Функция для выхода из системы
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
};

// Проверяет, авторизован ли пользователь
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

// Получает роль текущего пользователя
export const getUserRole = () => {
    return localStorage.getItem('userRole');
};