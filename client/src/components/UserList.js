import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import UserItem from './UserItem';
import { getUsers } from '../api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [minBeats, setMinBeats] = useState('');
    const [maxBeats, setMaxBeats] = useState('');
    const [sortOption, setSortOption] = useState('');

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

    const filteredAndSortedUsers = users
        .filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (minBeats === '' || user.beat_count >= parseInt(minBeats)) &&
            (maxBeats === '' || user.beat_count <= parseInt(maxBeats))
        )
        .sort((a, b) => {
            if (sortOption === 'nameAsc') return a.name.localeCompare(b.name);
            if (sortOption === 'nameDesc') return b.name.localeCompare(a.name);
            if (sortOption === 'beatsAsc') return a.beat_count - b.beat_count;
            if (sortOption === 'beatsDesc') return b.beat_count - a.beat_count;
            if (sortOption === 'roleAdmin') return a.role === 'admin' ? -1 : b.role === 'admin' ? 1 : 0;
            return 0;
        });

    return (
        <Container className="user-list">
            <h3 className="list__title">Музыканты:</h3>
            <Card className="p-4 mb-4 search-bar">
                <Form>
                    <Row className="gy-3">
                        <Col xs={12} md={4}>
                            <Form.Group controlId="searchQuery">
                                <Form.Label>Автор</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите имя автора..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={2}>
                            <Form.Group controlId="minBeats">
                                <Form.Label>Мин. аранжировок</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    placeholder="От"
                                    value={minBeats}
                                    onChange={(e) => {
                                        if (e.target.value === '' || Number(e.target.value) >= 0) {
                                            setMinBeats(e.target.value);
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={2}>
                            <Form.Group controlId="maxBeats">
                                <Form.Label>Макс. аранжировок</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    placeholder="До"
                                    value={maxBeats}
                                    onChange={(e) => {
                                        if (e.target.value === '' || Number(e.target.value) >= 0) {
                                            setMaxBeats(e.target.value);
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={4}>
                            <Form.Group controlId="sortOption">
                                <Form.Label>Сортировка</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="">Выберите...</option>
                                    <option value="nameAsc">A-Z</option>
                                    <option value="nameDesc">Z-A</option>
                                    <option value="beatsAsc">Аранжировки ↑</option>
                                    <option value="beatsDesc">Аранжировки ↓</option>
                                    <option value="roleAdmin">Админы</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Card>
            {filteredAndSortedUsers.length === 0 ? (
                <p className="list__title" style={{ color: 'red' }}>
                    <strong>Ничего не найдено</strong>
                </p>
            ) : (
                filteredAndSortedUsers.map(user => <UserItem key={user.id} user={user} />)
            )}
        </Container>
    );
};

export default UserList;