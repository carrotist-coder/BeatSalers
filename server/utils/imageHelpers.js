const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const ApiError = require('../error/ApiError');

module.exports = {
    deleteOldPhoto: (oldPhotoUrl) => {
        if (oldPhotoUrl && typeof oldPhotoUrl === 'string') {
            const filePath = path.join(__dirname, '..', oldPhotoUrl);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Ошибка при удалении старого фото ${oldPhotoUrl}:`, err);
                }
            });
        }
    },

    cropToSquare: async (filePath) => {
        try {
            const image = sharp(filePath);
            const metadata = await image.metadata();
            const { width, height } = metadata;
            const size = Math.min(width, height);
            const left = Math.floor((width - size) / 2);
            const top = Math.floor((height - size) / 2);

            await image
                .extract({ left, top, width: size, height: size })
                .toFile(filePath + '.tmp');
            fs.renameSync(filePath + '.tmp', filePath);
        } catch (err) {
            console.error(`Ошибка при обрезке изображения ${filePath}:`, err);
            throw ApiError.internal('Ошибка при обработке изображения');
        }
    }
};