const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'photo') {
            cb(null, 'uploads/profiles'); // Для фото профиля
        } else if (file.fieldname === 'image') {
            cb(null, 'uploads/beats/images'); // Для обложек аранжировок
        } else if (file.fieldname === 'audio') {
            cb(null, 'uploads/beats/audio'); // Для аудиофайлов
        } else {
            cb(new Error('Недопустимый тип файла'));
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Фильтр для разрешенных типов файлов
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'photo' || file.fieldname === 'image') {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Только изображения (JPEG, PNG, GIF) разрешены'));
        }
    } else if (file.fieldname === 'audio') {
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Только аудиофайлы (MP3, WAV) разрешены'));
        }
    } else {
        cb(new Error('Недопустимый тип файла'));
    }
};

module.exports = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: fileFilter
});