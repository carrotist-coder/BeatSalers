import React, { useState, useEffect } from 'react';
import UserItem from './UserItem';
import { getUsers } from '../api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                console.error('Ошибка при получении пользователей:', error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="user-list">
            <h3 className="list__title">Музыканты:</h3>
            {users.map(user => (
                <UserItem key={user.id} user={user} />
            ))}
        </div>
    );
};

export default UserList;