const express = require('express');
const router = express.Router();
const profilesController = require('../controllers/profilesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Получить свой профиль (любой авторизованный пользователь)
router.get('/me', authMiddleware(null), profilesController.getMyProfile);

// Обновить свой профиль (любой авторизованный пользователь)
router.put('/me', authMiddleware(null), profilesController.updateMyProfile);

// Получить профиль другого пользователя по ID
router.get('/:id', authMiddleware(null, false), profilesController.getProfileById);

// Обновить любой профиль (только админ)
router.put('/:id', authMiddleware('admin'), profilesController.updateAnyProfile);

module.exports = router;