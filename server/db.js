const sqlite3 = require('sqlite3').verbose();

const initializeDatabase = () => {
    const db = new sqlite3.Database('database.db', (err) => {
        if (err) {
            console.error('Ошибка при открытии базы данных:', err.message);
        } else {
            console.log('Подключение к базе данных установлено');
        }
    });

    db.serialize(() => {
        // Создаем таблицу Users
        db.run(`CREATE TABLE IF NOT EXISTS users (
                                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                     username TEXT NOT NULL UNIQUE,
                                                     password TEXT NOT NULL,
                                                     email TEXT NOT NULL UNIQUE,
                                                     role TEXT NOT NULL CHECK(role IN ('user', 'admin')),
                                                     created_at TEXT NOT NULL,
                                                     updated_at TEXT NOT NULL
                )`, (err) => {
            if (err) {
                console.error('Ошибка при создании таблицы users:', err.message);
            }
        });

        // Создаем таблицу Beats
        db.run(`CREATE TABLE IF NOT EXISTS beats (
                                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                     title TEXT NOT NULL,
                                                     description TEXT,
                                                     style TEXT NOT NULL,
                                                     bpm INTEGER,
                                                     audio_url TEXT NOT NULL,
                                                     photo_url TEXT,
                                                     price REAL NOT NULL,
                                                     seller_id INTEGER NOT NULL,
                                                     created_at TEXT NOT NULL,
                                                     updated_at TEXT NOT NULL,
                                                     FOREIGN KEY (seller_id) REFERENCES users(id)
                )`, (err) => {
            if (err) {
                console.error('Ошибка при создании таблицы beats:', err.message);
            }
        });

        // Создаем таблицу Profiles
        db.run(`CREATE TABLE IF NOT EXISTS profiles (
                                                             user_id INTEGER UNIQUE,
                                                             name TEXT NOT NULL,
                                                             bio TEXT,
                                                             social_media_link TEXT,
                                                             photo_url TEXT,
                                                             created_at TEXT NOT NULL,
                                                             updated_at TEXT NOT NULL,
                                                             FOREIGN KEY (user_id) REFERENCES users(id)
                )`, (err) => {
            if (err) {
                console.error('Ошибка при создании таблицы profiles:', err.message);
            }
        });
    });

    return db;
}

module.exports = initializeDatabase;
