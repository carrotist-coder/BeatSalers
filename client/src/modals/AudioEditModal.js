import React, { useState } from 'react';
import {Modal, Form, Button, Col, Row} from 'react-bootstrap';

function AudioEditModal({ show, onHide, beat, onUpdated }) {
    const [title, setTitle] = useState(beat.title);
    const [description, setDescription] = useState(beat.description);
    const [style, setStyle] = useState(beat.style);
    const [bpm, setBpm] = useState(beat.bpm);
    const [price, setPrice] = useState(beat.price);
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        if (!title || !style || !price) {
            setErrorMessage('Заполните обязательные поля');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('style', style);
        formData.append('bpm', bpm);
        formData.append('price', price);
        if (audioFile) formData.append('audio', audioFile);
        if (imageFile) formData.append('image', imageFile);
        if (removeImage) formData.append('removeImage', 'true');

        try {
            onUpdated();
            onHide();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Ошибка сохранения');
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Редактировать аранжировку</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Название</Form.Label>
                        <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Описание</Form.Label>
                        <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Form.Group>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group>
                                <Form.Label>Стиль</Form.Label>
                                <Form.Control value={style} onChange={(e) => setStyle(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>BPM</Form.Label>
                                <Form.Control type="number" value={bpm} min="0" onChange={(e) => setBpm(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Цена (BYN)</Form.Label>
                                <Form.Control type="number" value={price} min="0" onChange={(e) => setPrice(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Аудиофайл</Form.Label>
                        <Form.Control type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Обложка</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                        {beat.photo_url && !removeImage && (
                            <Button variant="link" onClick={() => setRemoveImage(true)}>
                                Удалить текущую обложку
                            </Button>
                        )}
                    </Form.Group>
                    {errorMessage && <div className="text-danger">{errorMessage}</div>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Отмена</Button>
                <Button variant="success" onClick={handleSubmit}>Сохранить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AudioEditModal;