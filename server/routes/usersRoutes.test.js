const request = require('supertest');
const app = require('./app.js.bak');

describe('Users Routes', () => {
    test('GET /users — доступен без авторизации', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(200);
    });

    test('GET /users/me — отказ без авторизации', async () => {
        const res = await request(app).get('/users/me');
        expect(res.statusCode).toBe(401);
    });

    test('GET /users/:username — не найден', async () => {
        const res = await request(app).get('/users/nonexistentuser');
        expect([404, 400]).toContain(res.statusCode);
    });
});
