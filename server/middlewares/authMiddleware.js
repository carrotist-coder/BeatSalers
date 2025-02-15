const jwt = require('jsonwebtoken');

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
            return;
        }

        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({ message: 'Не авторизован' });
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Некорректный токен' });
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;

            if (role && decoded.role !== role) {
                return res.status(403).json({ message: 'Нет доступа' });
            }

            next();
        } catch (e) {
            res.status(401).json({ message: 'Не авторизован' });
        }
    };
};