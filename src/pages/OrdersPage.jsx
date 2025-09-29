// src/pages/OrdersPage.jsx
import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../api/orders';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingOrder, setUpdatingOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await getAllOrders();
            setOrders(response.data);
            setError(null);
        } catch (err) {
            setError('Ошибка загрузки заказов');
            console.error('Ошибка при загрузке заказов:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            setUpdatingOrder(orderId);
            await updateOrderStatus(orderId, 'completed');
            // Обновляем локальное состояние
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, status: 'completed' }
                        : order
                )
            );
        } catch (err) {
            console.error('Ошибка при обновлении статуса заказа:', err);
            // Можно показать уведомление об ошибке
        } finally {
            setUpdatingOrder(null);
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'draft': 'Черновик',
            'submitted': 'Ожидает принятия',
            'preparing': 'Готовится',
            'ready': 'Готов',
            'completed': 'Завершен',
            'cancelled': 'Отменен'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        return `order-status order-status-${status}`;
    };

    const calculateOrderTotal = (items) => {
        return items.reduce((total, item) => total + (item.price * item.count), 0);
    };

    if (loading) {
        return <div className="orders-container">Загрузка заказов...</div>;
    }

    if (error) {
        return (
            <div className="orders-container">
                <div className="error-message">{error}</div>
                <button onClick={loadOrders} className="btn-primary">
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <h2>Заказы</h2>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <p>Заказов пока нет</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-number">
                                    Заказ #{order.orderNumber}
                                </div>
                                <div className={getStatusClass(order.status)}>
                                    {getStatusText(order.status)}
                                </div>
                            </div>

                            <div className="order-meta">
                                <span className="order-total">
                                    {calculateOrderTotal(order.items)}₽
                                </span>
                                {order.comment && (
                                    <span className="order-comment">
                                        Комментарий: {order.comment}
                                    </span>
                                )}
                            </div>

                            <div className="order-items">
                                {order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span className="item-name">
                                            {item.dishName}
                                        </span>
                                        <span className="item-quantity">
                                            x{item.count}
                                        </span>
                                        <span className="item-price">
                                            {item.price * item.count}₽
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-actions">
                                <button
                                    className="btn-secondary"
                                    onClick={() => console.log('View order details', order.id)}
                                >
                                    Подробнее
                                </button>
                                {order.status === 'ready' && (
                                    <button
                                        className="btn-primary"
                                        onClick={() => handleCompleteOrder(order.id)}
                                        disabled={updatingOrder === order.id}
                                    >
                                        {updatingOrder === order.id ? 'Обновление...' : 'Выдать'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}