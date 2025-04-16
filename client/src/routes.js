import Main from './pages/Main';
import Auth from './pages/Auth';
import UserList from "./components/UserList";
import AudioList from "./components/AudioList";
import AudioPage from "./pages/AudioPage";
import UserPage from "./pages/UserPage";
import NotFoundPage from "./pages/NotFoundPage";
import About from "./pages/About";

import {
    MAIN_ROUTE, AUTH_ROUTE, USERS_ROUTE, BEATS_ROUTE, BEAT_DETAILS_ROUTE, PROFILE_ROUTE, MY_PROFILE_ROUTE, ABOUT_ROUTE
} from "./utils/consts";

// Защищенные маршруты (требуется авторизация)
export const authRoutes = [
    {
        path: MY_PROFILE_ROUTE,
        Component: UserPage // Страница с конкретным пользователем (мой профиль)
    },
];

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
        Component: UserList // Страница музыкантов
    },
    {
        path: BEATS_ROUTE,
        Component: AudioList // Страница аранжировок
    },
    {
        path: BEAT_DETAILS_ROUTE,
        Component: AudioPage // Страница с конкретной аранжировкой
    },
    {
        path: PROFILE_ROUTE,
        Component: UserPage // Страница с конкретным пользователем
    },
    {
        path: ABOUT_ROUTE, // Страница о колледже
        Component: About
    },
    {
        path: "*",
        Component: NotFoundPage // Страница ошибки
    }
];
