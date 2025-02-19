const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db')();
const ApiError = require('../error/ApiError');

// Метод для аутентификации пользователя (получение токена)
const login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return next(ApiError.badRequest('Некорректный логин или пароль.'));
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
        if (err) {
            return next(ApiError.internal('Ошибка при аутентификации пользователя'));
        }
        if (!row) {
            return next(ApiError.notFound('Пользователь не найден'));
        }

        // Сравнение пароля
        const match = await bcrypt.compare(password, row.password);
        if (!match) {
            return next(ApiError.badRequest('Неправильный пароль.'));
        }

        // Генерация JWT-токена
        const token = jwt.sign({ id: row.id, role: row.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Успешная аутентификация', token });
    });
};

// Метод для проверки токена
const check = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(ApiError.forbidden('Необходима авторизация'));
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Обновляем токен (опционально)
        const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // Получаем данные пользователя из базы данных
        db.get('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.id], (err, row) => {
            if (err) {
                return next(ApiError.internal('Ошибка при получении данных пользователя'));
            }
            if (!row) {
                return next(ApiError.notFound('Пользователь не найден'));
            }

            res.status(200).json({ user: row, token: newToken });
        });
    } catch (error) {
        return next(ApiError.forbidden('Недействительный токен'));
    }
};

// Метод для регистрации нового пользователя
const register = async (req, res, next) => {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email || !role) {
        return next(ApiError.badRequest('Все поля обязательны для заполнения.'));
    }

    if (!['user', 'admin'].includes(role)) {
        return next(ApiError.badRequest('Неверная роль пользователя. Доступные роли: "user" или "admin".'));
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 5);

    const createdAt = new Date().toISOString();
    db.run(
        'INSERT INTO users (username, password, email, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [username, hashedPassword, email, role, createdAt, createdAt],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return next(ApiError.internal('Имя пользователя или email уже занято.'));
                }
                return next(ApiError.internal('Ошибка при добавлении пользователя'));
            }

            // Генерация JWT-токена после успешной регистрации
            const token = jwt.sign({ id: this.lastID, role }, process.env.SECRET_KEY, { expiresIn: '1h' });

            // Возвращаем токен клиенту
            res.status(201).json({ message: 'Пользователь успешно создан', token });
        }
    );
};

module.exports = {
    login,
    check,
    register,
};