import Main from './pages/Main';
import Auth from './pages/Auth';
import UserList from "./components/UserList";

import {
    MAIN_ROUTE, AUTH_ROUTE, USERS_ROUTE
} from "./utils/consts";

// Публичные маршруты (доступны всем)
export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        Component: Main // Главная страница
    },
    {
        path: AUTH_ROUTE,
        Component: Auth // Страница авторизации/регистрации
    },
    {
        path: USERS_ROUTE,
        Component: UserList // Страница авторизации/регистрации
    },
];

// Защищенные маршруты (требуется авторизация)
export const authRoutes = [];