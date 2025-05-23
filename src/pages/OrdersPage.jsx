// src/pages/OrdersPage.jsx
import { useState, useEffect } from 'react';
import { getOrderStatus } from '../api/orders';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            // TODO: Implement API call to get all orders for current waiter
            // For now, we'll use mock data
            const mockOrders = [
                {
                    id: 1,
                    number: '001',
                    status: 'preparing',
                    createdAt: new Date().toISOString(),
                    total: 1250,
                    items: [
                        { name: 'Бургер', count: 2, price: 450 },
                        { name: 'Картофель фри', count: 1, price: 350 }
                    ]
                },
                {
                    id: 2,
                    number: '002',
                    status: 'ready',
                    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
                    total: 890,
                    items: [
                        { name: 'Пицца Маргарита', count: 1, price: 890 }
                    ]
                }
            ];
            setOrders(mockOrders);
            setError(null);
        } catch (err) {
            setError('Ошибка загрузки заказов');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'draft': 'Черновик',
            'pending': 'Ожидает',
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

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="orders-container">Загрузка заказов...</div>;
    }

    if (error) {
        return <div className="orders-container">{error}</div>;
    }

    return (
        <div className="orders-container">
            <h2>Мои заказы</h2>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <p>У вас пока нет заказов</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-number">
                                    Заказ #{order.number}
                                </div>
                                <div className={getStatusClass(order.status)}>
                                    {getStatusText(order.status)}
                                </div>
                            </div>

                            <div className="order-meta">
                                <span className="order-time">
                                    {formatTime(order.createdAt)}
                                </span>
                                <span className="order-total">
                                    {order.total}₽
                                </span>
                            </div>

                            <div className="order-items">
                                {order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span className="item-name">
                                            {item.name}
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
                                        onClick={() => console.log('Complete order', order.id)}
                                    >
                                        Выдать
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