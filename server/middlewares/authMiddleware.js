const jwt = require('jsonwebtoken');

module.exports = function (role, requireAuth = true) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
            return;
        }

        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                if (!requireAuth) {
                    return next();
                }
                return res.status(401).json({ message: 'Не авторизован' });
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                if (!requireAuth) {
                    return next();
                }
                return res.status(401).json({ message: 'Некорректный токен' });
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;

            if (role && decoded.role !== role) {
                return res.status(403).json({ message: 'Нет доступа' });
            }

            next();
        } catch (e) {
            if (!requireAuth) {
                return next();
            }
            res.status(401).json({ message: 'Не авторизован' });
        }
    };
};