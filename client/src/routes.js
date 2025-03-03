import Main from './pages/Main';
import Auth from './pages/Auth';
import UserList from "./components/UserList";
import AudioList from "./components/AudioList";
import AudioPage from "./pages/AudioPage";
import UserPage from "./pages/UserPage";

import {
    MAIN_ROUTE, AUTH_ROUTE, USERS_ROUTE, BEATS_ROUTE, BEAT_DETAILS_ROUTE, PROFILE_ROUTE
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
];

// Защищенные маршруты (требуется авторизация)
export const authRoutes = [];