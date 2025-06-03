// src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import AppHeader from '../../components/common/AppHeader.jsx';
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    createDish,
    updateDish,
    deleteDish,
    uploadImage
} from '../../api/admin/admin.js';
import { fetchDishes } from '../../api/dishes.js';
import '../../styles/pages/admin.css';
import { fetchAdminData } from '../../api/admin/admin';
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
        oldPrice: '',
        weight: '',
        kcal: '',
        cookTime: '',
        description: '',
        image: ''
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
            const [categoriesRes, dishesRes] = await Promise.all([
                fetchCategories(),
                fetchDishes()
            ]);
            setCategories(categoriesRes.data);
            setDishes(dishesRes.data);
        } catch (err) {
            setError('Ошибка загрузки данных');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Категории
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, categoryForm);
                setEditingCategory(null);
            } else {
                await createCategory(categoryForm);
            }
            setCategoryForm({ name: '', description: '' });
            loadData();
        } catch (err) {
            setError('Ошибка сохранения категории');
        }
    };

    const handleCategoryEdit = (category) => {
        setEditingCategory(category);
        setCategoryForm({ name: category.name, description: category.description || '' });
    };

    const handleCategoryDelete = async (categoryId) => {
        if (confirm('Удалить категорию?')) {
            try {
                await deleteCategory(categoryId);
                loadData();
            } catch (err) {
                setError('Ошибка удаления категории');
            }
        }
    };

    // Блюда
    const handleDishSubmit = async (e) => {
        e.preventDefault();
        try {
            const dishData = {
                ...dishForm,
                price: parseFloat(dishForm.price),
                oldPrice: dishForm.oldPrice ? parseFloat(dishForm.oldPrice) : null,
                kcal: parseInt(dishForm.kcal),
                cookTime: parseInt(dishForm.cookTime)
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
                oldPrice: '',
                weight: '',
                kcal: '',
                cookTime: '',
                description: '',
                image: ''
            });
            loadData();
        } catch (err) {
            setError('Ошибка сохранения блюда');
        }
    };

    const handleDishEdit = (dish) => {
        setEditingDish(dish);
        setDishForm({
            name: dish.name,
            category: dish.category,
            price: dish.price.toString(),
            oldPrice: dish.oldPrice ? dish.oldPrice.toString() : '',
            weight: dish.weight,
            kcal: dish.kcal.toString(),
            cookTime: dish.cookTime.toString(),
            description: dish.description || '',
            image: dish.image || ''
        });
    };

    const handleDishDelete = async (dishId) => {
        if (confirm('Удалить блюдо?')) {
            try {
                await deleteDish(dishId);
                loadData();
            } catch (err) {
                setError('Ошибка удаления блюда');
            }
        }
    };

    const handleImageUpload = async (file) => {
        try {
            const response = await uploadImage(file);
            setDishForm(prev => ({ ...prev, image: response.data.url }));
        } catch (err) {
            setError('Ошибка загрузки изображения');
        }
    };

    if (loading) return <div className="admin-container">Загрузка...</div>;

    return (
        <div className="admin-container">
            <AppHeader showSearch={false} /> {/* ← Поиск скрыт */}
            <h1>Панель администратора</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="admin-tabs">
                <button
                    className={activeTab === 'categories' ? 'active' : ''}
                    onClick={() => setActiveTab('categories')}
                >
                    Категории
                </button>
                <button
                    className={activeTab === 'dishes' ? 'active' : ''}
                    onClick={() => setActiveTab('dishes')}
                >
                    Блюда
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
                        />
                        <input
                            type="text"
                            placeholder="Описание (опционально)"
                            value={categoryForm.description}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                        <button type="submit">
                            {editingCategory ? 'Обновить' : 'Добавить'} категорию
                        </button>
                        {editingCategory && (
                            <button type="button" onClick={() => {
                                setEditingCategory(null);
                                setCategoryForm({ name: '', description: '' });
                            }}>
                                Отмена
                            </button>
                        )}
                    </form>

                    <div className="categories-list">
                        {categories.map(category => (
                            <div key={category.id} className="category-item">
                                <div>
                                    <h3>{category.name}</h3>
                                    <p>{category.description}</p>
                                </div>
                                <div className="category-actions">
                                    <button onClick={() => handleCategoryEdit(category)}>
                                        Редактировать
                                    </button>
                                    <button onClick={() => handleCategoryDelete(category.id)}>
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
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
                            placeholder="Цена"
                            value={dishForm.price}
                            onChange={(e) => setDishForm(prev => ({ ...prev, price: e.target.value }))}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Старая цена (опционально)"
                            value={dishForm.oldPrice}
                            onChange={(e) => setDishForm(prev => ({ ...prev, oldPrice: e.target.value }))}
                        />

                        <input
                            type="text"
                            placeholder="Вес (например, 250г)"
                            value={dishForm.weight}
                            onChange={(e) => setDishForm(prev => ({ ...prev, weight: e.target.value }))}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Калории"
                            value={dishForm.kcal}
                            onChange={(e) => setDishForm(prev => ({ ...prev, kcal: e.target.value }))}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Время приготовления (мин)"
                            value={dishForm.cookTime}
                            onChange={(e) => setDishForm(prev => ({ ...prev, cookTime: e.target.value }))}
                            required
                        />

                        <textarea
                            placeholder="Описание блюда"
                            value={dishForm.description}
                            onChange={(e) => setDishForm(prev => ({ ...prev, description: e.target.value }))}
                        />

                        <input
                            type="text"
                            placeholder="URL изображения"
                            value={dishForm.image}
                            onChange={(e) => setDishForm(prev => ({ ...prev, image: e.target.value }))}
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                        />

                        <button type="submit">
                            {editingDish ? 'Обновить' : 'Добавить'} блюдо
                        </button>

                        {editingDish && (
                            <button type="button" onClick={() => {
                                setEditingDish(null);
                                setDishForm({
                                    name: '',
                                    category: '',
                                    price: '',
                                    oldPrice: '',
                                    weight: '',
                                    kcal: '',
                                    cookTime: '',
                                    description: '',
                                    image: ''
                                });
                            }}>
                                Отмена
                            </button>
                        )}
                    </form>

                    <div className="dishes-list">
                        {dishes.map(dish => (
                            <div key={dish.id} className="dish-item">
                                {dish.image && <img src={dish.image} alt={dish.name} />}
                                <div className="dish-info">
                                    <h3>{dish.name}</h3>
                                    <p>Категория: {dish.category}</p>
                                    <p>Цена: {dish.price}₽ {dish.oldPrice && `(было ${dish.oldPrice}₽)`}</p>
                                    <p>{dish.weight} · {dish.kcal} ккал · {dish.cookTime} мин</p>
                                    <p>{dish.description}</p>
                                </div>
                                <div className="dish-actions">
                                    <button onClick={() => handleDishEdit(dish)}>
                                        Редактировать
                                    </button>
                                    <button onClick={() => handleDishDelete(dish.id)}>
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}