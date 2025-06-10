// src/pages/MenuPage.jsx (исправленная версия)
import { useRef, useState, useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import DishCard from '../components/menu/DishCard';
import OrderBar from '../components/menu/OrderBar';
import MenuHeader from '../components/menu/MenuHeader';
import CategoryNav from '../components/menu/CategoryNav';
import OrdersPage from './OrdersPage';
import { fetchDishes } from '../api/dishes';
import { useLocalStorage } from "../hooks/useLocalStorage.js";

export default function MenuPage() {
    const [order, setOrder] = useLocalStorage("restioOrder", { items: {}, status: "draft" });
    const { draft, handleAdd } = useOrder();
    const refs = useRef({});
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Новые состояния для улучшенного UI
    const [activeTab, setActiveTab] = useState('create'); // 'create' или 'orders'
    const [activeCategory, setActiveCategory] = useState('');
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);
    const [bannersVisible, setBannersVisible] = useState(true);
    const [isScrollingProgrammatically, setIsScrollingProgrammatically] = useState(false);

    const containerRef = useRef(null);
    const headerRef = useRef(null);

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

    // Устанавливаем первую категорию как активную при загрузке
    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0]);
        }
    }, [categories, activeCategory]);

    // Обработка скролла для sticky header и определения активной категории
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || isScrollingProgrammatically) return;

            const scrollTop = containerRef.current.scrollTop;
            const headerHeight = headerRef.current?.offsetHeight || 0;

            // Показываем/скрываем баннеры при скролле
            setBannersVisible(scrollTop < 50);

            // Делаем header sticky после определенного скролла
            setIsHeaderSticky(scrollTop > 100);

            // Определяем активную категорию по скроллу
            let currentCategory = '';
            const threshold = headerHeight + 100;

            for (const category of categories) {
                const element = refs.current[category];
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const containerRect = containerRef.current.getBoundingClientRect();

                    if (rect.top - containerRect.top <= threshold) {
                        currentCategory = category;
                    }
                }
            }

            if (currentCategory && currentCategory !== activeCategory) {
                setActiveCategory(currentCategory);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [categories, activeCategory, isScrollingProgrammatically]);

    const scrollToCategory = (category) => {
        console.log('Клик по категории:', category);

        const element = refs.current[category];
        const container = containerRef.current;

        console.log('Element найден:', !!element);
        console.log('Container найден:', !!container);

        if (element && container) {
            // Устанавливаем флаг программного скролла
            setIsScrollingProgrammatically(true);

            // Сразу обновляем активную категорию
            setActiveCategory(category);

            // Получаем позицию элемента относительно скроллируемого контейнера
            const elementOffsetTop = element.offsetTop;

            console.log('Позиция элемента:', elementOffsetTop);

            // Скроллим так, чтобы категория была в самом верху контента
            container.scrollTo({
                top: elementOffsetTop - (headerRef.current?.offsetHeight || 250),
                behavior: 'smooth'
            });

            // Сбрасываем флаг после завершения скролла
            setTimeout(() => {
                setIsScrollingProgrammatically(false);
            }, 800);
        } else {
            console.log('Не удалось найти элемент или контейнер для скролла');
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Отображаем загрузку или ошибку
    if (loading) {
        return <div className="menu-container">Загрузка меню...</div>;
    }

    if (error) {
        return <div className="menu-container">{error}</div>;
    }

    return (
        <div className="menu-container">
            {/* Заголовок с навигацией - фиксированный */}
            <div
                ref={headerRef}
                className={`menu-header-wrapper ${isHeaderSticky ? 'sticky' : ''}`}
            >
                <MenuHeader
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    bannersVisible={bannersVisible}
                />

                {/* Навигация по категориям - показываем только при создании заказа */}
                {activeTab === 'create' && (
                    <CategoryNav
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryClick={scrollToCategory}
                        isSticky={isHeaderSticky}
                    />
                )}
            </div>

            {/* Скроллируемый контент */}
            <div className="menu-scrollable-content" ref={containerRef}>
                {/* Контент в зависимости от активной вкладки */}
                {activeTab === 'create' ? (
                    <div className="menu-content">
                        {/* Список блюд по категориям */}
                        {categories.map(category => (
                            <div
                                key={category}
                                ref={el => (refs.current[category] = el)}
                                className="category-section"
                            >
                                <h3 className="category-title">{category}</h3>
                                <div className="dishes-grid">
                                    {menu
                                        .filter(dish => dish.category === category)
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
                ) : (
                    <div className="orders-content">
                        <OrdersPage />
                    </div>
                )}
            </div>

            {/* Панель заказа - показываем только при создании заказа */}
            {activeTab === 'create' && <OrderBar />}
        </div>
    );
}