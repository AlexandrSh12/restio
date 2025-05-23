import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { createOrder } from '../api/orders';
import { useNavigate } from 'react-router-dom';

export default function ConfirmOrderPage() {
    const { draft, clearOrder, total } = useOrder();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await createOrder({
                clientId: draft.id,
                items: Object.values(draft.items)
            });
            clearOrder();
            navigate('/success', { state: { orderNumber: res.data.orderNumber } });
        } catch (err) {
            console.error(err);
            alert('Ошибка отправки заказа');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Очистить текущий заказ?')) {
            clearOrder();
            navigate('/');
        }
    };

    const items = Object.values(draft.items);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Подтвердите заказ</h2>
            {items.length === 0 ? (
                <p>Нет блюд в заказе.</p>
            ) : (
                <ul style={{ marginBottom: '20px' }}>
                    {items.map(item => (
                        <li key={item.id}>
                            {item.name} × {item.count} = {item.price * item.count}₽
                        </li>
                    ))}
                    <li style={{ fontWeight: 'bold', marginTop: '10px' }}>
                        Итого: {total}₽
                    </li>
                </ul>
            )}
            <button
                onClick={handleSubmit}
                disabled={loading || items.length === 0}
                style={{ marginRight: '10px' }}
            >
                {loading ? 'Отправка...' : 'Отправить на кухню'}
            </button>
            <button onClick={handleCancel} disabled={loading}>
                Очистить заказ
            </button>
        </div>
    );
}