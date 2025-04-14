const db = require('../db')();
const ApiError = require('../error/ApiError');
const path = require('path');
const fs = require('fs');
const {cropToSquare} = require("../utils/imageHelpers");

// Получить все биты (доступно всем)
const getAllBeats = (req, res, next) => {
    db.all(`SELECT beats.*, users.username as seller_username
            FROM beats
                     JOIN users ON beats.seller_id = users.id`, [], (err, rows) => {
        if (err) {
            return next(ApiError.internal('Ошибка при получении списка аранжировок'));
        }
        res.status(200).json(rows);
    });
};

// Получить бит по ID (доступно всем)
const getBeatById = (req, res, next) => {
    const beatId = parseInt(req.params.id, 10);
    if (!beatId) {
        return next(ApiError.badRequest('ID аранжировки обязателен'));
    }
    db.get(`SELECT beats.*, users.username as seller_username, users.email as email
            FROM beats
                     JOIN users ON beats.seller_id = users.id
            WHERE beats.id = ?`, [beatId], (err, row) => {
        if (err) {
            return next(ApiError.internal('Ошибка при получении аранжировки'));
        }
        if (!row) {
            return next(ApiError.notFound('Аранжировка не найдена'));
        }
        res.status(200).json(row);
    });
};

// Добавить новый бит
const addBeat = async (req, res, next) => {
    const { title, description, style, bpm, price, sellerUsername } = req.body;
    const createdAt = new Date().toISOString();

    let audio_url = null;
    let photo_url = null;

    // Проверка обязательных полей
    if (!title || !style || !bpm || !price) {
        return next(ApiError.badRequest('Необходимо заполнить все обязательные поля: title, style, bpm, price.'));
    }

    // Обработка загруженных файлов
    if (req.files) {
        if (req.files.audio && req.files.audio[0]) {
            audio_url = '/uploads/beats/audio/' + req.files.audio[0].filename;
        }

        if (req.files.image && req.files.image[0]) {
            photo_url = '/uploads/beats/images/' + req.files.image[0].filename;
            const fullImagePath = path.join(__dirname, '..', photo_url);
            try {
                await cropToSquare(fullImagePath);
            } catch (err) {
                return next(ApiError.internal('Ошибка при обработке изображения'));
            }
        }
    }

    if (!audio_url) {
        return next(ApiError.badRequest('Необходимо загрузить аудиофайл.'));
    }

    if (price < 0) {
        return next(ApiError.badRequest('Цена должна быть неотрицательной.'));
    }

    // Логика определения seller_id
    const publishBeat = (seller_id) => {
        db.run(
            `INSERT INTO beats 
             (title, description, style, bpm, audio_url, photo_url, price, seller_id, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, style, bpm, audio_url, photo_url, price, seller_id, createdAt, createdAt],
            function (err) {
                if (err) {
                    return next(ApiError.internal('Ошибка при добавлении бита'));
                }
                res.status(201).json({ message: 'Бит успешно добавлен', beatId: this.lastID });
            }
        );
    };

    if (
        req.user.role === 'admin' &&
        sellerUsername &&
        sellerUsername !== req.user.username
    ) {
        // Админ хочет опубликовать от имени другого пользователя
        db.get('SELECT id FROM users WHERE username = ?', [sellerUsername], (err, row) => {
            if (err) return next(ApiError.internal('Ошибка при поиске пользователя'));
            if (!row) return next(ApiError.badRequest('Пользователь не найден'));
            publishBeat(row.id);
        });
    } else {
        // Обычный пользователь или админ публикует от своего имени
        publishBeat(req.user.id);
    }
};

// Удаление старых файлов
const deleteOldFile = (filePath) => {
    if (filePath) {
        const fullPath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
};

// Обновление бита
const updateBeat = async (req, res, next) => {
    const beatId = parseInt(req.params.id, 10);
    const { title, description, style, bpm, price, removeImage } = req.body;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    if (!beatId) {
        return next(ApiError.badRequest('ID бита обязателен'));
    }

    db.get('SELECT * FROM beats WHERE id = ?', [beatId], async (err, row) => {
        if (err) return next(ApiError.internal('Ошибка при проверке бита'));
        if (!row) return next(ApiError.notFound('Бит не найден'));

        // Проверка прав доступа
        if (currentUserRole !== 'admin' && row.seller_id !== currentUserId) {
            return next(ApiError.forbidden('Вы можете обновить только свои биты.'));
        }

        let audio_url = row.audio_url;
        let photo_url = row.photo_url;

        // Обработка загруженных файлов
        if (req.files) {
            if (req.files.image) {
                const imageFilePath = path.join('/uploads/beats/images', req.files.image[0].filename);
                const fullImagePath = path.join(__dirname, '..', imageFilePath);
                deleteOldFile(photo_url);
                await cropToSquare(fullImagePath);
                photo_url = imageFilePath;
            }

            if (req.files.audio) {
                const audioFilePath = path.join('/uploads/beats/audio', req.files.audio[0].filename);
                deleteOldFile(audio_url);
                audio_url = audioFilePath;
            }
        }

        if (removeImage === 'true') {
            deleteOldFile(photo_url);
            photo_url = null;
        }

        const updatedAt = new Date().toISOString();

        db.run(
            `UPDATE beats 
             SET 
                 title = ?, 
                 description = ?, 
                 style = ?, 
                 bpm = ?, 
                 audio_url = ?, 
                 price = ?, 
                 photo_url = ?, 
                 updated_at = ?
             WHERE id = ?`,
            [
                title || row.title,
                typeof description === 'string' ? description : row.description,
                style || row.style,
                bpm || row.bpm,
                audio_url,
                price || row.price,
                photo_url,
                updatedAt,
                beatId
            ],
            function (err) {
                if (err) return next(ApiError.internal('Ошибка при обновлении бита'));
                if (this.changes === 0) return next(ApiError.notFound('Бит не найден'));

                res.status(200).json({ message: 'Бит успешно обновлён' });
            }
        );
    });
};

// Удалить бит (только владелец или админ)
const deleteBeat = (req, res, next) => {
    const beatId = parseInt(req.params.id, 10);
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    if (!beatId) {
        return next(ApiError.badRequest('ID бита обязателен'));
    }

    db.get('SELECT * FROM beats WHERE id = ?', [beatId], (err, row) => {
        if (err) {
            return next(ApiError.internal('Ошибка при проверке бита'));
        }
        if (!row) {
            return next(ApiError.notFound('Бит не найден'));
        }

        // Проверка прав доступа
        if (currentUserRole !== 'admin' && row.seller_id !== currentUserId) {
            return next(ApiError.forbidden('Вы можете удалить только свои биты.'));
        }

        db.run('DELETE FROM beats WHERE id = ?', [beatId], function (err) {
            if (err) {
                return next(ApiError.internal('Ошибка при удалении бита'));
            }
            if (this.changes === 0) {
                return next(ApiError.notFound('Бит не найден'));
            }
            res.status(200).json({ message: 'Бит успешно удален' });
        });
    });
};

module.exports = {
    getAllBeats,
    getBeatById,
    addBeat,
    updateBeat,
    deleteBeat,
};