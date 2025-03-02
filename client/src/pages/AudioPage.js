import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./AudioPage.css";

function AudioPage() {
    return (
        <div className="audio-page">
            <div className="audio-page__blurred-background"></div>
            <Container className="audio-page__content-container">
                <Row className="h-100 align-items-center">
                    <Col md={6} className="audio-page__image-section">
                        <img
                            src="https://dummyimage.com/500x500"
                            alt="Аранжировка"
                            className="audio-page__beat-image"
                        />
                    </Col>
                    <Col md={6} className="audio-page__info-section">
                        <Card.Body className="d-flex flex-column h-100 justify-content-center">
                            <Card.Title className="audio-page__title">Название аранжировки</Card.Title>
                            <Card.Text className="audio-page__author">@Имя пользователя</Card.Text>
                            <Card.Text className="audio-page__description">
                                Это описание аранжировки. Как она создавалась, как она может быть полезна.
                            </Card.Text>
                            <Card.Text className="audio-page__additional-info">
                                <strong>Стиль: </strong>Хип-хоп<br />
                                <strong>BPM: </strong>128
                            </Card.Text>
                            <audio controls className="audio-page__player">
                                <source
                                    src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                                    type="audio/mpeg"
                                />
                                Ваш браузер не поддерживает элемент audio.
                            </audio>
                            <div className="audio-page__buy-section">
                                <span className="audio-page__price-tag">100 BYN</span>
                                <Button
                                    className="audio-page__buy-button"
                                    variant="success"
                                    href="mailto:email@example.com?subject=Покупка%20аранжировки&body=Я%20хотел%20бы%20купить%20эту%20аранжировку."
                                    target="_blank"
                                >
                                    Купить
                                </Button>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AudioPage;