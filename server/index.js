require('dotenv').config();
const express = require('express');
const initializeDatabase = require('./db');
const cors = require('cors');

const app = express();
const db = initializeDatabase();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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