// src/components/menu/MenuHeader.jsx
import AppHeader from '../common/AppHeader';

export default function MenuHeader({ activeTab, onTabChange, bannersVisible = true }) {
    return (
        <div className="menu-header">
            {/* Переиспользуем AppHeader */}
            <AppHeader showSearch={true} /> {/* ← Поиск виден */}

            {/* Специфичные для меню элементы */}
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