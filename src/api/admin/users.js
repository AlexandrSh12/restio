// Пользователи
export const fetchUsers = () => {
    return axiosClient.get('/users');
};

export const createUser = (userData) => {
    return axiosClient.post('/users', userData);
};

export const updateUser = (userId, userData) => {
    return axiosClient.put(`/users/${userId}`, userData);
};

export const deleteUser = (userId) => {
    return axiosClient.delete(`/users/${userId}`);
};