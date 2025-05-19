// src/api/dishes.js
import axiosClient from './axiosClient';

export const fetchDishes = () => {
    return axiosClient.get('/dishes');
};
