import React from "react";
import { CardGroup, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./UserStyles.css";
import { PROFILE_ROUTE } from "../utils/consts";

function UserItem() {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(PROFILE_ROUTE);
    };

    return (
        <CardGroup className="user-item" onClick={handleCardClick}>
            <Card style={{ cursor: "pointer" }}>
                <Card.Img variant="top" src="https://dummyimage.com/300x300" />
                <Card.Body>
                    <Card.Title>Имя музыканта</Card.Title>
                    <Card.Text>Тут находится биография или описание музыканта.</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted">Аранжировок: 2</small>
                </Card.Footer>
            </Card>
        </CardGroup>
    );
}

export default UserItem;