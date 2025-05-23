import { useRef, useState, useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import DishCard from '../components/menu/DishCard';
import OrderBar from '../components/menu/OrderBar';
// Импортируем функцию для получения блюд
import { fetchDishes } from '../api/dishes';
import {useLocalStorage} from "../hooks/useLocalStorage.js";

export default function MenuPage() {
    const [order, setOrder] = useLocalStorage("restioOrder", { items: {}, status: "draft" });
    const { draft, handleAdd } = useOrder();
    const refs = useRef({});
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // Загрузка данных с сервера
    useEffect(() => {
        const loadDishes = async () => {
            try {
                setLoading(true);
                const response = await fetchDishes();
                setMenu(response.data);
                setError(null);
            } catch (err) {
                console.error('Ошибка при загрузке блюд:', err);
                setError('Не удалось загрузить меню. Пожалуйста, попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };

        loadDishes();
    }, []);

    // Получаем уникальные категории из загруженных блюд
    const categories = [...new Set(menu.map(d => d.category))];

    const scrollToCategory = category => {
        const el = refs.current[category];
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // Отображаем загрузку или ошибку
    if (loading) {
        return <div className="container">Загрузка меню...</div>;
    }

    if (error) {
        return <div className="container">{error}</div>;
    }

    return (
        <div>
            {/* Категории */}
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '12px 16px', background: '#fff' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => scrollToCategory(cat)}
                        style={{
                            marginRight: '12px',
                            padding: '6px 12px',
                            background: '#eee',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Список блюд по категориям */}
            <div className="container">
                {categories.map(cat => (
                    <div key={cat} ref={el => (refs.current[cat] = el)} style={{ marginBottom: '24px' }}>
                        <h3 style={{ marginBottom: '12px' }}>{cat}</h3>
                        <div className="grid">
                            {menu
                                .filter(d => d.category === cat)
                                .map(dish => (
                                    <DishCard
                                        key={dish.id}
                                        dish={dish}
                                        count={draft.items[dish.id]?.count || 0}
                                        onAdd={handleAdd}
                                    />
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            <OrderBar />
        </div>
    );
}