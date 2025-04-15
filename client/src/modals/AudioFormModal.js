import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Col, Row } from 'react-bootstrap';
import { createBeat, updateBeat } from '../api';
import DeleteAudioConfirmModal from './DeleteAudioConfirmModal';
import { useNavigate } from 'react-router-dom';
import {BEATS_ROUTE, STYLES} from '../utils/consts';

function AudioFormModal({ show, onHide, beat = null, onUpdated, onAdded, sellerUsername = null }) {
    const isEditMode = !!beat;
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [style, setStyle] = useState('');
    const [bpm, setBpm] = useState('');
    const [price, setPrice] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            setTitle(beat.title || '');
            setDescription(beat.description || '');
            setStyle(beat.style || '');
            setBpm(beat.bpm ?? '');
            setPrice(beat.price ?? '');
        } else {
            setTitle('');
            setDescription('');
            setStyle('');
            setBpm('');
            setPrice('');
            setAudioFile(null);
            setImageFile(null);
            setRemoveImage(false);
            setErrorMessage('');
        }
    }, [beat, show]);

    const handleSubmit = async () => {
        const validationErrors = [];

        if (!title.trim()) validationErrors.push('Название');
        if (!style.trim()) validationErrors.push('Стиль');
        if (!bpm) validationErrors.push('BPM');
        if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
            validationErrors.push('Цена');
        }
        if (!isEditMode && !audioFile) validationErrors.push('Аудиофайл');

        if (validationErrors.length > 0) {
            setErrorMessage(`Заполните обязательные поля: ${validationErrors.join(', ')}`);
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

        if (sellerUsername) {
            formData.append('sellerUsername', sellerUsername);
        }


        try {
            if (isEditMode) {
                await updateBeat(beat.id, formData);
            } else {
                await createBeat(formData);
            }
            onUpdated?.(); // для обновления списка
            onAdded?.();   // для перезагрузки страницы
            onHide();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Ошибка сохранения');
        }
    };

    const handleDeleteSuccess = () => {
        onHide();
        navigate(BEATS_ROUTE);
    };

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEditMode ? 'Редактировать аранжировку' : 'Добавить аранжировку'}
                    </Modal.Title>
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
                                    <Form.Control
                                        as="select"
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                    >
                                        <option value="" disabled={true}>Выберите стиль...</option>
                                        {STYLES.map((style, index) => (
                                            <option key={index} value={style}>{style}</option>
                                        ))}
                                    </Form.Control>
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
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    setImageFile(e.target.files[0]);
                                    setRemoveImage(false);
                                }}
                            />
                            {isEditMode && beat.photo_url && !removeImage && (
                                <Button
                                    variant="link"
                                    onClick={() => setRemoveImage(true)}
                                    className="mt-2"
                                >
                                    Удалить текущую обложку
                                </Button>
                            )}
                            {removeImage && (
                                <div className="mt-2" style={{ color: 'red' }}>
                                    Обложка будет удалена после сохранения
                                </div>
                            )}
                        </Form.Group>
                        {errorMessage && <div className="text-danger">{errorMessage}</div>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {isEditMode && (
                        <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                            Удалить аранжировку
                        </Button>
                    )}
                    <Button variant="secondary" onClick={onHide}>Отмена</Button>
                    <Button variant="success" onClick={handleSubmit}>
                        {isEditMode ? 'Сохранить' : 'Добавить'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {isEditMode && (
                <DeleteAudioConfirmModal
                    show={showDeleteConfirm}
                    onHide={() => setShowDeleteConfirm(false)}
                    beatId={beat.id}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            )}
        </>
    );
}

export default AudioFormModal;
