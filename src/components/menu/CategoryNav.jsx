// src/components/menu/CategoryNav.jsx
import { useEffect, useRef, useState } from 'react';
import '../../styles/components/categorynav.css';

export default function CategoryNav({
                                        categories,
                                        activeCategory,
                                        onCategoryClick,
                                        isSticky = false
                                    }) {
    const navRef = useRef(null);
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

    // Синхронизируем активную категорию с индексом
    useEffect(() => {
        const index = categories.findIndex(cat => {
            // Поддерживаем как объекты, так и строки
            const catName = typeof cat === 'object' ? cat.name : cat;
            const activeName = typeof activeCategory === 'object' ? activeCategory.name : activeCategory;
            return catName === activeName;
        });

        if (index !== -1) {
            setActiveCategoryIndex(index);
            scrollToActiveCategory(index);
        }
    }, [activeCategory, categories]);

    // Автоматически скроллим к активной категории
    const scrollToActiveCategory = (index) => {
        if (!navRef.current) return;

        const nav = navRef.current;
        const buttons = nav.querySelectorAll('.category-btn');
        const activeButton = buttons[index];

        if (activeButton) {
            const navRect = nav.getBoundingClientRect();
            const buttonRect = activeButton.getBoundingClientRect();

            // Вычисляем позицию для центрирования кнопки
            const scrollLeft = activeButton.offsetLeft - (navRect.width / 2) + (buttonRect.width / 2);

            nav.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const handleCategoryClick = (category, index) => {
        console.log('CategoryNav: клик по категории', category);
        setActiveCategoryIndex(index);

        // Вызываем родительский обработчик
        if (onCategoryClick) {
            onCategoryClick(category);
        } else {
            console.log('CategoryNav: onCategoryClick не передан!');
        }
    };

    return (
        <div className={`category-nav ${isSticky ? 'sticky' : ''}`}>
            <div
                ref={navRef}
                className="category-nav-scroll"
            >
                {categories.map((category, index) => {
                    // Поддерживаем как объекты, так и строки
                    const categoryName = typeof category === 'object' ? category.name : category;
                    const categoryKey = typeof category === 'object' ? category.id : category;

                    return (
                        <button
                            key={categoryKey}
                            className={`category-btn ${index === activeCategoryIndex ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category, index)}
                        >
                            {categoryName}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}