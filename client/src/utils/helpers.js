// Функция для обрезки текста до maxLength символов с добавлением многоточия
export const truncateText = (text, maxLength) => {
    if (!text) return '(нет описания)';
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};