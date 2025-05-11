import {formatDate, truncateText} from "./helpers";

describe('truncateText', () => {
    test('возвращает текст с многоточием, если длина превышает maxLength', () => {
        expect(truncateText('Hello, world!', 5)).toBe('Hello...');
    });

    test('возвращает исходный текст, если длина меньше maxLength', () => {
        expect(truncateText('Hi', 5)).toBe('Hi');
    });

    test('возвращает весь текст, если maxLength = 0', () => {
        expect(truncateText('Some long description', 0)).toBe('Some long description');
    });

    test('возвращает "(нет описания)", если передан пустой текст', () => {
        expect(truncateText('', 10)).toBe('(нет описания)');
    });

    test('не добавляет многоточие, если длина равна maxLength', () => {
        expect(truncateText('12345', 5)).toBe('12345');
    });
});

describe('formatDate', () => {
    test('форматирует дату в ДД.ММ.ГГГГ', () => {
        expect(formatDate('2023-12-31')).toBe('31.12.2023');
    });

    test('добавляет нули перед днями и месяцами < 10', () => {
        expect(formatDate('2024-01-05')).toBe('05.01.2024');
    });

    test('корректно работает с ISO строками', () => {
        expect(formatDate('2022-06-15T14:48:00.000Z')).toBe('15.06.2022');
    });

    test('возвращает некорректную дату, если дата невалидная (но не падает)', () => {
        expect(formatDate('invalid-date')).toBe('NaN.NaN.NaN');
    });

    test('работает с объектом new Date()', () => {
        const date = new Date(2021, 2, 9);
        expect(formatDate(date)).toBe('09.03.2021');
    });
});
