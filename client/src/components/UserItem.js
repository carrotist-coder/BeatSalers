import React from "react";
import { CardGroup, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./UserStyles.css";

function UserItem({ user }) {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate('/profiles/' + user.username);
    };

    return (
        <CardGroup className="user-item" onClick={handleCardClick}>
            <Card style={{ cursor: "pointer" }}>
                <Card.Img variant="top" src={user.photo_url || 'https://dummyimage.com/300x300'} />
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