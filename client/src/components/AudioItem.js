import React from "react";
import { CardGroup, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./UserStyles.css";
import {BEAT_DETAILS_ROUTE} from "../utils/consts";

function AudioItem() {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(BEAT_DETAILS_ROUTE);
    };

    return (
        <CardGroup className="audio-item" onClick={handleCardClick}>
            <Card style={{ cursor: "pointer" }}>
                <Card.Img variant="top" src="https://dummyimage.com/300x300" />
                <Card.Body>
                    <Card.Title>Название аранжировки</Card.Title>
                    <Card.Text>@Имя пользователя</Card.Text>
                    <Card.Text className="additional-info">
                        <strong>Стиль: </strong>Хип-хоп<br />
                        <strong>BPM: </strong>128
                    </Card.Text>
                    <audio
                        controls
                        style={{ width: "100%" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
                        Ваш браузер не поддерживает элемент audio.
                    </audio>
                </Card.Body>
                <Card.Footer className="price-footer">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="price-tag">100 BYN</span>
                    </div>
                </Card.Footer>
            </Card>
        </CardGroup>
    );
}

export default AudioItem;