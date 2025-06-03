// src/components/chef/DishInProgressCard.jsx
export default function DishInProgressCard({
                                               item,
                                               timeSinceOrder,
                                               timeSinceStarted,
                                               onCancel,
                                               onComplete
                                           }) {
    // Определяем цвет времени в зависимости от давности заказа
    const getTimeColor = (timeStr) => {
        if (timeStr === '0') return 'time-fresh';

        const minutes = parseInt(timeStr.replace('+', ''));
        if (minutes <= 5) return 'time-normal';
        if (minutes <= 15) return 'time-warning';
        return 'time-urgent';
    };

    // Определяем цвет времени работы
    const getWorkTimeColor = (timeStr) => {
        if (timeStr === '0') return 'work-time-fresh';

        const minutes = parseInt(timeStr.replace('+', ''));
        if (minutes <= 10) return 'work-time-normal';
        if (minutes <= 20) return 'work-time-warning';
        return 'work-time-long';
    };

    return (
        <div className="dish-inprogress-card">
            {/* Заголовок карточки */}
            <div className="card-header">
                <div className="dish-info">
                    <h3 className="dish-name">{item.dishName}</h3>
                    <div className="order-info">
                        <span className="order-number">Заказ #{item.orderId}</span>
                        <span className="table-number">Стол {item.tableNumber}</span>
                    </div>
                </div>

                <div className="time-badges">
                    <div className="time-badge order-time">
                        <span className="time-label">Заказ:</span>
                        <span className={`time-text ${getTimeColor(timeSinceOrder)}`}>
                            {timeSinceOrder === '0' ? '0м' : `${timeSinceOrder}м`}
                        </span>
                    </div>
                    <div className="time-badge work-time">
                        <span className="time-label">В работе:</span>
                        <span className={`time-text ${getWorkTimeColor(timeSinceStarted)}`}>
                            {timeSinceStarted === '0' ? '0м' : `${timeSinceStarted}м`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Количество и статус */}
            <div className="card-content">
                <div className="quantity-info">
                    <span className="quantity-label">Количество:</span>
                    <span className="quantity-value">{item.quantity} шт.</span>
                </div>

                <div className="work-status">
                    <div className="status-indicator working">
                        <span className="status-dot"></span>
                        <span className="status-text">В процессе приготовления</span>
                    </div>
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
                    className="cancel-button"
                    onClick={onCancel}
                >
                    Отменить
                </button>
                <button
                    className="complete-button"
                    onClick={onComplete}
                >
                    Готово
                </button>
            </div>
        </div>
    );
}