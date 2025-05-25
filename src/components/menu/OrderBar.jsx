// src/components/menu/OrderBar.jsx
import { useNavigate } from 'react-router-dom';
import { useOrder } from "../../context/OrderContext.jsx";
import { useState } from "react";
import { FiRotateCcw } from "react-icons/fi"; // импорт иконки



export default function OrderBar() {
    const navigate = useNavigate();
    const { draft, setDraft } = useOrder(); // setDraft нужен для сброса
    const [showConfirm, setShowConfirm] = useState(false);

    // Получаем массив блюд из контекста
    const items = Object.values(draft?.items || {});

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

    // Рассчитываем общую сумму заказа
    const total = items.reduce(
        (sum, item) => sum + item.count * item.price,
        0
    );
    const handleReset = () => {
        localStorage.removeItem("order"); // Удаляем из localStorage
        setDraft({ items: {} }); // Обнуляем в контексте
        setShowConfirm(false); // Закрываем окно
    };

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
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                    onClick={() => setShowConfirm(true)}
                    title="Сбросить заказ"

                >
                    <FiRotateCcw />
                </button>

                <button onClick={() => navigate('/confirm')}>
                    Далее {total}₽
                </button>
            </div>
            {showConfirm && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <p>Вы уверены, что хотите сбросить заказ?</p>
                        <div className="modal-buttons">
                            <button onClick={() => setShowConfirm(false)}>Отмена</button>
                            <button onClick={handleReset}>Сбросить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}