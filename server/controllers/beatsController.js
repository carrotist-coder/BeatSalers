const db = require('../db')();
const ApiError = require('../error/ApiError');

// Получить все биты (доступно всем)
const getAllBeats = (req, res, next) => {
    db.all('SELECT * FROM beats', [], (err, rows) => {
        if (err) {
            return next(ApiError.internal('Ошибка при получении списка битов'));
        }
        res.status(200).json(rows);
    });
};

// Получить бит по ID (доступно всем)
const getBeatById = (req, res, next) => {
    const beatId = parseInt(req.params.id, 10);

    if (!beatId) {
        return next(ApiError.badRequest('ID бита обязателен'));
    }

    db.get('SELECT * FROM beats WHERE id = ?', [beatId], (err, row) => {
        if (err) {
            return next(ApiError.internal('Ошибка при получении бита'));
        }
        if (!row) {
            return next(ApiError.notFound('Бит не найден'));
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

// Обновить бит (только владелец или админ)
const updateBeat = async (req, res, next) => {
    const beatId = parseInt(req.params.id, 10);
    const { title, description, style, bpm, audio_url, price } = req.body;
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
            return next(ApiError.forbidden('Вы можете обновить только свои биты.'));
        }

        const updatedAt = new Date().toISOString();

        db.run(
            'UPDATE beats SET title = COALESCE(?, title), description = COALESCE(?, description), style = COALESCE(?, style), bpm = COALESCE(?, bpm), audio_url = COALESCE(?, audio_url), price = COALESCE(?, price), updated_at = ? WHERE id = ?',
            [title, description, style, bpm, audio_url, price, updatedAt, beatId],
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