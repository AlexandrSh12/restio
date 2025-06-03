// src/pages/ChefPage.jsx
import { useState, useEffect, useRef } from 'react';
import ChefHeader from '../components/chef/ChefHeader';
import DishQueueCard from '../components/chef/DishQueueCard';
import DishInProgressCard from '../components/chef/DishInProgressCard';
import '../styles/pages/chef.css';
// import { fetchChefOrders, takeOrderItem, cancelOrderItem, completeOrderItem } from '../api/chef';

export default function ChefPage() {
    const [activeTab, setActiveTab] = useState('queue'); // 'queue' или 'inprogress'
    const [queueItems, setQueueItems] = useState([]);
    const [inProgressItems, setInProgressItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);

    // Моковые данные для тестирования
    const mockQueueItems = [
        {
            id: 1,
            orderId: 101,
            dishId: 1,
            dishName: "Пицца Маргарита",
            quantity: 2,
            tableNumber: 5,
            orderCreatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 минут назад
            notes: "Без базилика",
            priority: "normal"
        },
        {
            id: 2,
            orderId: 102,
            dishId: 2,
            dishName: "Паста Карбонара",
            quantity: 1,
            tableNumber: 3,
            orderCreatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 минут назад
            priority: "high"
        },
        {
            id: 3,
            orderId: 103,
            dishId: 3,
            dishName: "Салат Цезарь",
            quantity: 3,
            tableNumber: 7,
            orderCreatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 минуты назад
            priority: "normal"
        },
        {
            id: 4,
            orderId: 104,
            dishId: 4,
            dishName: "Стейк Рибай",
            quantity: 1,
            tableNumber: 2,
            orderCreatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 минут назад
            notes: "Средняя прожарка",
            priority: "high"
        }
    ];

    const mockInProgressItems = [
        {
            id: 5,
            orderId: 105,
            dishId: 5,
            dishName: "Пицца Пепперони",
            quantity: 1,
            tableNumber: 4,
            orderCreatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 минут назад
            startedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // взято в работу 5 минут назад
            priority: "normal"
        },
        {
            id: 6,
            orderId: 106,
            dishId: 6,
            dishName: "Суп Том Ям",
            quantity: 2,
            tableNumber: 6,
            orderCreatedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 минут назад
            startedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // взято в работу 8 минут назад
            notes: "Острый",
            priority: "normal"
        }
    ];

    // Загрузка данных заказов (с использованием моковых данных)
    const loadChefData = async () => {
        try {
            setLoading(true);
            // Имитируем задержку API
            await new Promise(resolve => setTimeout(resolve, 500));

            setQueueItems(mockQueueItems);
            setInProgressItems(mockInProgressItems);
            setError(null);
            setLastUpdate(Date.now());
        } catch (err) {
            console.error('Ошибка при загрузке заказов повара:', err);
            setError('Не удалось загрузить заказы. Пожалуйста, попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    // Первоначальная загрузка данных
    useEffect(() => {
        loadChefData();
    }, []);

    // Автообновление каждые 30 секунд
    useEffect(() => {
        const interval = setInterval(() => {
            loadChefData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Обработка скролла для sticky header
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const scrollTop = containerRef.current.scrollTop;
            setIsHeaderSticky(scrollTop > 50);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // Взять блюдо в работу
    const handleTakeItem = async (orderItemId) => {
        try {
            // Имитируем API вызов
            await new Promise(resolve => setTimeout(resolve, 300));

            // Находим блюдо в очереди
            const itemToTake = queueItems.find(item => item.id === orderItemId);
            if (itemToTake) {
                // Добавляем время начала работы
                const itemInProgress = {
                    ...itemToTake,
                    startedAt: new Date().toISOString()
                };

                // Обновляем состояния
                setQueueItems(prev => prev.filter(item => item.id !== orderItemId));
                setInProgressItems(prev => [...prev, itemInProgress]);
            }
        } catch (err) {
            console.error('Ошибка при взятии блюда в работу:', err);
            alert('Не удалось взять блюдо в работу');
        }
    };

    // Отменить блюдо (снять с себя)
    const handleCancelItem = async (orderItemId) => {
        try {
            // Имитируем API вызов
            await new Promise(resolve => setTimeout(resolve, 300));

            // Находим блюдо в работе
            const itemToCancel = inProgressItems.find(item => item.id === orderItemId);
            if (itemToCancel) {
                // Убираем время начала работы
                const { startedAt, ...itemBackToQueue } = itemToCancel;

                // Обновляем состояния
                setInProgressItems(prev => prev.filter(item => item.id !== orderItemId));
                setQueueItems(prev => [...prev, itemBackToQueue]);
            }
        } catch (err) {
            console.error('Ошибка при отмене блюда:', err);
            alert('Не удалось снять блюдо с работы');
        }
    };

    // Пометить блюдо как выполненное
    const handleCompleteItem = async (orderItemId) => {
        try {
            // Имитируем API вызов
            await new Promise(resolve => setTimeout(resolve, 300));

            // Просто удаляем блюдо из списка в работе
            setInProgressItems(prev => prev.filter(item => item.id !== orderItemId));

            // Можно добавить уведомление об успешном завершении
            alert('Блюдо помечено как готовое!');
        } catch (err) {
            console.error('Ошибка при завершении блюда:', err);
            alert('Не удалось завершить блюдо');
        }
    };

    // Функция для расчета времени с момента создания заказа
    const getTimeSinceOrder = (orderCreatedAt) => {
        const now = Date.now();
        const orderTime = new Date(orderCreatedAt).getTime();
        const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));

        if (diffMinutes === 0) return '0';
        return `+${diffMinutes}`;
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Отображаем загрузку или ошибку
    if (loading && queueItems.length === 0 && inProgressItems.length === 0) {
        return (
            <div className="chef-container">
                <div className="loading-message">Загрузка заказов...</div>
            </div>
        );
    }

    if (error && queueItems.length === 0 && inProgressItems.length === 0) {
        return (
            <div className="chef-container">
                <div className="error-message">{error}</div>
                <button onClick={loadChefData} className="retry-button">
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div className="chef-container" ref={containerRef}>
            {/* Заголовок с навигацией */}
            <div
                ref={headerRef}
                className={`chef-header-wrapper ${isHeaderSticky ? 'sticky' : ''}`}
            >
                <ChefHeader
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    queueCount={queueItems.length}
                    inProgressCount={inProgressItems.length}
                    lastUpdate={lastUpdate}
                />
            </div>

            {/* Контент в зависимости от активной вкладки */}
            <div className="chef-content">
                {activeTab === 'queue' ? (
                    <div className="queue-content">
                        <div className="content-header">
                            <h2>Очередь блюд</h2>
                            <span className="items-count">{queueItems.length} блюд</span>
                        </div>

                        {queueItems.length === 0 ? (
                            <div className="empty-state">
                                <p>Нет блюд в очереди</p>
                            </div>
                        ) : (
                            <div className="dishes-list">
                                {queueItems.map(item => (
                                    <DishQueueCard
                                        key={`${item.orderId}-${item.dishId}`}
                                        item={item}
                                        timeSinceOrder={getTimeSinceOrder(item.orderCreatedAt)}
                                        onTake={() => handleTakeItem(item.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="inprogress-content">
                        <div className="content-header">
                            <h2>В работе</h2>
                            <span className="items-count">{inProgressItems.length} блюд</span>
                        </div>

                        {inProgressItems.length === 0 ? (
                            <div className="empty-state">
                                <p>Нет блюд в работе</p>
                                <p className="empty-hint">Возьмите блюда из очереди</p>
                            </div>
                        ) : (
                            <div className="dishes-list">
                                {inProgressItems.map(item => (
                                    <DishInProgressCard
                                        key={`${item.orderId}-${item.dishId}`}
                                        item={item}
                                        timeSinceOrder={getTimeSinceOrder(item.orderCreatedAt)}
                                        timeSinceStarted={getTimeSinceOrder(item.startedAt)}
                                        onCancel={() => handleCancelItem(item.id)}
                                        onComplete={() => handleCompleteItem(item.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}