import axios from "axios";

// HTTP-клиент без авторизации
const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// HTTP-клиент с авторизацией
const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// Интерцептор для добавления токена в заголовки запросов
const authInterceptor = (config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };