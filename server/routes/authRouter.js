const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Аутентификация пользователя (получение токена)
router.post('/login', authController.login);

// Регистрация нового пользователя
router.post('/register', authController.register);

// Проверка токена (получение данных текущего пользователя)
router.get('/check', authController.check);

module.exports = router;