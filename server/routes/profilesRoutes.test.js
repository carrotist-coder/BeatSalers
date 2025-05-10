const request = require('supertest');
const app = require('./app.js.bak');

describe('Profiles Routes', () => {
    test('GET /profiles/me — отказ без авторизации', async () => {
        const res = await request(app).get('/profiles/me');
        expect(res.statusCode).toBe(401);
    });

    test('GET /profiles/unknownuser — профиль не найден', async () => {
        const res = await request(app).get('/profiles/unknownuser');
        expect([404, 400]).toContain(res.statusCode);
    });

    test('PUT /profiles/me — отказ без токена', async () => {
        const res = await request(app)
            .put('/profiles/me')
            .send({ bio: 'Test bio' });
        expect(res.statusCode).toBe(401);
    });
});
