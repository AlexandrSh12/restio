// src/api/orders.js
import axiosClient from './axiosClient';

export const createOrder = (orderData) => {
    return axiosClient.post('/orders', orderData);
};

export const getOrderStatus = (orderId) => {
    return axiosClient.get(`/orders/${orderId}`);
};