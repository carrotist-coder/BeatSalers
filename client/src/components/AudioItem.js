import React from "react";
import { CardGroup, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./UserStyles.css";
import {baseURL} from "../api";
import {formatDate, truncateText} from "../utils/helpers";
import {TITLE_VISIBLE_MAX_LENGTH} from "../utils/consts";

function AudioItem({ beat }) {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate('/beats/' + beat.id);
    };

    const photoUrl = beat.photo_url ? baseURL + beat.photo_url : 'https://dummyimage.com/300x300';
    const audioUrl = baseURL + beat.audio_url;
    
    return (
        <CardGroup className="audio-item" onClick={handleCardClick}>
            <Card style={{ cursor: "pointer" }}>
                <Card.Img variant="top" src={photoUrl} />
                <Card.Body>
                    <Card.Title>{truncateText(beat.title, TITLE_VISIBLE_MAX_LENGTH)}</Card.Title>
                    <Card.Text>
                        <span className="audio-item__username"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/profiles/${beat.seller_username}`);
                              }}
                        >@{beat.seller_username}</span>
                    </Card.Text>
                    <Card.Text className="additional-info">
                        <div><strong>Стиль: </strong>{beat.style}</div>
                        <div><strong>BPM: </strong>{beat.bpm}</div>
                        <div><strong>Создан: </strong>{formatDate(beat.created_at)}</div>
                    </Card.Text>
                    <audio
                        controls
                        style={{ width: "100%" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <source src={audioUrl} type="audio/mpeg" />
                        Ваш браузер не поддерживает элемент audio.
                    </audio>
                </Card.Body>
                <Card.Footer className="price-footer">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="price-tag">{beat.price === 0 ? "Бесплатно!" : `${beat.price} BYN`}</span>
                    </div>
                </Card.Footer>
            </Card>
        </CardGroup>
    );
}

export default AudioItem;