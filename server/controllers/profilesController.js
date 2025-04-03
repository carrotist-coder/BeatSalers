const db = require('../db')();
const ApiError = require('../error/ApiError');
const path = require('path');
const {cropToSquare, deleteOldPhoto} = require("../utils/imageHelpers");

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

// Основная функция обновления профиля
const updateProfile = async (req, res, next, userId) => {
    const { name, bio, social_media_link, removePhoto } = req.body;

    try {
        const row = await new Promise((resolve, reject) => {
            db.get('SELECT photo_url FROM profiles WHERE user_id = ?', [userId], (err, row) => {
                if (err) reject(ApiError.internal('Ошибка при получении текущего профиля'));
                if (!row) reject(ApiError.notFound('Профиль не найден'));
                resolve(row);
            });
        });

        let photo_url = row.photo_url;

        if (req.file) {
            const filePath = path.join(__dirname, '..', 'uploads', 'profiles', req.file.filename);
            await cropToSquare(filePath);
            photo_url = `/uploads/profiles/${req.file.filename}`;
            deleteOldPhoto(row.photo_url);
        } else if (removePhoto === 'true') {
            deleteOldPhoto(row.photo_url);
            photo_url = null;
        }

        const updatedAt = new Date().toISOString();

        await db.run(
            'UPDATE profiles SET name = COALESCE(?, name), bio = COALESCE(?, bio), social_media_link = COALESCE(?, social_media_link), photo_url = ?, updated_at = ? WHERE user_id = ?',
            [name, bio, social_media_link, photo_url, updatedAt, userId]
        );

        await db.run('UPDATE users SET updated_at = ? WHERE id = ?', [updatedAt, userId]);

        res.status(200).json({ message: 'Профиль успешно обновлен' });
    } catch (err) {
        next(err);
    }
};

// Обновить свой профиль (любой авторизованный пользователь)
const updateMyProfile = async (req, res, next) => {
    await updateProfile(req, res, next, req.user.id);
};

// Обновить любой профиль (только админ)
const updateAnyProfile = async (req, res, next) => {
    const userId = parseInt(req.params.id, 10);
    if (!userId) {
        return next(ApiError.badRequest('ID пользователя обязателен'));
    }
    await updateProfile(req, res, next, userId);
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

module.exports = {
    getMyProfile,
    updateMyProfile,
    getProfileByUsername,
    updateAnyProfile,
};