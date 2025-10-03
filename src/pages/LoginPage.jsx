// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();

    // Если уже авторизован, перенаправляем
    useEffect(() => {
        if (isAuthenticated() && user && user.role && user.role !== 'UNKNOWN') {
            const redirectPath = getRoleBasedPath(user.role);
            console.log('Пользователь уже авторизован, перенаправляем на:', redirectPath);
            navigate(redirectPath, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const getRoleBasedPath = (role) => {
        console.log('Определяем путь для роли:', role); // для отладки
        switch (role) {
            case 'WAITER':
                return '/menu';
            case 'COOK':
            case 'CHEF':
                return '/chef';
            case 'ADMIN':
                return '/menu'; // Изменено: админ тоже идет на меню
            default:
                return '/menu';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Мок-режим: admin/admin
        if (import.meta.env.VITE_API_URL.includes('localhost:3000')) {
            if (username === 'admin' && password === 'admin') {
                const mockUser = { username: 'admin', role: 'ADMIN' };
                localStorage.setItem('token', 'mock-token');
                localStorage.setItem('userRole', 'ADMIN');
                setToken('mock-token');
                setUser(mockUser);
                return { success: true, user: mockUser };
            } else {
                return { success: false, error: 'Для мок-режима используйте admin/admin' };
            }
        }

        if (!username || !password) {
            setError('Пожалуйста, введите логин и пароль');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const result = await login(username, password);

            if (result.success) {
                // Перенаправление будет обработано в useEffect
                const redirectPath = getRoleBasedPath(result.user.role);
                navigate(redirectPath, { replace: true });
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error('Unexpected login error:', err);
            setError('Произошла неожиданная ошибка');
        } finally {
            setLoading(false);
        }
    };

    // Не показываем форму если уже авторизованы
    if (isAuthenticated()) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Перенаправление...</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '50px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Вход в систему</h2>

            {error && (
                <div style={{
                    padding: '10px',
                    background: '#ffebee',
                    color: '#c62828',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Имя пользователя</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            opacity: loading ? 0.6 : 1
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            opacity: loading ? 0.6 : 1
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: loading ? '#cccccc' : '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {loading ? 'Вход...' : 'Войти'}
                </button>
            </form>
        </div>
    );
}