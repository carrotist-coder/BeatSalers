import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";
import {MAIN_ROUTE} from "../utils/consts";

function NotFoundPage() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(MAIN_ROUTE);
    };

    return (
        <div className="not-found-page">
            <div className="not-found-page__blurred-background"></div>
            <Row className="h-100 align-items-center justify-content-center not-found-page__content-container">
                <Col md={8} lg={6} className="text-center not-found-page__info-section">
                    <h1 className="not-found-page__title">404</h1>
                    <h2 className="not-found-page__subtitle">Страница не найдена</h2>
                    <p className="not-found-page__description">
                        К сожалению, запрашиваемая вами страница не существует.
                    </p>
                    <Button
                        className="not-found-page__back-button"
                        variant="primary"
                        onClick={handleBackClick}
                    >
                        Вернуться на главную
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default NotFoundPage;