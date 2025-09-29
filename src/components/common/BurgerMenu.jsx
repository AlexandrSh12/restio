// src/components/common/BurgerMenu.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/burgermenu.css';

export default function BurgerMenu({ isOpen, onClose, userRole }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Конфигурация меню для каждой роли
    const menuConfig = {
        WAITER: [
            { label: 'Создать заказ', path: '/menu', icon: '📝' },
            { label: 'Заказы', path: '/orders', icon: '📋' },
            { label: 'Профиль', path: '/profile', icon: '👤' },
            { label: 'Выйти', action: 'logout', icon: '🚪' }
        ],
        CHEF: [
            { label: 'Кухня', path: '/chef', icon: '👨‍🍳' },
            { label: 'Заказы', path: '/orders', icon: '📋' },
            { label: 'Профиль', path: '/profile', icon: '👤' },
            { label: 'Выйти', action: 'logout', icon: '🚪' }
        ],
        COOK: [
            { label: 'Кухня', path: '/chef', icon: '👨‍🍳' },
            { label: 'Заказы', path: '/orders', icon: '📋' },
            { label: 'Профиль', path: '/profile', icon: '👤' },
            { label: 'Выйти', action: 'logout', icon: '🚪' }
        ],
        ADMIN: [
            { label: 'Создать заказ', path: '/menu', icon: '📝' },
            { label: 'Кухня', path: '/chef', icon: '👨‍🍳' },
            { label: 'Админ панель', path: '/admin', icon: '⚙️' },
            { label: 'Заказы', path: '/orders', icon: '📋' },
            { label: 'Профиль', path: '/profile', icon: '👤' },
            { label: 'Выйти', action: 'logout', icon: '🚪' }
        ]
    };

    const menuItems = menuConfig[userRole] || [];

    const handleItemClick = (item) => {
        if (item.action === 'logout') {
            handleLogout();
        } else if (item.path) {
            navigate(item.path);
            onClose();
        }
    };

    const handleLogout = () => {
        // Используем logout из AuthContext вместо прямого обращения к localStorage
        logout();
        // Перенаправляем на страницу входа
        navigate('/login');
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="burger-menu-overlay" onClick={handleOverlayClick}>
            <div className="burger-menu">
                <div className="burger-menu-header">
                    <h3>Меню</h3>
                    <button
                        className="burger-menu-close"
                        onClick={onClose}
                        aria-label="Закрыть меню"
                    >
                        ✕
                    </button>
                </div>

                <nav className="burger-menu-nav">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`burger-menu-item ${item.action === 'logout' ? 'logout' : ''}`}
                            onClick={() => handleItemClick(item)}
                        >
                            <span className="burger-menu-icon">{item.icon}</span>
                            <span className="burger-menu-label">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}