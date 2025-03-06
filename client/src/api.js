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