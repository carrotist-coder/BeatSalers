import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./UserPage.css";
import { getFullUserByUsername } from '../api';
import AudioList from "../components/AudioList";
import { BEATS_ROUTE } from "../utils/consts";
import NotFoundPage from "./NotFoundPage";

function UserPage() {
    const navigate = useNavigate();
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [isUserNotFound, setUserNotFound] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const data = await getFullUserByUsername(username);
                setUser(data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setUserNotFound(true);
                } else {
                    console.error('Ошибка при получении данных пользователя:', error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [username]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (isUserNotFound) {
        return <NotFoundPage />;
    }

    if (!user) {
        return <div>Произошла ошибка</div>;
    }

    const handleBackClick = () => {
        navigate(BEATS_ROUTE);
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
                                        src={user.profile.photo_url || 'https://dummyimage.com/500x500'}
                                        alt="Аранжировка"
                                        className="user-page__beat-image"
                                    />
                                </div>
                            </Col>
                            <Col md={6} className="user-page__info-section">
                                <Card.Body className="d-flex flex-column h-100 justify-content-center">
                                    <Card.Title className="user-page__title">{user.profile.name}</Card.Title>
                                    <Card.Text className="user-page__author">@{user.user.username}</Card.Text>
                                    <Card.Text className="user-page__description">
                                        <strong>Описание: </strong><br/> {user.profile.bio || '(здесь пока ничего нет...)'}
                                    </Card.Text>
                                    <div className="user-page__button-section">
                                        <Button
                                            className="user-page__back-button"
                                            variant="danger"
                                            onClick={handleBackClick}
                                        >
                                            Назад
                                        </Button>
                                        <Button
                                            className="user-page__buy-button"
                                            variant="primary"
                                            href={user.profile.social_media_link || '#'}
                                            target="_blank"
                                        >
                                            Связаться
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="audio-list-container">
                    <AudioList beats={user.beats} />
                </div>
            </div>
        </div>
    );
}

export default UserPage;