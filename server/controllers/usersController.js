const db = require('../db')();
const ApiError = require('../error/ApiError');
const bcrypt = require("bcrypt");

// Получить всех пользователей
const getUsers = (req, res, next) => {
    db.all(`SELECT users.id, users.username, users.email, users.role, users.created_at,
                   profiles.name, profiles.bio, profiles.social_media_link, profiles.photo_url,
                   COUNT(beats.id) as beat_count
            FROM users
                     JOIN profiles ON users.id = profiles.user_id
                     LEFT JOIN beats ON users.id = beats.seller_id
            GROUP BY users.id`, [], (err, rows) => {
        if (err) {
            return next(ApiError.internal('Ошибка при получении списка пользователей'));
        }
        res.status(200).json(rows);
    });
};

// Получить информацию о текущем пользователе
const getMyProfile = async (req, res, next) => {
    const userId = req.user.id;
    db.get(
        `SELECT users.*, profiles.name, profiles.bio, profiles.social_media_link, profiles.photo_url
         FROM users
             JOIN profiles ON users.id = profiles.user_id
         WHERE users.id = ?`,
        [userId],
        (err, row) => {
            if (err) {
                return next(ApiError.internal('Ошибка при получении профиля пользователя'));
            }
            if (!row) {
                return next(ApiError.notFound('Профиль не найден'));
            }

            db.all(
                `SELECT beats.*, users.username as seller_username
                 FROM beats
                          JOIN users ON beats.seller_id = users.id
                 WHERE beats.seller_id = ?`,
                [userId],
                (beatsErr, beats) => {
                    if (beatsErr) {
                        return next(ApiError.internal('Ошибка при получении битов'));
                    }

                    const fullUser = {
                        user: {
                            id: row.id,
                            username: row.username,
                            email: row.email,
                            role: row.role,
                            created_at: row.created_at,
                            updated_at: row.updated_at,
                        },
                        profile: {
                            name: row.name,
                            bio: row.bio,
                            social_media_link: row.social_media_link,
                            photo_url: row.photo_url,
                        },
                        beats: beats || [],
                    };
                    res.status(200).json(fullUser);
                }
            );
        }
    );
};

// Получить информацию о пользователе
const getFullUserByUsername = (req, res, next) => {
    const username = req.params.username;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            return next(ApiError.internal('Ошибка при получении пользователя'));
        }
        if (!user) {
            return next(ApiError.notFound('Пользователь не найден'));
        }
        db.get('SELECT * FROM profiles WHERE user_id = ?', [user.id], (profileErr, profile) => {
            if (profileErr) {
                return next(ApiError.internal('Ошибка при получении профиля'));
            }
            if (!profile) {
                return next(ApiError.notFound('Профиль не найден'));
            }
            db.all(
                `SELECT beats.*, users.username as seller_username 
                 FROM beats 
                 JOIN users ON beats.seller_id = users.id 
                 WHERE beats.seller_id = ?`,
                [user.id],
                (beatsErr, beats) => {
                    if (beatsErr) {
                        return next(ApiError.internal('Ошибка при получении битов'));
                    }
                    const fullUser = {
                        user: user,
                        profile: profile,
                        beats: beats
                    };
                    res.status(200).json(fullUser);
                }
            );
        });
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
            // Создание профиля в таблице profiles
            db.run(
                'INSERT INTO profiles (user_id, name, bio, social_media_link, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, username, null, null, createdAt, createdAt],
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

    // Начало транзакции
    db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
            return next(ApiError.internal('Ошибка начала транзакции'));
        }

        // Удаление всех битов пользователя из таблицы beats
        db.run('DELETE FROM beats WHERE seller_id = ?', [userId], function (beatsErr) {
            if (beatsErr) {
                db.run('ROLLBACK', () => {
                    return next(ApiError.internal('Ошибка при удалении битов пользователя'));
                });
                return;
            }

            // Удаление профиля пользователя из таблицы user_profiles
            db.run('DELETE FROM profiles WHERE user_id = ?', [userId], function (profileErr) {
                if (profileErr) {
                    db.run('ROLLBACK', () => {
                        return next(ApiError.internal('Ошибка при удалении профиля пользователя'));
                    });
                    return;
                }

                // Удаление пользователя из таблицы users
                db.run('DELETE FROM users WHERE id = ?', [userId], function (userErr) {
                    if (userErr) {
                        db.run('ROLLBACK', () => {
                            return next(ApiError.internal('Ошибка при удалении пользователя'));
                        });
                        return;
                    }

                    if (this.changes === 0) {
                        db.run('ROLLBACK', () => {
                            return next(ApiError.notFound('Пользователь не найден'));
                        });
                        return;
                    }

                    // Если всё успешно, завершаем транзакцию
                    db.run('COMMIT', (commitErr) => {
                        if (commitErr) {
                            return next(ApiError.internal('Ошибка завершения транзакции'));
                        }
                        res.status(200).json({ message: 'Пользователь, его профиль и все биты успешно удалены' });
                    });
                });
            });
        });
    });
};

module.exports = {
    getUsers,
    getMyProfile,
    addUser,
    updateUser,
    deleteUser,
    getFullUserByUsername,
};