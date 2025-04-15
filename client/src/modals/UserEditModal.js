import React, { useContext, useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { updateAnyProfile, updateProfile, updateUser } from "../api";
import { Context } from "../index";
import DeleteConfirmModal from './DeleteConfirmModal';

function UserEditModal({ show, onHide, user, onAccountDeleted }) {
    const originalUser = user.user;
    const originalProfile = user.profile;
    const { user: userStore } = useContext(Context);
    const isCurrentUser = userStore.user.id === originalUser.id;
    const [name, setName] = useState(originalProfile.name);
    const [username, setUsername] = useState(originalUser.username);
    const [email, setEmail] = useState(originalUser.email);
    const [isAdmin, setIsAdmin] = useState(originalUser.role === 'admin');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [bio, setBio] = useState(originalProfile.bio);
    const [socialMediaLink, setSocialMediaLink] = useState(originalProfile.social_media_link);
    const [photo, setPhoto] = useState(null);
    const [removePhoto, setRemovePhoto] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            setErrorMessage('Имя не должно быть пустым');
            return;
        }
        if (!username.trim()) {
            setErrorMessage('Логин не должен быть пустым');
            return;
        }
        if (!email.trim()) {
            setErrorMessage('Email не должен быть пустым');
            return;
        }
        if (newPassword) {
            if (newPassword !== confirmPassword) {
                setErrorMessage('Пароли не совпадают');
                return;
            }
            if (!oldPassword) {
                setErrorMessage('Введите старый пароль для подтверждения');
                return;
            }
        }
        try {
            const isAdminEditing = userStore.user.role === 'admin' && !isCurrentUser;

            // Добавляем проверку изменения роли
            const originalIsAdmin = originalUser.role === 'admin';
            const roleChanged = isAdmin !== originalIsAdmin;

            // Обновление данных пользователя (username, email, пароль, роль)
            if (
                username !== originalUser.username ||
                email !== originalUser.email ||
                newPassword ||
                roleChanged
            ) {
                const updateData = {
                    username,
                    email,
                };
                if (newPassword) {
                    updateData.password = newPassword;
                    updateData.oldPassword = oldPassword;
                }
                // Только если админ хочет изменить роль
                if (isAdminEditing && isAdmin !== (originalUser.role === 'admin')) {
                    updateData.role = isAdmin ? 'admin' : 'user';
                }
                await updateUser(originalUser.id, updateData);
            }

            // Обновление данных профиля (имя, био, соцсети, фото)
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('bio', typeof bio === 'string' ? bio.trim() : '');
            formData.append('social_media_link', typeof socialMediaLink === 'string' ? socialMediaLink.trim() : '');
            if (photo) {
                formData.append('photo', photo);
            }
            if (removePhoto) {
                formData.append('removePhoto', 'true');
            }
            if (isAdminEditing) {
                await updateAnyProfile(originalUser.id, formData);
            } else {
                await updateProfile(formData);
            }

            setErrorMessage('');
            onHide(true);
        } catch (error) {
            setErrorMessage(error.response?.data?.message ?? 'Ошибка при сохранении. Проверьте данные.');
        }
    };

    const handleCancel = () => {
        setErrorMessage('');
        setRemovePhoto(false);
        onHide(false);
    };

    const handleRemovePhoto = () => {
        setRemovePhoto(true);
        setPhoto(null);
    };

    return (
        <Modal
            show={show}
            onHide={handleCancel}
            backdrop="static"
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Редактировать профиль</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Блок с основной информацией */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Имя</Form.Label>
                                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Логин</Form.Label>
                                <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Email и ссылка на соцсети */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Ссылка на соцсети</Form.Label>
                                <Form.Control type="text" value={socialMediaLink} onChange={(e) => setSocialMediaLink(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Блок с паролями */}
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Старый пароль</Form.Label>
                                <Form.Control type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Новый пароль</Form.Label>
                                <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Подтвердите пароль</Form.Label>
                                <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Описание и фото */}
                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Описание</Form.Label>
                                <Form.Control as="textarea" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Фото</Form.Label>
                                <Form.Control type="file" accept="image/*" name="photo" onChange={(e) => setPhoto(e.target.files[0])} />
                            </Form.Group>
                            {originalProfile.photo_url && !removePhoto && (
                                <Button variant="link" onClick={handleRemovePhoto} className="mt-2">
                                    Удалить текущее фото
                                </Button>
                            )}
                            {removePhoto && (
                                <div className="mt-2" style={{ color: 'red' }}>
                                    Фото будет удалено после сохранения
                                </div>
                            )}
                        </Col>
                    </Row>
                </Form>
                {errorMessage && (
                    <div className="mt-3" style={{ color: 'red', textAlign: 'center' }}>
                        {errorMessage}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Form.Group controlId="isAdminCheckbox" className="me-auto">
                    <Form.Check
                        type="checkbox"
                        label="Админ"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                        disabled={userStore.user.role !== 'admin'}
                    />
                </Form.Group>

                {(isCurrentUser || userStore.user.role === 'admin') && (
                    <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                        Удалить аккаунт
                    </Button>
                )}
                <Button variant="secondary" onClick={handleCancel}>Отмена</Button>
                <Button variant="success" onClick={handleSave}>Сохранить</Button>

            </Modal.Footer>
            <DeleteConfirmModal
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                onDeleteSuccess={onAccountDeleted}
                userId={isCurrentUser ? null : originalUser.id}
            />
        </Modal>
    );
}

export default UserEditModal;