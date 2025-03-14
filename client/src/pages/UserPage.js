import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./UserPage.css";
import { baseURL, getFullUserByUsername, getMyProfile } from '../api';
import AudioList from "../components/AudioList";
import {MAIN_ROUTE, LONG_TEXT_MAX_LENGTH} from "../utils/consts";
import NotFoundPage from "./NotFoundPage";
import { Context } from "../index";
import {formatDate, truncateText} from "../utils/helpers";

function UserPage() {
    const navigate = useNavigate();
    const { username } = useParams();
    const { user: userStore } = useContext(Context);
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [isUserNotFound, setUserNotFound] = useState(false);
    const isMyProfile = !username; // Для маршрута /me параметр username будет undefined

    useEffect(() => {
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
        fetchUserData();
    }, [username, isMyProfile]);

    const isCurrentUser = userStore.isAuth && userStore.user.id === user?.user?.id;

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (isUserNotFound) {
        return <NotFoundPage />;
    }

    if (!user) {
        return <div>Произошла ошибка</div>;
    }

    const photoUrl = user.profile.photo_url ? baseURL + user.profile.photo_url : 'https://dummyimage.com/500x500';

    const handleEditClick = () => {
        // Логика для редактирования профиля
        // (будет дописываться)
    };

    return (
        <div className="user-page">
            <div className="scrollable-content">
                <div className="main-content">
                    <div className="user-page__blurred-background"></div>
                    <Container className="user-page__content-container">
                        <Row className="h-100 align-items-center">
                            <Col md={6} className="user-page__image-section">
                                <div className="user-page__image-wrapper">
                                    <img
                                        src={photoUrl}
                                        alt="Профиль"
                                        className="user-page__beat-image"
                                    />
                                </div>
                            </Col>
                            <Col md={6} className="user-page__info-section">
                                <Card.Body className="d-flex flex-column h-100 justify-content-center">
                                    <Card.Title className="user-page__title">{user.profile.name}</Card.Title>
                                    <Card.Text className="user-page__author">@{user.user.username}</Card.Text>
                                    <Card.Text className="user-page__description">
                                        <strong>Описание: </strong><br/> {truncateText(user.profile.bio, LONG_TEXT_MAX_LENGTH)}
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
        </div>
    );
}

export default UserPage;