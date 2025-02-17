const db = require('../db')();
const ApiError = require('../error/ApiError');
const bcrypt = require("bcrypt");

// Получить всех пользователей
const getUsers = (req, res, next) => {
    db.all('SELECT id, username, email, role, created_at FROM users', [], (err, rows) => {
        if (err) {
            return next(ApiError.internal('Ошибка при получении списка пользователей'));
        }
        res.status(200).json(rows);
    });
};

// Получить информацию о текущем пользователе
const getMyProfile = (req, res, next) => {
    const userId = req.user.id;

    db.get('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            return next(ApiError.internal('Ошибка при получении профиля пользователя'));
        }
        if (!row) {
            return next(ApiError.notFound('Пользователь не найден'));
        }
        res.status(200).json(row);
    });
};

// Добавить нового пользователя
const addUser = async (req, res, next) => {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email || !role) {
        return next(ApiError.badRequest('Все поля обязательны для заполнения.'));
    }

    if (!['user', 'admin'].includes(role)) {
        return next(ApiError.badRequest('Неверная роль пользователя. Доступные роли: "user" или "admin".'));
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const createdAt = new Date().toISOString();

    // Создание пользователя в таблице users
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

            const userId = this.lastID;
            // Создание профиля в таблице user_profiles
            console.log('Creating profile with:', {
                userId,
                name: 'Unnamed',
                bio: null,
                social_media_link: null,
                createdAt,
                updatedAt: createdAt,
            });
            db.run(
                'INSERT INTO user_profiles (user_id, name, bio, social_media_link, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, 'Unnamed', null, null, createdAt, createdAt],
                function (profileErr) {
                    if (profileErr) {
                        // Если произошла ошибка при создании профиля, удаляем пользователя
                        db.run('DELETE FROM users WHERE id = ?', [userId], () => {
                            return next(ApiError.internal('Ошибка при создании профиля пользователя'));
                        });
                        return;
                    }
                    res.status(201).json({ message: 'Пользователь и профиль успешно созданы', userId });
                }
            );
        }
    );
};

// Функция для обновления пользователя
const updateUser = async (req, res, next) => {
    const userId = parseInt(req.params.id, 10);
    const { username, email, password, role } = req.body;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    // Проверка наличия ID
    if (!userId) {
        return next(ApiError.badRequest('ID пользователя обязателен'));
    }

    // Проверка прав доступа
    if (currentUserRole !== 'admin' && userId !== currentUserId) {
        return next(ApiError.forbidden('Вы можете обновить только свой профиль.'));
    }

    // Если передана новая роль, проверяем права администратора
    if (role && currentUserRole !== 'admin') {
        return next(ApiError.forbidden('Только администратор может изменять роли пользователей.'));
    }

    let hashedPassword;

    // Если передан новый пароль
    if (password) {
        try {
            hashedPassword = await bcrypt.hash(password, 5);
        } catch (err) {
            return next(ApiError.internal('Ошибка при хешировании пароля'));
        }
    }

    const updatedAt = new Date().toISOString();

    // SQL-запрос для обновления пользователя
    const sql = `
        UPDATE users 
        SET username = COALESCE(?, username), 
            email = COALESCE(?, email), 
            password = COALESCE(?, password), 
            role = COALESCE(?, role), 
            updated_at = ? 
        WHERE id = ?
    `;

    db.run(
        sql,
        [username, email, hashedPassword || null, role || null, updatedAt, userId],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return next(ApiError.internal('Имя пользователя или email уже занято.'));
                }
                return next(ApiError.internal('Ошибка при обновлении пользователя'));
            }
            if (this.changes === 0) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
            res.status(200).json({ message: 'Профиль успешно обновлен' });
        }
    );
};

// Удалить пользователя (только админ)
const deleteUser = (req, res, next) => {
    const userId = parseInt(req.params.id, 10);
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    if (currentUserRole !== 'admin') {
        return next(ApiError.forbidden('Только администратор может удалить пользователя.'));
    }

    if (userId === currentUserId) {
        return next(ApiError.forbidden('Вы не можете удалить свой профиль.'));
    }

    // Удаление профиля пользователя из таблицы user_profiles
    db.run('DELETE FROM user_profiles WHERE user_id = ?', [userId], function (profileErr) {
        if (profileErr) {
            return next(ApiError.internal('Ошибка при удалении профиля пользователя'));
        }

        // Удаление пользователя из таблицы users
        db.run('DELETE FROM users WHERE id = ?', [userId], function (userErr) {
            if (userErr) {
                return next(ApiError.internal('Ошибка при удалении пользователя'));
            }

            if (this.changes === 0) {
                return next(ApiError.notFound('Пользователь не найден'));
            }

            res.status(200).json({ message: 'Пользователь и его профиль успешно удалены' });
        });
    });
};

const getUserByUsername = (req, res, next) => {
    const username = req.params.username;

    if (!username) {
        return next(ApiError.badRequest('Имя пользователя обязательно.'));
    }

    db.get(
        'SELECT id, username, email, role, created_at FROM users WHERE username = ?',
        [username],
        (err, row) => {
            if (err) {
                return next(ApiError.internal('Ошибка при поиске пользователя'));
            }
            if (!row) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
            res.status(200).json(row);
        }
    );
};

module.exports = {
    getUsers,
    getMyProfile,
    addUser,
    updateUser,
    deleteUser,
    getUserByUsername,
};