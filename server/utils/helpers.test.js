const { validateEmail, validateUsername } = require('./helpers');

describe('validateEmail', () => {
    test('валидный email: простой', () => {
        expect(validateEmail('user@example.com')).toBe(true);
    });

    test('валидный email: с поддоменом', () => {
        expect(validateEmail('user@mail.co.uk')).toBe(true);
    });

    test('невалидный email: без "@"', () => {
        expect(validateEmail('userexample.com')).toBe(false);
    });

    test('невалидный email: с пробелами', () => {
        expect(validateEmail('user @example.com')).toBe(false);
    });

    test('невалидный email: без домена', () => {
        expect(validateEmail('user@')).toBe(false);
    });
});

describe('validateUsername', () => {
    test('валидный username: буквы и цифры', () => {
        expect(validateUsername('user123')).toBe(true);
    });

    test('валидный username: с нижним подчёркиванием', () => {
        expect(validateUsername('user_name')).toBe(true);
    });

    test('невалидный username: начинается с цифры', () => {
        expect(validateUsername('1username')).toBe(false);
    });

    test('невалидный username: содержит спецсимволы', () => {
        expect(validateUsername('user!name')).toBe(false);
    });

    test('невалидный username: пустая строка', () => {
        expect(validateUsername('')).toBe(false);
    });
});
