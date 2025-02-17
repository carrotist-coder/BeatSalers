const db = require('../db')();
const ApiError = require('../error/ApiError');

// Получить свой профиль (любой авторизованный пользователь)
const getMyProfile = (req, res, next) => {
    const userId = req.user.id;

    db.get('SELECT * FROM user_profiles WHERE user_id = ?', [userId], (err, row) => {
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

    const updatedAt = new Date().toISOString();

    db.run(
        'UPDATE user_profiles SET name = COALESCE(?, name), bio = COALESCE(?, bio), social_media_link = COALESCE(?, social_media_link), updated_at = ? WHERE user_id = ?',
        [name, bio, social_media_link, updatedAt, userId],
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

// Получить профиль другого пользователя по ID
const getProfileById = (req, res, next) => {
    const profileId = parseInt(req.params.id, 10);

    if (!profileId) {
        return next(ApiError.badRequest('ID профиля обязателен'));
    }

    db.get('SELECT * FROM user_profiles WHERE user_id = ?', [profileId], (err, row) => {
        if (err) {
            return next(ApiError.internal('Ошибка при получении профиля'));
        }
        if (!row) {
            return next(ApiError.notFound('Профиль не найден'));
        }
        res.status(200).json(row);
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
        'UPDATE user_profiles SET name = COALESCE(?, name), bio = COALESCE(?, bio), social_media_link = COALESCE(?, social_media_link), updated_at = ? WHERE user_id = ?',
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
    getProfileById,
    updateAnyProfile,
};