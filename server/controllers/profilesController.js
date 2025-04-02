const db = require('../db')();
const ApiError = require('../error/ApiError');

// Получить свой профиль (любой авторизованный пользователь)
const getMyProfile = (req, res, next) => {
    const userId = req.user.id;

    db.get('SELECT * FROM profiles WHERE user_id = ?', [userId], (err, row) => {
        if (err) {
            return next(ApiError.internal('Ошибка при получении профиля'));
        }
        if (!row) {
            return next(ApiError.notFound('Профиль не найден'));
        }
        res.status(200).json(row);
    });
};

// Обновить свой профиль (любой авторизованный пользователь)
const updateMyProfile = (req, res, next) => {
    const userId = req.user.id;
    const { name, bio, social_media_link } = req.body;
    let photo_url = null;
    if (req.file) {
        photo_url = `/uploads/profiles/${req.file.filename}`;
    }

    const updatedAt = new Date().toISOString();

    db.run(
        'UPDATE profiles SET name = COALESCE(?, name), bio = COALESCE(?, bio), social_media_link = COALESCE(?, social_media_link), photo_url = COALESCE(?, photo_url), updated_at = ? WHERE user_id = ?',
        [name, bio, social_media_link, photo_url, updatedAt, userId],
        function (err) {
            if (err) {
                return next(ApiError.internal('Ошибка при обновлении профиля'));
            }
            if (this.changes === 0) {
                return next(ApiError.notFound('Профиль не найден'));
            }
            res.status(200).json({ message: 'Профиль успешно обновлен' });
        }
    );
};

// Получить профиль пользователя по username
const getProfileByUsername = (req, res, next) => {
    const username = req.params.username;

    if (!username) {
        return next(ApiError.badRequest('Имя пользователя обязательно.'));
    }

    // Сначала находим ID пользователя по username
    db.get('SELECT id FROM users WHERE username = ?', [username], (userErr, userRow) => {
        if (userErr) {
            return next(ApiError.internal('Ошибка при поиске пользователя'));
        }
        if (!userRow) {
            return next(ApiError.notFound('Пользователь не найден'));
        }

        const userId = userRow.id;

        // Затем находим профиль по user_id
        db.get('SELECT * FROM profiles WHERE user_id = ?', [userId], (profileErr, profileRow) => {
            if (profileErr) {
                return next(ApiError.internal('Ошибка при получении профиля'));
            }
            if (!profileRow) {
                return next(ApiError.notFound('Профиль не найден'));
            }
            res.status(200).json(profileRow);
        });
    });
};

// Обновить любой профиль (только админ)
const updateAnyProfile = (req, res, next) => {
    const profileId = parseInt(req.params.id, 10);
    const { name, bio, social_media_link } = req.body;

    if (!profileId) {
        return next(ApiError.badRequest('ID профиля обязателен'));
    }

    const updatedAt = new Date().toISOString();

    db.run(
        'UPDATE profiles SET name = COALESCE(?, name), bio = COALESCE(?, bio), social_media_link = COALESCE(?, social_media_link), updated_at = ? WHERE user_id = ?',
        [name, bio, social_media_link, updatedAt, profileId],
        function (err) {
            if (err) {
                return next(ApiError.internal('Ошибка при обновлении профиля'));
            }
            if (this.changes === 0) {
                return next(ApiError.notFound('Профиль не найден'));
            }
            res.status(200).json({ message: 'Профиль успешно обновлен' });
        }
    );
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    getProfileByUsername,
    updateAnyProfile,
};