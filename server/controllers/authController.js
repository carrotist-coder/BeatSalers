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

        // Генерация JWT токена
        const token = jwt.sign({ id: row.id, role: row.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Успешная аутентификация', user: { id: row.id, username: row.username, role: row.role }, token });
    });
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
                return next(ApiError.internal('Ошибка при регистрации пользователя'));
            }
            res.status(201).json({ message: 'Пользователь успешно зарегистрирован', userId: this.lastID });
        }
    );
};

module.exports = {
    login,
    register,
};