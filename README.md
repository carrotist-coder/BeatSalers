# 🎧 BeatSalers — аранжировки БГМК

**BeatSalers** — это полнофункциональное веб-приложение для управления аранжировками от музыкантов Брестского государственного музыкального колледжа имени Григория Ширмы. 
Проект создан в учебных целях и состоит из frontend-приложения на **React** и backend-сервера на **Node.js + Express**.

---

## 🌐 Live Demo

⚠️ Важно: для полной работы демо необходимо запустить backend локально (см. раздел "Установка")

[Открыть приложение на GitHub Pages (фронтенд)](https://carrotist-coder.github.io/BeatSalers/)

---

## 🔧 Функциональность

- Авторизация и регистрация
- Просмотр списка аранжировок и пользователей
- Детальные страницы аранжировок и пользователей
- SPA-навигация через React Router
- Поиск и фильтрация данных
- CRUD-операции
- Backend REST API на Express
- Unit-тесты
- Отдельный фронтенд-деплой на GitHub Pages
- Адаптивная вёрстка

---

## 🧰 Технологии

### Frontend:
- React
- React DOM
- React Router v6
- MobX
- Bootstrap
- JavaScript
- CSS
- GitHub Pages для деплоя

### Backend:
- Node.js
- Express
- Axios
- CORS
- dotenv
- Bcrypt
- Multer

### База данных:
- SQLite3

### Аутентификация:
- JWT

### Прочее:
- Webpack
- ESLint
- Jest
- Supertest

---

## 📦 Установка

### 1. Клонировать репозиторий
```
git clone https://github.com/carrotist-coder/BeatSalers.git
cd BeatSalers
```
### 2. Установить зависимости
Backend:
```
cd server
npm install
```
Frontend:
```
cd client
npm install
```
### 3. Создать .env файлы
server/
```
PORT=7000
SECRET_KEY=your_secret_key
```
client/
```
REACT_APP_API_URL='http://localhost:7000'
```

---

## 🚀 Запуск
Полное веб-приложение
```
npm start
```
Только server
```
cd server
npm run dev
```
Только client
```
cd client
npm start
```

При первом запуске backend база данных создаётся автоматически. 
Если используется существующий дамп, положите database.db в папку server/.

---

## 🧪 Тестирование
В проекте используются unit, backend, frontend тесты.

Тестирование всего приложения
```
npm test
```
Если необходимо протестировать только бэкэнд/фронтенд, до этого надо перейти в соответствующую директорию, например:
```
cd server
npm test
```

---

## 🌐 Сборка и деплой
Фронтенд работает по ссылке https://carrotist-coder.github.io/BeatSalers/

Для корректного отображения данных необходимо, чтобы сервер был запущен и установилось подключение к базе данных.
```
npm run build    # Проверка успешной сборки
npm run deploy   # Деплой на GitHub Pages
```

---

## ❗ Дополнительно
Все загружаемые на сервер файлы хранятся в server/uploads.

---

## 💡 Автор
Марковский Дмитрий (студент 2 курса БрГТУ): [@carrotist-coder](https://github.com/carrotist-coder)
