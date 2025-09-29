// src/api/orders.js
import axiosClient from './axiosClient';

export const createOrder = (orderData) => {
    return axiosClient.post('/orders', orderData);
};

export const getOrderStatus = (orderId) => {
    return axiosClient.get(`/orders/${orderId}`);
};

// Новая функция для получения всех заказов
export const getAllOrders = () => {
    return axiosClient.get('/orders');
};

// Функция для обновления статуса заказа
export const updateOrderStatus = (orderId, status) => {
    return axiosClient.patch(`/orders/${orderId}/status`, null, {
        params: { status }
    });
};

// Функция для обновления комментария к заказу
export const updateOrderComment = (orderId, comment) => {
    return axiosClient.patch(`/orders/${orderId}/comment`, null, {
        params: { comment }
    });
};