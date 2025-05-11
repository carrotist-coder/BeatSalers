const request = require('supertest');
const app = require('./app.js.bak');

describe('Beats Routes', () => {
    test('GET /beats — доступен без авторизации', async () => {
        const res = await request(app).get('/beats');
        expect(res.statusCode).toBe(200);
    });

    test('GET /beats/:id — запрос несуществующего ID', async () => {
        const res = await request(app).get('/beats/invalid_id');
        expect([400, 404]).toContain(res.statusCode);
    });

    test('POST /beats — отказ без токена', async () => {
        const res = await request(app)
            .post('/beats')
            .send({ title: 'New Beat' });
        expect(res.statusCode).toBe(401);
    });
});
