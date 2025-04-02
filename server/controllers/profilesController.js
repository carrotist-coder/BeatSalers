const db = require('../db')();
const ApiError = require('../error/ApiError');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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
const updateMyProfile = async (req, res, next) => {
    const userId = req.user.id;
    const { name, bio, social_media_link, removePhoto } = req.body;

    // Функция для удаления старого файла
    const deleteOldPhoto = (oldPhotoUrl) => {
        if (oldPhotoUrl && typeof oldPhotoUrl === 'string') {
            const filePath = path.join(__dirname, '..', oldPhotoUrl);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Ошибка при удалении старого фото ${oldPhotoUrl}:`, err);
                } else {
                    console.log(`Старое фото ${oldPhotoUrl} успешно удалено`);
                }
            });
        }
    };

    // Функция для обрезки изображения до квадрата
    const cropToSquare = async (filePath) => {
        try {
            const image = sharp(filePath);
            const metadata = await image.metadata();
            const { width, height } = metadata;

            const size = Math.min(width, height);
            const left = Math.floor((width - size) / 2);
            const top = Math.floor((height - size) / 2);

            await image
                .extract({ left, top, width: size, height: size })
                .toFile(filePath + '.tmp'); // Временный файл
            fs.renameSync(filePath + '.tmp', filePath);
        } catch (err) {
            console.error(`Ошибка при обрезке изображения ${filePath}:`, err);
            throw ApiError.internal('Ошибка при обработке изображения');
        }
    };

    try {
        // Получаем текущий photo_url из базы данных
        db.get('SELECT photo_url FROM profiles WHERE user_id = ?', [userId], async (err, row) => {
            if (err) {
                return next(ApiError.internal('Ошибка при получении текущего профиля'));
            }
            if (!row) {
                return next(ApiError.notFound('Профиль не найден'));
            }

            const oldPhotoUrl = row.photo_url;
            let photo_url = oldPhotoUrl;

            if (req.file) {
                // Если загружен новый файл
                const filePath = path.join(__dirname, '..', 'uploads', 'profiles', req.file.filename);
                await cropToSquare(filePath); // Обрезаем до квадрата
                photo_url = `/uploads/profiles/${req.file.filename}`;
                deleteOldPhoto(oldPhotoUrl); // Удаляем старое фото
            } else if (removePhoto === 'true') {
                if (oldPhotoUrl) {
                    deleteOldPhoto(oldPhotoUrl);
                }
                photo_url = null;
            }

            const updatedAt = new Date().toISOString();

            db.run(
                'UPDATE profiles SET name = COALESCE(?, name), bio = COALESCE(?, bio), social_media_link = COALESCE(?, social_media_link), photo_url = ?, updated_at = ? WHERE user_id = ?',
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
        });
    } catch (err) {
        return next(err);
    }
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