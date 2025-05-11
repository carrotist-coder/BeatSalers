import { login, check, register } from './UserAPI';
import { $authHost, $host } from './index';
import { jwtDecode } from 'jwt-decode';

// Мокаем зависимости
jest.mock('./index', () => ({
    $host: {
        post: jest.fn()
    },
    $authHost: {
        get: jest.fn()
    }
}));

jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn()
}));

// Мокаем localStorage
beforeEach(() => {
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
    jest.clearAllMocks();
});

describe('login', () => {
    it('успешный вход: сохраняет токен и возвращает расшифровку', async () => {
        const fakeToken = 'fake.jwt.token';
        const userData = { id: 1, username: 'testuser' };

        $host.post.mockResolvedValue({ data: { token: fakeToken } });
        jwtDecode.mockReturnValue(userData);

        const result = await login('testuser', 'password123');

        expect($host.post).toHaveBeenCalledWith('/auth/login', {
            username: 'testuser',
            password: 'password123'
        });
        expect(localStorage.setItem).toHaveBeenCalledWith('token', fakeToken);
        expect(jwtDecode).toHaveBeenCalledWith(fakeToken);
        expect(result).toEqual(userData);
    });

    it('ошибка входа: выбрасывает исключение', async () => {
        const error = new Error('Invalid credentials');
        error.response = { data: 'Invalid credentials' };
        $host.post.mockRejectedValue(error);

        await expect(login('wrong', 'wrong')).rejects.toThrow('Invalid credentials');
    });
});

describe('check', () => {
    it('успешная проверка токена', async () => {
        const fakeToken = 'checked.jwt.token';
        const userData = { id: 1, role: 'admin' };

        $authHost.get.mockResolvedValue({ data: { token: fakeToken } });
        jwtDecode.mockReturnValue(userData);

        const result = await check();

        expect($authHost.get).toHaveBeenCalledWith('/auth/check');
        expect(localStorage.setItem).toHaveBeenCalledWith('token', fakeToken);
        expect(jwtDecode).toHaveBeenCalledWith(fakeToken);
        expect(result).toEqual(userData);
    });

    it('ошибка при проверке токена', async () => {
        const error = new Error('Token expired');
        error.response = { data: 'Token expired' };
        $authHost.get.mockRejectedValue(error);

        await expect(check()).rejects.toThrow('Token expired');
    });
});

describe('register', () => {
    it('успешная регистрация пользователя', async () => {
        const fakeToken = 'register.jwt.token';
        const userData = { id: 10, username: 'newuser' };

        $host.post.mockResolvedValue({ data: { token: fakeToken } });
        jwtDecode.mockReturnValue(userData);

        const result = await register('newuser', 'pass123', 'new@user.com');

        expect($host.post).toHaveBeenCalledWith('/auth/register', {
            username: 'newuser',
            password: 'pass123',
            email: 'new@user.com',
            role: 'user'
        });
        expect(localStorage.setItem).toHaveBeenCalledWith('token', fakeToken);
        expect(jwtDecode).toHaveBeenCalledWith(fakeToken);
        expect(result).toEqual(userData);
    });

    it('ошибка при регистрации', async () => {
        const error = new Error('User already exists');
        error.response = { data: 'User already exists' };
        $host.post.mockRejectedValue(error);

        await expect(register('user', 'pass', 'email')).rejects.toThrow('User already exists');
    });
});
