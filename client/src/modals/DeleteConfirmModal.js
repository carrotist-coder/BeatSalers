import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { deleteMyProfile } from '../api';

function DeleteConfirmModal({ show, onHide, onDeleteSuccess }) {
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleDelete = async () => {
        try {
            await deleteMyProfile(password);
            onHide(); // Закрыть модальное окно
            onDeleteSuccess(); // Выполнить выход и перенаправление
        } catch (error) {
            setErrorMessage('Неверный пароль или ошибка при удалении');
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Подтверждение удаления</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Введите текущий пароль для подтверждения:</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                </Form>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Отмена</Button>
                <Button variant="danger" onClick={handleDelete}>Удалить аккаунт</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteConfirmModal;