const express = require('express');
const router = express.Router();
const beatsController = require('../controllers/beatsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Получить все биты (доступно всем)
router.get('/', authMiddleware(null, false), beatsController.getAllBeats);

// Получить бит по ID (доступно всем)
router.get('/:id', authMiddleware(null, false), beatsController.getBeatById);

// Добавить новый бит
router.post('/', authMiddleware(null), beatsController.addBeat);

// Обновить бит (только владелец или админ)
router.put('/:id', authMiddleware(null), beatsController.updateBeat);

// Удалить бит (только владелец или админ)
router.delete('/:id', authMiddleware(null), beatsController.deleteBeat);

module.exports = router;