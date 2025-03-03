import React, { useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./UserPage.css";
import { BEATS_ROUTE } from "../utils/consts";
import AudioList from "../components/AudioList";
import { Context } from "../index";

function UserPage() {
    const navigate = useNavigate();
    const { username } = useParams();
    const { user } = useContext(Context);

    // Если URL '/profiles/me' или username совпадает с текущим пользователем – это мой профиль
    const isOwnProfile = username === "me" || username === user.username;

    const handleBackClick = () => {
        navigate(BEATS_ROUTE);
    };

    const handleEditClick = () => {
        // Логика для открытия/редактирования профиля
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
                                        src="https://dummyimage.com/500x500"
                                        alt="Аранжировка"
                                        className="user-page__beat-image"
                                    />
                                </div>
                            </Col>
                            <Col md={6} className="user-page__info-section">
                                <Card.Body className="d-flex flex-column h-100 justify-content-center">
                                    <Card.Title className="user-page__title">Имя музыканта</Card.Title>
                                    <Card.Text className="user-page__author">@Имя пользователя</Card.Text>
                                    <Card.Text className="user-page__description">
                                        Это описание или биография музыканта, которая описана здесь.
                                    </Card.Text>
                                    <div className="user-page__button-section">
                                        <Button
                                            className="user-page__back-button"
                                            variant="danger"
                                            onClick={handleBackClick}
                                        >
                                            Назад
                                        </Button>
                                        {isOwnProfile ? (
                                            <Button
                                                className="user-page__edit-button"
                                                variant="warning"
                                                onClick={handleEditClick}
                                            >
                                                Изменить
                                            </Button>
                                        ) : (
                                            <Button
                                                className="user-page__buy-button"
                                                variant="primary"
                                                href="#"
                                                target="_blank"
                                            >
                                                Связаться
                                            </Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="audio-list-container">
                    <AudioList />
                </div>
            </div>
        </div>
    );
}

export default UserPage;