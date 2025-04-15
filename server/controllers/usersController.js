const db = require('../db')();
const ApiError = require('../error/ApiError');
const bcrypt = require("bcrypt");
const {validateEmail} = require("../utils/helpers");

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

    if (password.length < 6) {
        return next(ApiError.badRequest('Пароль должен быть длиной не менее 6 символов.'));
    }

    // Проверяем валидность email
    if (!validateEmail(email)) {
        return next(ApiError.badRequest('Некорректный формат email.'));
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
    const { username, email, password, role, oldPassword } = req.body;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    // Проверка наличия ID
    if (!userId) {
        return next(ApiError.badRequest('ID пользователя обязателен'));
    }

    const isSelf = userId === currentUserId;

    if (currentUserRole !== 'admin' && !isSelf) {
        return next(ApiError.forbidden('Вы можете обновить только свой профиль.'));
    }

    let newRole = null;
    if (role) {
        if (currentUserRole !== 'admin') {
            return next(ApiError.forbidden('Только администратор может изменять роли пользователей.'));
        }
        if (role !== 'admin' && role !== 'user') {
            return next(ApiError.badRequest('Недопустимая роль'));
        }
        newRole = role;
    }

    let hashedPassword;

    // Если передан новый пароль
    if (password) {
        if (password.length < 6) {
            return next(ApiError.badRequest('Пароль должен быть длиной не менее 6 символов.'));
        }

        // Получаем текущий хеш пароля из БД
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT password FROM users WHERE id = ?', [userId], (err, row) => {
                if (err) return reject(err);
                if (!row) return reject(ApiError.notFound('Пользователь не найден'));
                resolve(row);
            });
        });

        // Проверяем старый пароль
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return next(ApiError.badRequest('Неверный старый пароль'));
        }

        hashedPassword = await bcrypt.hash(password, 5);
    }

    // Проверяем валидность email
    if (!validateEmail(email)) {
        return next(ApiError.badRequest('Некорректный формат email.'));
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
        [username, email, hashedPassword || null, newRole || null, updatedAt, userId],
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
const deleteUser = async (req, res, next) => {
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    const { password } = req.body;
    const userId = req.params.id ? parseInt(req.params.id, 10) : currentUserId;

    if (!password) {
        return next(ApiError.badRequest('Пароль обязателен для удаления аккаунта'));
    }

    // Проверка доступа
    if (currentUserRole !== 'admin' && userId !== currentUserId) {
        return next(ApiError.forbidden('Вы можете удалить только свой аккаунт'));
    }

    // Проверка пароля
    db.get('SELECT password FROM users WHERE id = ?', [currentUserRole === 'admin' ? currentUserId : userId], async (err, row) => {
        if (err) return next(ApiError.internal('Ошибка при получении данных пользователя'));
        if (!row) return next(ApiError.notFound('Пользователь не найден'));

        const passwordMatch = await bcrypt.compare(password, row.password);
        if (!passwordMatch) return next(ApiError.forbidden('Неверный пароль'));

        db.run('BEGIN TRANSACTION', (transErr) => {
            if (transErr) return next(ApiError.internal('Ошибка начала транзакции'));

            db.run('DELETE FROM beats WHERE seller_id = ?', [userId], function (beatsErr) {
                if (beatsErr) return db.run('ROLLBACK', () => next(ApiError.internal('Ошибка при удалении битов пользователя')));

                db.run('DELETE FROM profiles WHERE user_id = ?', [userId], function (profileErr) {
                    if (profileErr) return db.run('ROLLBACK', () => next(ApiError.internal('Ошибка при удалении профиля пользователя')));

                    db.run('DELETE FROM users WHERE id = ?', [userId], function (userErr) {
                        if (userErr || this.changes === 0) {
                            return db.run('ROLLBACK', () => next(ApiError.internal('Ошибка при удалении пользователя')));
                        }

                        db.run('COMMIT', (commitErr) => {
                            if (commitErr) return next(ApiError.internal('Ошибка завершения транзакции'));
                            res.status(200).json({ message: 'Пользователь успешно удален' });
                        });
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