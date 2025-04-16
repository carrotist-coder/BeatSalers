import React from 'react';
import './About.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {ABOUT_CARDS_DATA} from "../utils/consts";

const About = () => {
    return (
        <div className="about-page">
            <Container className="about-container">
                <h1 className="about-title">О колледже</h1>
                <p className="about-description">
                    Брестский музыкальный колледж — это место, где раскрываются таланты и рождается искусство.
                    Здесь обучаются будущие композиторы, исполнители и аранжировщики. Наши преподаватели —
                    признанные мастера своего дела, а выпускники — участники престижных конкурсов и фестивалей.
                </p>
                <Row className="about-row">
                    {ABOUT_CARDS_DATA.map(card => (
                        <Col md={4}>
                            <Card className="about-card h-100">
                                <Card.Img variant="top" src={card.imageUrl} />
                                <Card.Body>
                                    <Card.Title>{card.title}</Card.Title>
                                    <Card.Text>{card.text}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default About;