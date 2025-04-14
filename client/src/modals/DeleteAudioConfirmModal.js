import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { deleteBeat } from '../api';

function DeleteAudioConfirmModal({ show, onHide, beatId, onDeleteSuccess }) {
    const handleDelete = async () => {
        try {
            await deleteBeat(beatId);
            onHide();
            onDeleteSuccess();
        } catch (error) {
            console.error('Ошибка при удалении аранжировки:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Удалить аранжировку</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Вы уверены, что хотите удалить эту аранжировку? Это действие необратимо.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Отмена</Button>
                <Button variant="danger" onClick={handleDelete}>Удалить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteAudioConfirmModal;
