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
    const { title, description, style, bpm, audio_url, price } = req.body;
    const seller_id = req.user.id; // ID текущего пользователя как продавца
    const createdAt = new Date().toISOString();

    if (!title || !style || !audio_url || !price) {
        return next(ApiError.badRequest('Необходимо заполнить все обязательные поля: title, style, audio_url, price.'));
    }

    if (price <= 0) {
        return next(ApiError.badRequest('Цена должна быть больше нуля.'));
    }

    db.run(
        'INSERT INTO beats (title, description, style, bpm, audio_url, price, seller_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, description, style, bpm, audio_url, price, seller_id, createdAt, createdAt],
        function (err) {
            if (err) {
                return next(ApiError.internal('Ошибка при добавлении бита'));
            }
            res.status(201).json({ message: 'Бит успешно добавлен', beatId: this.lastID });
        }
    );
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
        if (err) {
            return next(ApiError.internal('Ошибка при проверке бита'));
        }
        if (!row) {
            return next(ApiError.notFound('Бит не найден'));
        }

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
                photo_url = imageFilePath;
                await cropToSquare(fullImagePath);
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
            'UPDATE beats SET title = COALESCE(?, title), description = COALESCE(?, description), style = COALESCE(?, style), bpm = COALESCE(?, bpm), audio_url = COALESCE(?, audio_url), price = COALESCE(?, price), photo_url = COALESCE(?, photo_url), updated_at = ? WHERE id = ?',
            [title, description, style, bpm, audio_url, price, photo_url, updatedAt, beatId],
            function (err) {
                if (err) {
                    return next(ApiError.internal('Ошибка при обновлении бита'));
                }
                if (this.changes === 0) {
                    return next(ApiError.notFound('Бит не найден'));
                }
                res.status(200).json({ message: 'Бит успешно обновлен' });
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