// src/components/common/AppHeader.jsx
import { useState } from 'react';

export default function AppHeader({ showSearch = true }) { // ← Проп для управления поиском
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const handleProfileClick = () => {
        console.log('Profile clicked');
    };

    const handleBurgerMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        console.log('Burger menu clicked');
    };

    return (
        <div className="app-header">
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
                    {/* Кнопка поиска показывается только если showSearch=true */}
                    {showSearch && (
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
                    )}

                    <button
                        className="profile-btn"
                        onClick={handleProfileClick}
                        aria-label="Профиль"
                    >
                        <div className="profile-avatar">
                            <span>А</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Строка поиска показывается только если showSearch=true и isSearchOpen=true */}
            {showSearch && isSearchOpen && (
                <div className="search-row">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <button type="submit">Найти</button>
                    </form>
                </div>
            )}
        </div>
    );
}