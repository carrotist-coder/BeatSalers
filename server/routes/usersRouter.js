const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middlewares/authMiddleware');

// Получить всех пользователей (доступно всем)
router.get('/', authMiddleware(null, false), usersController.getUsers);

// Получить информацию о текущем пользователе (только авторизованные)
router.get('/me', authMiddleware(null), usersController.getMyProfile);

// Добавить нового пользователя
router.post('/', authMiddleware(null), usersController.addUser);

// Обновить информацию о пользователе:
// - Админ может обновить любого пользователя
// - Пользователь может обновить только себя
router.put('/:id', authMiddleware(null), usersController.updateUser);

// Удалить пользователя (только админ)
router.delete('/:id', authMiddleware('admin'), usersController.deleteUser);

// Получить пользователя по полю (например, username или email) (только админ)
router.get('/:field/:value', authMiddleware('admin'), usersController.getUserByField);

module.exports = router;