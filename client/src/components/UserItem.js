import React from "react";
import { CardGroup, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../api';
import "./UserStyles.css";

function UserItem({ user }) {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate('/profiles/' + user.username);
    };

    const photoUrl = user.photo_url ? baseURL + user.photo_url : 'https://dummyimage.com/300x300';

    return (
        <CardGroup className="user-item" onClick={handleCardClick}>
            <Card style={{ cursor: "pointer" }}>
                <Card.Img variant="top" src={photoUrl} />
                <Card.Body>
                    <Card.Title>{user.name}</Card.Title>
                    <Card.Text>{user.bio || '(нет описания)'}</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted">Аранжировок: {user.beat_count}</small>
                </Card.Footer>
            </Card>
        </CardGroup>
    );
}

export default UserItem;