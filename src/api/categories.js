// src/api/categories.js
import axiosClient from './axiosClient.js';

export const fetchCategories = () => {
    return axiosClient.get('/categories');
};