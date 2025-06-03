// Статистика
export const fetchOrderStats = (period) => {
    return axiosClient.get('/stats/orders', { params: { period } });
};

export const fetchRevenueStats = (period) => {
    return axiosClient.get('/stats/revenue', { params: { period } });
};