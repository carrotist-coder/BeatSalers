import { $authHost, $host } from "./index";
import jwtDecode from "jwt-decode";

// Метод для входа в систему
export const login = async (username, password) => {
    try {
        const response = await $host.post('/auth/login', { username, password });
        const { token } = response.data;

        // Сохраняем токен в localStorage
        localStorage.setItem('token', token);

        // Декодируем токен и возвращаем данные пользователя
        return jwtDecode(token);
    } catch (error) {
        console.error('Ошибка при входе:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Метод для проверки токена (автоматическая авторизация)
export const check = async () => {
    try {
        const response = await $authHost.get('/auth/check');
        const { token } = response.data;

        // Обновляем токен в localStorage (если сервер его обновил)
        localStorage.setItem('token', token);

        // Декодируем токен и возвращаем данные пользователя
        return jwtDecode(token);
    } catch (error) {
        console.error('Ошибка при проверке токена:', error.response ? error.response.data : error.message);
        throw error;
    }
};