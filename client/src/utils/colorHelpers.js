// Функция для вычисления среднего цвета изображения
export const getAverageColor = (img) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Устанавливаем размеры canvas по размерам изображения
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let r = 0, g = 0, b = 0, count = 0;
    const step = 10;
    for (let i = 0; i < data.length; i += 4 * step) {
        const alpha = data[i + 3];
        // Если пиксель полностью прозрачный, считаем его белым
        const pixelR = alpha === 0 ? 255 : data[i];
        const pixelG = alpha === 0 ? 255 : data[i + 1];
        const pixelB = alpha === 0 ? 255 : data[i + 2];
        r += pixelR;
        g += pixelG;
        b += pixelB;
        count++;
    }
    return {
        r: Math.floor(r / count),
        g: Math.floor(g / count),
        b: Math.floor(b / count)
    };
};

// Функция для определения оптимального цвета текста по яркости
export const getTextColor = (r, g, b) => {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#000' : '#fff';
};