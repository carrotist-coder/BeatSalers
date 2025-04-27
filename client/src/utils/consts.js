export const MAIN_ROUTE = '/'; // Главная страница
export const AUTH_ROUTE = '/auth'; // Страница авторизации/регистрации
export const USERS_ROUTE = '/users'; // Страница пользователей
export const PROFILE_ROUTE = '/profiles/:username'; // Страница деталей конкретного пользователя
export const MY_PROFILE_ROUTE = '/me'; // Страница текущего профиля
export const BEATS_ROUTE = '/beats'; // Страница битов
export const BEAT_DETAILS_ROUTE = '/beats/:id'; // Страница деталей бита
export const ABOUT_ROUTE = '/about'; // Добавить новый маршрут

export const DEFAULT_PATH = '/uploads/default';
export const DEFAULT_AVATAR_IMAGE_FILENAME = 'default_avatar.png';
export const DEFAULT_BEAT_IMAGE_FILENAME = 'default_beat.png';

export const TITLE_VISIBLE_MAX_LENGTH = 27;
export const NAME_VISIBLE_MAX_LENGTH = 18;
export const SHORT_TEXT_MAX_LENGTH = 50;

export const STYLES = [
    'Pop', 'Hip Hop / Rap', 'Electronic', 'Classical', 'Indie', 'Rock', 'R&B / Soul', 'Trap', 'Ambient', 'Lo-Fi', 'Reggae'
];

export const ABOUT_CARDS_DATA = [
    {
        title: 'Колледж с историей и душой',
        text: 'Основанный в 1939 году, колледж стал первым музыкальным учебным заведением в Западной Беларуси, воспитавшим тысячи талантливых музыкантов. ',
        imageUrl: '/media/about1.jpg'
    },
    {
        title: 'Выпускники, покорившие сцену',
        text: 'Среди выпускников — участники ансамбля «Песняры», актриса Елена Воробей и композитор Игорь Корнелюк, чьи имена известны далеко за пределами Беларуси.',
        imageUrl: '/media/about2.jpg'
    },
    {
        title: 'Образование с перспективой',
        text: 'Колледж предлагает обучение по специальностям: инструментальное и вокальное исполнительство, музыковедение, хоровое искусство, открывая путь к успешной музыкальной карьере.',
        imageUrl: '/media/about3.jpg'
    },
    {
        title: 'Творчество без границ',
        text: 'Студенты участвуют в конкурсах, фестивалях и проектах, таких как «Молодежный музыкальный мост», сотрудничая с ведущими музыкальными академиями страны.',
        imageUrl: '/media/about4.png'
    },
    {
        title: 'Архитектурное и культурное наследие',
        text: 'Здание колледжа — не только учебное заведение, но и памятник архитектуры, являющийся центром музыкальной жизни Бреста.',
        imageUrl: '/media/about5.jpg'
    },
    {
        title: 'Педагоги — мастера своего дела',
        text: 'Преподаватели колледжа — признанные специалисты, многие из которых являются заслуженными артистами и деятелями искусств Беларуси.',
        imageUrl: '/media/about6.jpg'
    },
];

export const MAIN_CAROUSEL_DATA = [
    {
        title: 'Аранжировки',
        text: 'Лучшие музыкальные аранжировки от талантливых авторов',
        imageUrl: '/media/main1.jpg',
        route: BEATS_ROUTE,
        alt: 'Аранжировки'
    },
    {
        title: 'Музыканты',
        text: 'Преподаватели, творческие коллективы и солисты нашего колледжа',
        imageUrl: '/media/main2.jpg',
        route: USERS_ROUTE,
        alt: 'Музыканты'
    },
    {
        title: 'О колледже',
        text: 'Краткая информация о нашем колледже',
        imageUrl: '/media/main3.jpg',
        route: ABOUT_ROUTE,
        alt: 'Музыканты'
    }
];

export const OFFICIAL_COLLEGE_LINK = 'https://mus.brest.by/ru/';
export const GITHUB_AUTHOR_LINK = 'https://github.com/carrotist-coder/BeatSalers';