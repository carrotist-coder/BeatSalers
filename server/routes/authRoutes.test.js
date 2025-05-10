const request = require('supertest');
const app = require('./app.js.bak');

describe('Auth Routes', () => {
    test('POST /auth/register — регистрация нового пользователя', async () => {
        const res = await request(app).post('/auth/register').send({
            username: 'testuser123',
            email: 'testuser123@example.com',
            password: 'password123'
        });
        expect([200, 201, 400]).toContain(res.statusCode); // 400 если такой пользователь уже есть
    });

    test('POST /auth/login — ошибка при неверных данных', async () => {
        const res = await request(app).post('/auth/login').send({
            email: 'wrong@example.com',
            password: 'invalidpass'
        });
        expect(res.statusCode).toBe(400);
    });

    test('GET /auth/check — без токена возвращает 403', async () => {
        const res = await request(app).get('/auth/check');
        expect(res.statusCode).toBe(403);
    });
});
