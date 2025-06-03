// src/components/chef/DishQueueCard.jsx
export default function DishQueueCard({ item, timeSinceOrder, onTake }) {
    // Определяем цвет времени в зависимости от давности заказа
    const getTimeColor = (timeStr) => {
        if (timeStr === '0') return 'time-fresh';

        const minutes = parseInt(timeStr.replace('+', ''));
        if (minutes <= 5) return 'time-normal';
        if (minutes <= 15) return 'time-warning';
        return 'time-urgent';
    };

    // Определяем приоритет заказа
    const getPriorityLevel = (timeStr) => {
        if (timeStr === '0') return '';

        const minutes = parseInt(timeStr.replace('+', ''));
        if (minutes > 15) return 'high-priority';
        if (minutes > 10) return 'medium-priority';
        return '';
    };

    return (
        <div className={`dish-queue-card ${getPriorityLevel(timeSinceOrder)}`}>
            {/* Заголовок карточки */}
            <div className="card-header">
                <div className="dish-info">
                    <h3 className="dish-name">{item.dishName}</h3>
                    <div className="order-info">
                        <span className="order-number">Заказ #{item.orderId}</span>
                        <span className="table-number">Стол {item.tableNumber}</span>
                    </div>
                </div>

                <div className="time-badge">
                    <span className={`time-text ${getTimeColor(timeSinceOrder)}`}>
                        {timeSinceOrder === '0' ? 'Новый' : `${timeSinceOrder}м`}
                    </span>
                </div>
            </div>

            {/* Количество */}
            <div className="card-content">
                <div className="quantity-info">
                    <span className="quantity-label">Количество:</span>
                    <span className="quantity-value">{item.quantity} шт.</span>
                </div>

                {/* Дополнительная информация если есть */}
                {item.notes && (
                    <div className="dish-notes">
                        <span className="notes-label">Примечания:</span>
                        <span className="notes-text">{item.notes}</span>
                    </div>
                )}

                {/* Приоритет заказа */}
                {item.priority && item.priority !== 'normal' && (
                    <div className={`priority-indicator priority-${item.priority}`}>
                        {item.priority === 'high' ? 'Высокий приоритет' : 'Срочно'}
                    </div>
                )}
            </div>

            {/* Действия */}
            <div className="card-actions">
                <button
                    className="take-button"
                    onClick={onTake}
                >
                    Взять в работу
                </button>
            </div>
        </div>
    );
}