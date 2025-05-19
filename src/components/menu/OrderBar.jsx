// src/components/menu/OrderBar.jsx
import { useNavigate } from 'react-router-dom';
import {useOrder} from "../../context/OrderContext.jsx";

export default function OrderBar({ order }) {
    const navigate = useNavigate();
    const items = Object.values(order); // [{ id, name, price, count, cookTime }, ...]

    // === DEBUG LOGS ===
    console.log('Order items raw:', items);

    // Парсим cookTime в числа, убираем NaN и дубликаты
    const cookTimes = Array.from(
        new Set(
            items
                .map(item => {
                    const t = parseInt(item.cookTime, 10);
                    return Number.isFinite(t) ? t : null;
                })
                .filter(t => t !== null)
        )
    );

    console.log('Parsed cookTimes (unique):', cookTimes);

    // Если нет блюд или нет валидных cookTime — ничего не показываем
    if (items.length === 0 || cookTimes.length === 0) return null;

    const minTime = Math.min(...cookTimes);
    const maxTime = Math.max(...cookTimes);
    const { draft, clearOrder } = useOrder();

    const total = Object.values(draft?.items || {}).reduce(
        (sum, item) => sum + item.count * item.price,
        0
    );



    return (
        <div className="order-bar">
            <div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                    {minTime === maxTime
                        ? `${minTime} мин`
                        : `${minTime}–${maxTime} мин`}
                </div>
                <div style={{ fontWeight: 'bold' }}>Заказ</div>
            </div>
            <button onClick={() => navigate('/confirm', { state: { order } })}>
                Далее {total}₽
            </button>
        </div>
    );
}
