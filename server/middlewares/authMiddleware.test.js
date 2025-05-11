const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');

process.env.SECRET_KEY = 'test_secret_key';

// Тестовое приложение
const appFactory = (middleware) => {
    const app = express();
    app.get('/protected', middleware, (req, res) => {
        res.json({ message: 'Доступ разрешён', user: req.user });
    });
    return app;
};

describe('authMiddleware', () => {
    const validToken = jwt.sign({ id: 1, role: 'USER' }, process.env.SECRET_KEY);
    const invalidToken = 'invalid.token.value';

    test('Доступ без авторизации (requireAuth = false)', async () => {
        const app = appFactory(authMiddleware(null, false));
        const res = await request(app).get('/protected');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Доступ разрешён');
    });

    test('Отказ при отсутствии токена (requireAuth = true)', async () => {
        const app = appFactory(authMiddleware(null));
        const res = await request(app).get('/protected');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Не авторизован');
    });

    test('Валидный токен даёт доступ (любая роль)', async () => {
        const app = appFactory(authMiddleware(null));
        const res = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${validToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.user.id).toBe(1);
    });

    test('Недопустимая роль -> 403', async () => {
        const app = appFactory(authMiddleware('ADMIN'));
        const res = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${validToken}`);
        expect(res.statusCode).toBe(403);
        expect(res.body.message).toBe('Нет доступа');
    });

    test('Невалидный токен -> 401', async () => {
        const app = appFactory(authMiddleware(null));
        const res = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${invalidToken}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Не авторизован');
    });
});
