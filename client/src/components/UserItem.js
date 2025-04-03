import React from "react";
import { CardGroup, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../api';
import "./UserStyles.css";
import {truncateText} from "../utils/helpers";
import {
    DEFAULT_AVATAR_IMAGE_FILENAME,
    DEFAULT_PATH,
    NAME_VISIBLE_MAX_LENGTH,
    SHORT_TEXT_MAX_LENGTH
} from "../utils/consts";

function UserItem({ user }) {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate('/profiles/' + user.username);
    };

    const photoUrl = user.photo_url ? baseURL + user.photo_url : baseURL + DEFAULT_PATH + '/' + DEFAULT_AVATAR_IMAGE_FILENAME;

    return (
        <CardGroup className="user-item" onClick={handleCardClick}>
            <Card style={{ cursor: "pointer" }}>
                <Card.Img variant="top" src={photoUrl} />
                <Card.Body>
                    <Card.Title>
                        {truncateText(user.name, NAME_VISIBLE_MAX_LENGTH)}
                        {user.role === 'admin' && (
                            <img
                                src="/media/checkmark.png"
                                alt="Админ"
                                className="checkmark-icon-sm"
                            />
                        )}</Card.Title>
                    <Card.Text>{truncateText(user.bio, SHORT_TEXT_MAX_LENGTH)}</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted">Аранжировок: {user.beat_count}</small>
                </Card.Footer>
            </Card>
        </CardGroup>
    );
}

export default UserItem;