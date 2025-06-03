// src/api/admin/categories.js
import axiosClient from '../axiosClient.js';

// Получение всех категорий
export const fetchCategories = () => {
    return axiosClient.get('/categories');
};

// Получение конкретной категории
export const fetchCategory = (categoryId) => {
    return axiosClient.get(`/categories/${categoryId}`);
};

// Создание категории
export const createCategory = (categoryData) => {
    return axiosClient.post('/categories', categoryData);
};

// Обновление категории
export const updateCategory = (categoryId, categoryData) => {
    return axiosClient.put(`/categories/${categoryId}`, categoryData);
};

// Удаление категории
export const deleteCategory = (categoryId) => {
    return axiosClient.delete(`/categories/${categoryId}`);
};

// Получение блюд в категории
export const getCategoryDishes = (categoryId) => {
    return axiosClient.get(`/categories/${categoryId}/dishes`);
};