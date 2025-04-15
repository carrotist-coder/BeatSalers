// Функция для проверки валидности email
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Функция для проверки валидности username
const validateUsername = (username) => {
    const re = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    return re.test(username);
};

module.exports = {
    validateEmail,
    validateUsername
}