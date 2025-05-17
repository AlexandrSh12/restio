import { useState } from 'react';
import { menu } from '../data/menu';
import DishCard from '../components/menu/DishCard';

export default function MenuPage() {
    const [order, setOrder] = useState({});

    const handleAdd = (dish, count) => {
        setOrder(prev => {
            const updated = { ...prev };
            if (count === 0) {
                delete updated[dish.id];
            } else {
                updated[dish.id] = { ...dish, count };
            }
            return updated;
        });
    };

    const total = Object.values(order).reduce((sum, item) => sum + item.count * item.price, 0);

    return (
        <div>
            <div className="container">
                <h2>Меню</h2>
                <div className="grid">
                    {menu.map(dish => (
                        <DishCard key={dish.id} dish={dish} onAdd={handleAdd} />
                    ))}
                </div>
            </div>

            <div className="order-bar">
                <div>
                    <div style={{ fontSize: '12px', color: '#999' }}>45–55 мин</div>
                    <div style={{ fontWeight: 'bold' }}>Заказ</div>
                </div>
                <button>Далее {total}₽</button>
            </div>
        </div>
    );
}
