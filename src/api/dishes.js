// src/api/dishes.js
import axiosClient from './axiosClient';

export const fetchDishes = () => {
    return axiosClient.get('/dishes');
};
// Создание блюда
export const createDish = (dishData) => {
    return axiosClient.post('/dishes', dishData);
};

// Обновление блюда
export const updateDish = (dishId, dishData) => {
    return axiosClient.put(`/dishes/${dishId}`, dishData);
};

// Удаление блюда
export const deleteDish = (dishId) => {
    return axiosClient.delete(`/dishes/${dishId}`);
};

// Получение популярных блюд
export const getPopularDishes = (limit = 10) => {
    return axiosClient.get('/dishes/popular', { params: { limit } });
};

// Загрузка изображения для блюда
export const uploadDishImage = (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axiosClient.post('/dishes/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};