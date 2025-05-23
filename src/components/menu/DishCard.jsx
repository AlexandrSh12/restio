import { useState, useEffect } from 'react';
import { useOrder } from '../../context/OrderContext.jsx';

export default function DishCard({ dish }) {
    const { draft, handleAdd } = useOrder();
    const [count, setCount] = useState(draft.items[dish.id]?.count || 0);

    // Синхронизация count с контекстом при изменении draft
    useEffect(() => {
        setCount(draft.items[dish.id]?.count || 0);
    }, [draft.items, dish.id]);

    const increment = () => {
        const newCount = count + 1;
        setCount(newCount);
        handleAdd(dish, newCount);
    };

    const decrement = () => {
        const newCount = Math.max(count - 1, 0);
        setCount(newCount);
        handleAdd(dish, newCount);
    };

    return (
        <div className="dish-card">
            <img src={dish.image} alt={dish.name} />
            <div className="dish-info">
                <div className="dish-name">{dish.name}</div>
                <div className="dish-meta">{dish.weight} · {dish.kcal} ккал</div>
                <div className="dish-price">
                    {dish.price}₽
                    {dish.oldPrice && <span className="dish-old-price">{dish.oldPrice}₽</span>}
                </div>
            </div>
            <div className="counter">
                {count === 0 ? (
                    <button onClick={increment}>Добавить</button>
                ) : (
                    <div>
                        <button onClick={decrement}>–</button>
                        <span>{count}</span>
                        <button onClick={increment}>+</button>
                    </div>
                )}
            </div>
        </div>
    );
}