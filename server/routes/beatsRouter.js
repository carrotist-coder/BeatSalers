const express = require('express');
const router = express.Router();
const beatsController = require('../controllers/beatsController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// Получить все биты (доступно всем)
router.get('/', authMiddleware(null, false), beatsController.getAllBeats);

// Получить бит по ID (доступно всем)
router.get('/:id', authMiddleware(null, false), beatsController.getBeatById);

// Добавить новый бит
router.post('/', authMiddleware(null), upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'image', maxCount: 1 }]), beatsController.addBeat);

// Обновить бит (только владелец или админ)
router.put('/:id', authMiddleware(null), upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'image', maxCount: 1 }]), beatsController.updateBeat);

// Удалить бит (только владелец или админ)
router.delete('/:id', authMiddleware(null), beatsController.deleteBeat);

module.exports = router;