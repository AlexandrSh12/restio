// src/components/chef/ChefHeader.jsx
import { useState, useEffect } from 'react';

export default function ChefHeader({
                                       activeTab,
                                       onTabChange,
                                       queueCount,
                                       inProgressCount,
                                       lastUpdate
                                   }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Обновляем время каждую секунду
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Форматируем время последнего обновления
    const formatLastUpdate = (timestamp) => {
        const now = Date.now();
        const diff = Math.floor((now - timestamp) / 1000);

        if (diff < 60) return `${diff}с назад`;
        if (diff < 3600) return `${Math.floor(diff / 60)}м назад`;
        return new Date(timestamp).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="chef-header">
            {/* Верхняя строка с информацией */}
            <div className="chef-info-bar">
                <div className="time-info">
                    <span className="current-time">
                        {currentTime.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
                <div className="update-info">
                    <span className="last-update">
                        Обновлено: {formatLastUpdate(lastUpdate)}
                    </span>
                </div>
            </div>

            {/* Заголовок */}
            <div className="chef-title">
                <h1>Кухня</h1>
                <div className="chef-summary">
                    <span className="total-dishes">
                        Всего блюд: {queueCount + inProgressCount}
                    </span>
                </div>
            </div>

            {/* Вкладки навигации */}
            <div className="chef-tabs">
                <button
                    className={`tab-button ${activeTab === 'queue' ? 'active' : ''}`}
                    onClick={() => onTabChange('queue')}
                >
                    <span className="tab-text">Очередь</span>
                    {queueCount > 0 && (
                        <span className="tab-badge queue-badge">{queueCount}</span>
                    )}
                </button>

                <button
                    className={`tab-button ${activeTab === 'inprogress' ? 'active' : ''}`}
                    onClick={() => onTabChange('inprogress')}
                >
                    <span className="tab-text">В работе</span>
                    {inProgressCount > 0 && (
                        <span className="tab-badge progress-badge">{inProgressCount}</span>
                    )}
                </button>
            </div>
        </div>
    );
}