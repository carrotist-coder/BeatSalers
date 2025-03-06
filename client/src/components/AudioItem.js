import React from "react";
import { CardGroup, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./UserStyles.css";
import {baseURL} from "../api";

function AudioItem({ beat }) {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate('/beats/' + beat.id);
    };

    const photoUrl = beat.photo_url ? baseURL + beat.photo_url : 'https://dummyimage.com/300x300';

    return (
        <CardGroup className="audio-item" onClick={handleCardClick}>
            <Card style={{ cursor: "pointer" }}>
                <Card.Img variant="top" src={photoUrl} />
                <Card.Body>
                    <Card.Title>{beat.title}</Card.Title>
                    <Card.Text>@{beat.seller_username}</Card.Text>
                    <Card.Text className="additional-info">
                        <strong>Стиль: </strong>{beat.style}<br />
                        <strong>BPM: </strong>{beat.bpm}
                    </Card.Text>
                    <audio
                        controls
                        style={{ width: "100%" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <source src={beat.audio_url} type="audio/mpeg" />
                        Ваш браузер не поддерживает элемент audio.
                    </audio>
                </Card.Body>
                <Card.Footer className="price-footer">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="price-tag">{beat.price} BYN</span>
                    </div>
                </Card.Footer>
            </Card>
        </CardGroup>
    );
}

export default AudioItem;