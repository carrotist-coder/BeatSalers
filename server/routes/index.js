const express = require('express');
const authRouter = require('./authRouter');
const usersRouter = require('./usersRouter');
const profilesRouter = require('./profilesRouter');
const beatsRouter = require('./beatsRouter');
const router = express.Router();

// Роуты аутентификации
router.use('/auth', authRouter);

// Роуты пользователей
router.use('/users', usersRouter);

// Роуты профилей
router.use('/profiles', profilesRouter);

// Роуты битов
router.use('/beats', beatsRouter);

module.exports = router;