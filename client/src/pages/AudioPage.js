import React, {useState, useEffect, useContext} from 'react';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./AudioPage.css";
import {baseURL, getBeatById} from '../api';
import {BEATS_ROUTE, DEFAULT_BEAT_IMAGE_FILENAME, DEFAULT_PATH} from "../utils/consts";
import NotFoundPage from "./NotFoundPage";
import {formatDate, truncateText} from "../utils/helpers";
import {getAverageColor, getTextColor} from '../utils/colorHelpers';
import {Context} from "../index";
import AudioEditModal from "../modals/AudioEditModal";

function AudioPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [beat, setBeat] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [isBeatNotFound, setBeatNotFound] = useState(false);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [textColor, setTextColor] = useState('#000');
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const userStore = useContext(Context).user;
    const isOwner = userStore.isAuth && beat && (userStore.user.id === beat.seller_id || userStore.user.role === 'admin');

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

    useEffect(() => {
        fetchBeatData();
    }, [id]);

    const handleImageLoad = (e) => {
        const img = e.target;
        const { r, g, b } = getAverageColor(img);
        const computedBgColor = `rgb(${r}, ${g}, ${b})`;
        setBgColor(computedBgColor);
        setTextColor(getTextColor(r, g, b));
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (isBeatNotFound) {
        return <NotFoundPage />;
    }

    if (!beat) {
        return <div>Произошла ошибка</div>;
    }

    const photoUrl = beat.photo_url
        ? baseURL + beat.photo_url
        : baseURL + DEFAULT_PATH + '/' + DEFAULT_BEAT_IMAGE_FILENAME;
    const audioUrl = baseURL + beat.audio_url;
    const emailHref = `mailto:${beat.email}?subject=Покупка%20аранжировки%20"${beat.title}"&body=Я%20хотел%20бы%20купить%20эту%20аранжировку:%20"${beat.title}".`;

    const handleBackClick = () => {
        navigate(BEATS_ROUTE);
    };

    return (
        <div className="audio-page">
            <div
                className="audio-page__blurred-background"
                style={{ backgroundColor: bgColor }}
            ></div>
            <Container className="audio-page__content-container">
                <Row className="h-100 align-items-center">
                    <Col md={6} className="audio-page__image-section">
                        <div className="audio-page__image-wrapper">
                            <img
                                crossOrigin="anonymous"
                                src={photoUrl}
                                alt="Аранжировка"
                                className="audio-page__beat-image"
                                onLoad={handleImageLoad}
                            />
                            <span className="audio-page__price-tag">{beat.price === 0 ? "Бесплатно!" : `${beat.price} BYN`}</span>
                        </div>
                    </Col>
                    <Col md={6} className="audio-page__info-section" style={{ color: textColor }}>
                        <Card.Body className="d-flex flex-column h-100 justify-content-center">
                            <Card.Title className="audio-page__title">{beat.title}</Card.Title>
                            <Card.Text>
                                <span className="audio-page__author"
                                      onClick={() => navigate(`/profiles/${beat.seller_username}`)}
                                >@{beat.seller_username}</span>
                            </Card.Text>
                            <Card.Text className="audio-page__description">{truncateText(beat.description, 0)}</Card.Text>
                            <Card.Text className="audio-page__additional-info">
                                <div className="audio-page__additional-text"><strong>Стиль: </strong>{beat.style}</div>
                                <div className="audio-page__additional-text"><strong>BPM: </strong>{beat.bpm}</div>
                                <div className="audio-page__additional-text"><strong>Создан: </strong>{formatDate(beat.created_at)}</div>
                                <div className="audio-page__additional-text"><strong>Изменён: </strong>{formatDate(beat.updated_at)}</div>
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
                                    href={emailHref}
                                    target="_blank"
                                >
                                    Купить
                                </Button>
                                {isOwner && (
                                    <Button
                                        className="audio-page__edit-button"
                                        variant="warning"
                                        onClick={() => setEditModalOpen(true)}
                                    >
                                        Редактировать
                                    </Button>
                                )}
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
                <AudioEditModal
                    show={isEditModalOpen}
                    onHide={() => setEditModalOpen(false)}
                    beat={beat}
                    onUpdated={() => fetchBeatData()}
                />
            </Container>
        </div>
    );
}

export default AudioPage;