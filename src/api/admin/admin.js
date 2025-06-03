// src/api/admin.js
import axiosClient from '../axiosClient.js';

// Категории
export const fetchCategories = () => {
    return axiosClient.get('/admin/categories');
};

export const fetchAdminData = () => {
    return axiosClient.get('/admin'); // автоматически подставит токен
};

export const createCategory = (categoryData) => {
    return axiosClient.post('/admin/categories', categoryData);
};

export const updateCategory = (categoryId, categoryData) => {
    return axiosClient.put(`/admin/categories/${categoryId}`, categoryData);
};

export const deleteCategory = (categoryId) => {
    return axiosClient.delete(`/admin/categories/${categoryId}`);
};

// Блюда
export const createDish = (dishData) => {
    return axiosClient.post('/admin/dishes', dishData);
};

export const updateDish = (dishId, dishData) => {
    return axiosClient.put(`/admin/dishes/${dishId}`, dishData);
};

export const deleteDish = (dishId) => {
    return axiosClient.delete(`/admin/dishes/${dishId}`);
};

// Загрузка изображений
export const uploadImage = (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axiosClient.post('/admin/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};