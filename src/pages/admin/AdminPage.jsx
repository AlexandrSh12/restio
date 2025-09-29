// src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import AppHeader from '../../components/common/AppHeader.jsx';
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../../api/admin/categories.js';
import {
    fetchDishes,
    createDish,
    updateDish,
    deleteDish,
    uploadDishImage
} from '../../api/dishes.js';
import '../../styles/pages/admin.css';
import { useLocalStorage } from "../../hooks/useLocalStorage.js";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('categories');
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Формы
    const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
    const [dishForm, setDishForm] = useState({
        name: '',
        category: '',
        price: '',
        cookTime: '',
        description: '',
        imageUrl: ''
    });

    // Состояния редактирования
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingDish, setEditingDish] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [categoriesRes, dishesRes] = await Promise.all([
                fetchCategories(),
                fetchDishes()
            ]);
            // Предполагаем, что API возвращает данные напрямую, а не в поле data
            setCategories(Array.isArray(categoriesRes) ? categoriesRes : categoriesRes.data || []);
            setDishes(Array.isArray(dishesRes) ? dishesRes : dishesRes.data || []);
        } catch (err) {
            setError('Ошибка загрузки данных: ' + (err.message || 'Неизвестная ошибка'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Категории
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!categoryForm.name.trim()) {
            setError('Название категории обязательно');
            return;
        }

        try {
            setError(null);
            if (editingCategory) {
                await updateCategory(editingCategory.id, categoryForm);
                setEditingCategory(null);
            } else {
                await createCategory(categoryForm);
            }
            setCategoryForm({ name: '', description: '' });
            await loadData();
        } catch (err) {
            if (err.response?.status === 409) {
                setError('Категория с таким названием уже существует');
            } else if (err.response?.status === 403) {
                setError('Нет прав для выполнения операции');
            } else {
                setError('Ошибка сохранения категории: ' + (err.message || 'Неизвестная ошибка'));
            }
        }
    };

    const handleCategoryEdit = (category) => {
        setEditingCategory(category);
        setCategoryForm({ name: category.name, description: category.description || '' });
        setError(null);
    };

    const handleCategoryDelete = async (categoryId) => {
        if (!confirm('Удалить категорию? Это действие нельзя отменить.')) {
            return;
        }

        try {
            setError(null);
            await deleteCategory(categoryId);
            await loadData();
        } catch (err) {
            if (err.response?.status === 403) {
                setError('Нет прав для удаления категории');
            } else if (err.response?.status === 404) {
                setError('Категория не найдена');
            } else {
                setError('Ошибка удаления категории: ' + (err.message || 'Неизвестная ошибка'));
            }
        }
    };

    // Блюда
    const handleDishSubmit = async (e) => {
        e.preventDefault();

        // Валидация
        if (!dishForm.name.trim()) {
            setError('Название блюда обязательно');
            return;
        }
        if (!dishForm.category) {
            setError('Категория обязательна');
            return;
        }
        if (!dishForm.price || parseFloat(dishForm.price) <= 0) {
            setError('Цена должна быть больше 0');
            return;
        }
        if (!dishForm.cookTime || parseInt(dishForm.cookTime) <= 0) {
            setError('Время приготовления должно быть больше 0');
            return;
        }

        try {
            setError(null);
            const dishData = {
                name: dishForm.name.trim(),
                category: dishForm.category,
                price: parseFloat(dishForm.price),
                cookTime: parseInt(dishForm.cookTime),
                description: dishForm.description.trim(),
                imageUrl: dishForm.imageUrl.trim()
            };

            if (editingDish) {
                await updateDish(editingDish.id, dishData);
                setEditingDish(null);
            } else {
                await createDish(dishData);
            }

            setDishForm({
                name: '',
                category: '',
                price: '',
                cookTime: '',
                description: '',
                imageUrl: ''
            });
            await loadData();
        } catch (err) {
            if (err.response?.status === 403) {
                setError('Нет прав для выполнения операции');
            } else if (err.response?.status === 400) {
                setError('Некорректные данные блюда');
            } else {
                setError('Ошибка сохранения блюда: ' + (err.message || 'Неизвестная ошибка'));
            }
        }
    };

    const handleDishEdit = (dish) => {
        setEditingDish(dish);
        setDishForm({
            name: dish.name,
            category: dish.category,
            price: dish.price.toString(),
            cookTime: dish.cookTime.toString(),
            description: dish.description || '',
            imageUrl: dish.imageUrl || ''
        });
        setError(null);
    };

    const handleDishDelete = async (dishId) => {
        if (!confirm('Удалить блюдо? Это действие нельзя отменить.')) {
            return;
        }

        try {
            setError(null);
            await deleteDish(dishId);
            await loadData();
        } catch (err) {
            if (err.response?.status === 403) {
                setError('Нет прав для удаления блюда');
            } else if (err.response?.status === 404) {
                setError('Блюдо не найдено');
            } else {
                setError('Ошибка удаления блюда: ' + (err.message || 'Неизвестная ошибка'));
            }
        }
    };

    const handleImageUpload = async (file) => {
        if (!file) return;

        // Проверяем размер файла (например, максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Размер файла не должен превышать 5MB');
            return;
        }

        try {
            setError(null);
            const response = await uploadDishImage(file);
            const imageUrl = response.imageUrl || response.data?.imageUrl || response.url || response.data?.url;
            setDishForm(prev => ({ ...prev, imageUrl }));
        } catch (err) {
            setError('Ошибка загрузки изображения: ' + (err.message || 'Неизвестная ошибка'));
        }
    };

    const cancelCategoryEdit = () => {
        setEditingCategory(null);
        setCategoryForm({ name: '', description: '' });
        setError(null);
    };

    const cancelDishEdit = () => {
        setEditingDish(null);
        setDishForm({
            name: '',
            category: '',
            price: '',
            cookTime: '',
            description: '',
            imageUrl: ''
        });
        setError(null);
    };

    if (loading) return <div className="admin-container">Загрузка...</div>;

    return (
        <div className="admin-container">
            <AppHeader showSearch={false} />
            <h1>Панель администратора</h1>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            <div className="admin-tabs">
                <button
                    className={activeTab === 'categories' ? 'active' : ''}
                    onClick={() => setActiveTab('categories')}
                >
                    Категории ({categories.length})
                </button>
                <button
                    className={activeTab === 'dishes' ? 'active' : ''}
                    onClick={() => setActiveTab('dishes')}
                >
                    Блюда ({dishes.length})
                </button>
                <button
                    className={activeTab === 'stats' ? 'active' : ''}
                    onClick={() => setActiveTab('stats')}
                >
                    Статистика ({dishes.length})
                </button>
                <button
                    className={activeTab === 'staff' ? 'active' : ''}
                    onClick={() => setActiveTab('staff')}
                >
                    Персонал ({dishes.length})
                </button>
                <button
                    className={activeTab === 'orders' ? 'active' : ''}
                    onClick={() => setActiveTab('orders')}
                >
                    Заказы ({dishes.length})
                </button>
                <button
                    className={activeTab === 'settings' ? 'active' : ''}
                    onClick={() => setActiveTab('settings')}
                >
                    Настройки ({dishes.length})
                </button>
                <button
                    className={activeTab === 'reports' ? 'active' : ''}
                    onClick={() => setActiveTab('reports')}
                >
                    Отчеты ({dishes.length})
                </button>
                <button
                    className={activeTab === 'shift' ? 'active' : ''}
                    onClick={() => setActiveTab('shift')}
                >
                    Смена ({dishes.length})
                </button>
            </div>

            {activeTab === 'categories' && (
                <div className="admin-section">
                    <h2>Управление категориями</h2>

                    <form onSubmit={handleCategorySubmit} className="admin-form">
                        <input
                            type="text"
                            placeholder="Название категории"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                            maxLength={100}
                        />
                        <textarea
                            placeholder="Описание (опционально)"
                            value={categoryForm.description}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                            maxLength={500}
                        />
                        <div className="form-actions">
                            <button type="submit">
                                {editingCategory ? 'Обновить' : 'Добавить'} категорию
                            </button>
                            {editingCategory && (
                                <button type="button" onClick={cancelCategoryEdit}>
                                    Отмена
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="categories-list">
                        {categories.length === 0 ? (
                            <p>Категории не найдены</p>
                        ) : (
                            categories.map(category => (
                                <div key={category.id} className="category-item">
                                    <div>
                                        <h3>{category.name}</h3>
                                        {category.description && <p>{category.description}</p>}
                                    </div>
                                    <div className="category-actions">
                                        <button
                                            onClick={() => handleCategoryEdit(category)}
                                            disabled={editingCategory?.id === category.id}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => handleCategoryDelete(category.id)}
                                            className="delete-btn"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'dishes' && (
                <div className="admin-section">
                    <h2>Управление блюдами</h2>

                    <form onSubmit={handleDishSubmit} className="admin-form dish-form">
                        <input
                            type="text"
                            placeholder="Название блюда"
                            value={dishForm.name}
                            onChange={(e) => setDishForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                            maxLength={100}
                        />

                        <select
                            value={dishForm.category}
                            onChange={(e) => setDishForm(prev => ({ ...prev, category: e.target.value }))}
                            required
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Цена (руб.)"
                            value={dishForm.price}
                            onChange={(e) => setDishForm(prev => ({ ...prev, price: e.target.value }))}
                            required
                            min="1"
                            step="0.01"
                        />

                        <input
                            type="number"
                            placeholder="Время приготовления (мин.)"
                            value={dishForm.cookTime}
                            onChange={(e) => setDishForm(prev => ({ ...prev, cookTime: e.target.value }))}
                            required
                            min="1"
                        />

                        <textarea
                            placeholder="Описание блюда (опционально)"
                            value={dishForm.description}
                            onChange={(e) => setDishForm(prev => ({ ...prev, description: e.target.value }))}
                            maxLength={1000}
                        />

                        <input
                            type="url"
                            placeholder="URL изображения"
                            value={dishForm.imageUrl}
                            onChange={(e) => setDishForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                        />

                        <div className="form-actions">
                            <button type="submit">
                                {editingDish ? 'Обновить' : 'Добавить'} блюдо
                            </button>

                            {editingDish && (
                                <button type="button" onClick={cancelDishEdit}>
                                    Отмена
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="dishes-list">
                        {dishes.length === 0 ? (
                            <p>Блюда не найдены</p>
                        ) : (
                            dishes.map(dish => (
                                <div key={dish.id} className="dish-item">
                                    {dish.imageUrl && (
                                        <img
                                            src={dish.imageUrl}
                                            alt={dish.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <div className="dish-info">
                                        <h3>{dish.name}</h3>
                                        <p>Категория: {dish.category}</p>
                                        <p>Цена: {dish.price}₽</p>
                                        <p>Время приготовления: {dish.cookTime} мин</p>
                                        {dish.description && <p>Описание: {dish.description}</p>}
                                    </div>
                                    <div className="dish-actions">
                                        <button
                                            onClick={() => handleDishEdit(dish)}
                                            disabled={editingDish?.id === dish.id}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => handleDishDelete(dish.id)}
                                            className="delete-btn"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            {activeTab === 'stats' && (
                <div className="admin-section">
                    <h2>Статистика</h2>
                    {/* Здесь будет контент статистики */}
                </div>
            )}

            {activeTab === 'staff' && (
                <div className="admin-section">
                    <h2>Управление персоналом</h2>
                    {/* Здесь будет контент управления персоналом */}
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="admin-section">
                    <h2>Заказы</h2>
                    {/* Здесь будет контент заказов */}
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="admin-section">
                    <h2>Настройки</h2>
                    {/* Здесь будет контент настроек */}
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="admin-section">
                    <h2>Отчеты</h2>
                    {/* Здесь будет контент отчетов */}
                </div>
            )}

            {activeTab === 'shift' && (
                <div className="admin-section">
                    <h2>Смена</h2>
                    {/* Здесь будет контент смены */}
                </div>
            )}
        </div>
    );
}