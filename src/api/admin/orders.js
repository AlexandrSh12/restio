// src/api/admin/orders.js
import axiosClient from '../axiosClient.js';

// Получение всех заказов
export const fetchOrders = (params = {}) => {
    return axiosClient.get('/orders', { params });
};

// Получение конкретного заказа
export const fetchOrder = (orderId) => {
    return axiosClient.get(`/orders/${orderId}`);
};

// Обновление статуса заказа
export const updateOrderStatus = (orderId, status) => {
    return axiosClient.patch(`/orders/${orderId}/status`, { status });
};

// Добавление комментария к заказу
export const updateOrderComment = (orderId, comment) => {
    return axiosClient.patch(`/orders/${orderId}/comment`, { comment });
};

// Удаление заказа (если нужно)
export const deleteOrder = (orderId) => {
    return axiosClient.delete(`/orders/${orderId}`);
};

// Статистика заказов
export const getOrdersStats = (period = 'today') => {
    return axiosClient.get('/orders/stats', { params: { period } });
};