require('dotenv').config();
const express = require('express');
const initializeDatabase = require('./db');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads', 'profiles');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const routes = require('./routes/index');
const db = initializeDatabase();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/', routes);

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Внутренняя ошибка сервера',
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Ошибка при закрытии базы данных:', err.message);
        } else {
            console.log('Подключение к базе данных закрыто');
        }
        process.exit(0);
    });
});