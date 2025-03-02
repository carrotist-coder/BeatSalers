import React, { useContext, useState } from 'react';
import { Button, Card, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { register, login } from "../http/UserAPI"; // Импортируем методы для логина и регистрации
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { MAIN_ROUTE } from "../utils/consts";

const Auth = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    // Состояния для формы
    const [loginName, setLoginName] = useState('');
    const [passwordName, setPasswordName] = useState('');
    const [email, setEmail] = useState(''); // Добавляем состояние для email
    const [errorMessage, setErrorMessage] = useState(''); // Состояние для ошибки
    const [isLoginMode, setIsLoginMode] = useState(true); // Состояние для выбора режима (логин/регистрация)

    // Метод для входа в систему
    const signIn = async () => {
        try {
            const data = await login(loginName, passwordName);
            user.setUser(data);
            user.setIsAuth(true);
            navigate(MAIN_ROUTE);
        } catch (e) {
            setErrorMessage(e.response?.data?.message || 'Произошла ошибка при авторизации');
        }
    };

    // Метод для регистрации нового пользователя
    const signUp = async () => {
        try {
            await register(loginName, passwordName, email); // Передаем email в метод регистрации
            setErrorMessage(''); // Очищаем сообщение об ошибке
            setIsLoginMode(true); // После успешной регистрации переходим в режим логина
            alert('Регистрация успешно завершена! Теперь вы можете войти.');
            setLoginName('');
            setPasswordName('');
        } catch (e) {
            setErrorMessage(e.response?.data?.message || 'Произошла ошибка при регистрации');
        }
    };

    // Метод для переключения между логином и регистрацией
    const toggleMode = () => {
        setLoginName(''); // Очищаем поле логина
        setPasswordName(''); // Очищаем поле пароля
        setEmail(''); // Очищаем поле email
        setErrorMessage(''); // Очищаем сообщение об ошибке
        setIsLoginMode(!isLoginMode); // Переключаем режим
    };

    const goBack = () => {
        navigate(MAIN_ROUTE);
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{
                width: 600,
                backgroundColor: 'rgba(255, 255, 255, 0.9)', // Прозрачность 70%
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' // Добавляем тень для лучшего визуального эффекта
            }} className="p-5">
                <h2 className="m-auto">{isLoginMode ? 'Авторизация' : 'Регистрация'}</h2>
                <Form className="d-flex flex-column">
                    {/* Поле для логина или имени пользователя */}
                    <Form.Control
                        className="mt-3"
                        placeholder={isLoginMode ? "Введите логин" : "Введите имя пользователя"}
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        required
                    />
                    {/* Поле для пароля */}
                    <Form.Control
                        type="password"
                        className="mt-3"
                        placeholder="Введите пароль"
                        value={passwordName}
                        onChange={(e) => setPasswordName(e.target.value)}
                        required
                    />
                    {/* Поле для email (только в режиме регистрации) */}
                    {!isLoginMode && (
                        <Form.Control
                            type="email"
                            className="mt-3"
                            placeholder="Введите email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    )}
                    {/* Отображение ошибки */}
                    {errorMessage && (
                        <div className="mt-3" style={{ color: 'red', textAlign: 'center' }}>
                            {errorMessage}
                        </div>
                    )}
                    {/* Кнопки */}
                    <Row className="d-flex justify-content-between align-items-center">
                        <Button
                            className="mt-3 flex-grow-1 w-auto mx-2"
                            variant={"outline-danger"}
                            onClick={goBack}
                        >
                            Назад
                        </Button>
                        <Button
                            className="mt-3 flex-grow-1 w-auto mx-2"
                            variant={"outline-success"}
                            onClick={isLoginMode ? signIn : signUp} // Вызываем соответствующий метод
                        >
                            {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
                        </Button>
                    </Row>
                    {/* Переключение между логином и регистрацией */}
                    <Row className="mt-3 d-flex justify-content-center">
                        <Button
                            variant="link"
                            onClick={toggleMode}
                            style={{ padding: 0 }}
                        >
                            {isLoginMode
                                ? 'Нет аккаунта? Зарегистрироваться'
                                : 'Уже есть аккаунт? Войти'}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;