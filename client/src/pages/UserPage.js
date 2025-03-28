import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./UserPage.css";
import { baseURL, getFullUserByUsername, getMyProfile } from '../api';
import AudioList from "../components/AudioList";
import {DEFAULT_AVATAR_IMAGE_FILENAME, DEFAULT_PATH, MAIN_ROUTE} from "../utils/consts";
import NotFoundPage from "./NotFoundPage";
import { Context } from "../index";
import {formatDate, truncateText} from "../utils/helpers";
import {getAverageColor, getTextColor} from "../utils/colorHelpers";
import UserEditModal from "../modals/UserEditModal";

function UserPage() {
    const navigate = useNavigate();
    const { username } = useParams();
    const { user: userStore } = useContext(Context);
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [isUserNotFound, setUserNotFound] = useState(false);
    const isMyProfile = !username; // Для маршрута /me параметр username будет undefined
    const [bgColor, setBgColor] = useState('#ffffff');
    const [textColor, setTextColor] = useState('#000');
    const [isEditModalOpen, setEditModalOpen] = useState(false); // Состояние для модального окна

    const fetchUserData = async () => {
        setLoading(true);
        try {
            let data;
            if (isMyProfile) {
                data = await getMyProfile();
            } else {
                data = await getFullUserByUsername(username);
            }
            setUser(data);
        } catch (error) {
            if (error.response?.status === 404) {
                setUserNotFound(true);
            } else {
                console.error('Ошибка при получении данных пользователя:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [username, isMyProfile]);

    const isCurrentUser = userStore.isAuth && userStore.user.id === user?.user?.id;

    const handleImageLoad = (e) => {
        const img = e.target;
        const { r, g, b } = getAverageColor(img);
        const computedBgColor = `rgb(${r}, ${g}, ${b})`;
        setBgColor(computedBgColor);
        setTextColor(getTextColor(r, g, b));
    };

    const handleEditClick = () => {
        setEditModalOpen(true);
    };

    const handleModalClose = (shouldReload) => {
        setEditModalOpen(false);
        if (shouldReload) {
            fetchUserData();
        }
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (isUserNotFound) {
        return <NotFoundPage />;
    }

    if (!user) {
        return <div>Произошла ошибка</div>;
    }

    const photoUrl = user.profile.photo_url ? baseURL + user.profile.photo_url : baseURL + DEFAULT_PATH + '/' + DEFAULT_AVATAR_IMAGE_FILENAME;

    return (
        <div className="user-page">
            <div className="scrollable-content">
                <div className="main-content">
                    <div className="user-page__blurred-background" style={{backgroundColor: bgColor}}></div>
                    <Container className="user-page__content-container">
                        <Row className="h-100 align-items-center">
                            <Col md={6} className="user-page__image-section">
                                <div className="user-page__image-wrapper">
                                    <img
                                        crossOrigin="anonymous"
                                        src={photoUrl}
                                        alt="Профиль"
                                        className="user-page__beat-image"
                                        onLoad={handleImageLoad}
                                    />
                                </div>
                            </Col>
                            <Col md={6} className="user-page__info-section" style={{ color: textColor }}>
                                <Card.Body className="d-flex flex-column h-100 justify-content-center">
                                    <Card.Title className="user-page__title">{user.profile.name}</Card.Title>
                                    <Card.Text className="user-page__author">@{user.user.username}</Card.Text>
                                    <Card.Text className="user-page__description">
                                        <strong>Описание: </strong><br/> {truncateText(user.profile.bio, 0)}
                                    </Card.Text>
                                    <div><strong>Создан: </strong>{formatDate(user.user.created_at)}</div>
                                    <div className="user-page__additional-text"><strong>Изменён: </strong>{formatDate(user.user.updated_at)}</div>
                                    <div className="user-page__button-section">
                                        <Button
                                            className="user-page__button"
                                            variant="danger"
                                            onClick={() => navigate(MAIN_ROUTE)}
                                        >
                                            Назад
                                        </Button>
                                        <Button
                                            className="user-page__button"
                                            variant={user.profile.social_media_link ? "primary" : "secondary"}
                                            href={user.profile.social_media_link}
                                            target="_blank"
                                            disabled={!user.profile.social_media_link}
                                        >
                                            Соцсети
                                        </Button>
                                        {isCurrentUser && (
                                            <Button
                                                className="user-page__button"
                                                variant="warning"
                                                onClick={handleEditClick}
                                            >
                                                Редактировать
                                            </Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="audio-list-container">
                    <AudioList beats={user.beats}/>
                </div>
            </div>
            <UserEditModal
                show={isEditModalOpen}
                onHide={handleModalClose}
                user={user}
            />
        </div>
    );
}

export default UserPage;