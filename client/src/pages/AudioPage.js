import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./AudioPage.css";
import {baseURL, getBeatById} from '../api';
import {BEATS_ROUTE, LONG_TEXT_MAX_LENGTH} from "../utils/consts";
import NotFoundPage from "./NotFoundPage";
import {truncateText} from "../utils/helpers";

function AudioPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [beat, setBeat] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [isBeatNotFound, setBeatNotFound] = useState(false);

    useEffect(() => {
        const fetchBeatData = async () => {
            setLoading(true);
            try {
                const data = await getBeatById(id);
                setBeat(data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setBeatNotFound(true);
                } else {
                    console.error('Ошибка при получении данных аранжировки:', error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchBeatData();
    }, [id]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (isBeatNotFound) {
        return <NotFoundPage />;
    }

    if (!beat) {
        return <div>Произошла ошибка</div>;
    }

    const photoUrl = beat.photo_url ? baseURL + beat.photo_url : 'https://dummyimage.com/500x500';
    const audioUrl = baseURL + beat.audio_url;

    const handleBackClick = () => {
        navigate(BEATS_ROUTE);
    };

    return (
        <div className="audio-page">
            <div className="audio-page__blurred-background"></div>
            <Container className="audio-page__content-container">
                <Row className="h-100 align-items-center">
                    <Col md={6} className="audio-page__image-section">
                        <div className="audio-page__image-wrapper">
                            <img
                                src={photoUrl}
                                alt="Аранжировка"
                                className="audio-page__beat-image"
                            />
                            <span className="audio-page__price-tag">{beat.price} BYN</span>
                        </div>
                    </Col>
                    <Col md={6} className="audio-page__info-section">
                        <Card.Body className="d-flex flex-column h-100 justify-content-center">
                            <Card.Title className="audio-page__title">{beat.title}</Card.Title>
                            <Card.Text className="audio-page__author">@{beat.seller_username}</Card.Text>
                            <Card.Text className="audio-page__description">
                                {truncateText(beat.description, LONG_TEXT_MAX_LENGTH)}
                            </Card.Text>
                            <Card.Text className="audio-page__additional-info">
                                <strong>Стиль: </strong>{beat.style}<br />
                                <strong>BPM: </strong>{beat.bpm}
                            </Card.Text>
                            <audio controls className="audio-page__player">
                                <source src={audioUrl} type="audio/mpeg" />
                                Ваш браузер не поддерживает элемент audio.
                            </audio>
                            <div className="audio-page__button-section">
                                <Button
                                    className="audio-page__back-button"
                                    variant="danger"
                                    onClick={handleBackClick}
                                >
                                    Назад
                                </Button>
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