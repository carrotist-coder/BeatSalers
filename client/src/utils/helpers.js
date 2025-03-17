// Функция для обрезки текста до maxLength символов с добавлением многоточия
// Если maxLength равен 0, то выводится весь текст
export const truncateText = (text, maxLength) => {
    if (!text) return '(нет описания)';
    if (text.length > maxLength && maxLength !== 0) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

// Функция для форматирования даты в формат ДД.ММ.ГГГГ
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}