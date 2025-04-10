import axios from 'axios';

export const baseURL = process.env.REACT_APP_API_URL;

const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { headers: { Authorization: `Bearer ${token}` } };
    }
    return {};
};

export const getUsers = async () => {
    try {
        const response = await axios.get(baseURL + '/users', getHeaders());
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        throw error;
    }
};

export const getFullUserByUsername = async (username) => {
    try {
        const response = await axios.get(baseURL + `/users/${username}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        throw error;
    }
};

export const getAllBeats = async () => {
    try {
        const response = await axios.get(baseURL + '/beats', getHeaders());
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении списка аранжировок:', error);
        throw error;
    }
};

export const getBeatById = async (id) => {
    try {
        const response = await axios.get(baseURL + `/beats/${id}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных аранжировки:', error);
        throw error;
    }
};

export const getMyProfile = async () => {
    try {
        const response = await axios.get(baseURL + '/users/me', getHeaders());
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных моего профиля:', error);
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await axios.put(`${baseURL}/users/${userId}`, userData, getHeaders());
        return response.data;
    } catch (error) {
        console.error('Ошибка обновления пользователя:', error);
        throw error;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await axios.put(`${baseURL}/profiles/me`, profileData, getHeaders());
        return response.data;
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        throw error;
    }
};

export const updateAnyProfile = async (userId, profileData) => {
    try {
        const response = await axios.put(
            `${baseURL}/profiles/${userId}`,
            profileData,
            getHeaders()
        );
        return response.data;
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        throw error;
    }
};

export const deleteUser = async (password, userId = null) => {
    try {
        const url = userId ? `${baseURL}/users/${userId}` : `${baseURL}/users`;
        const response = await axios.delete(url, {
            data: { password },
            ...getHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при удалении аккаунта:', error);
        throw error;
    }
};