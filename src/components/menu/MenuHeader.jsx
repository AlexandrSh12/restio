// src/components/menu/MenuHeader.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MenuHeader({ activeTab, onTabChange, bannersVisible = true }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        // TODO: Implement search functionality
        console.log('Searching for:', searchQuery);
    };

    const handleProfileClick = () => {
        // TODO: Open profile menu
        console.log('Profile clicked');
    };

    const handleBurgerMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        // TODO: Implement burger menu
        console.log('Burger menu clicked');
    };

    return (
        <div className="menu-header">
            {/* Верхняя строка с основными кнопками */}
            <div className="header-top">
                <button
                    className="burger-btn"
                    onClick={handleBurgerMenu}
                    aria-label="Меню"
                >
                    <div className="burger-lines">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>

                <div className="header-actions">
                    <button
                        className={`search-btn ${isSearchOpen ? 'active' : ''}`}
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        aria-label="Поиск"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                    </button>

                    <button
                        className="profile-btn"
                        onClick={handleProfileClick}
                        aria-label="Профиль"
                    >
                        <div className="profile-avatar">
                            <span>А</span> {/* Первая буква имени пользователя */}
                        </div>
                    </button>
                </div>
            </div>

            {/* Строка поиска (показывается при активации) */}
            {isSearchOpen && (
                <div className="search-row">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Поиск блюд..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <button type="submit">Найти</button>
                    </form>
                </div>
            )}

            {/* Переключатель между Создать заказ / Заказы */}
            <div className="tab-switcher">
                <button
                    className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => onTabChange('create')}
                >
                    Создать заказ
                </button>
                <button
                    className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => onTabChange('orders')}
                >
                    Заказы
                </button>
            </div>

            {/* Дополнительные баннеры для официанта (будут скрываться при скролле) */}
            {bannersVisible && (
                <div className="waiter-banners">
                    <div className="banner-item">
                        <span>💡</span>
                        <span>Новые блюда в меню!</span>
                    </div>
                    <div className="banner-item">
                        <span>⏰</span>
                        <span>Время приготовления обновлено</span>
                    </div>
                </div>
            )}
        </div>
    );
}