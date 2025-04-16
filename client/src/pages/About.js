import React from 'react';
import './About.css';
import { Container, Row, Col, Card } from 'react-bootstrap';

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
                    <Col md={4}>
                        <Card className="about-card h-100">
                            <Card.Img variant="top" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/%D0%91%D0%B5%D1%80%D0%B0%D1%81%D1%8C%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D1%96_%D0%BC%D1%83%D0%B7%D1%8B%D1%87%D0%BD%D1%8B_%D0%BA%D0%B0%D0%BB%D0%B5%D0%B4%D0%B6.jpg/401px-%D0%91%D0%B5%D1%80%D0%B0%D1%81%D1%8C%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D1%96_%D0%BC%D1%83%D0%B7%D1%8B%D1%87%D0%BD%D1%8B_%D0%BA%D0%B0%D0%BB%D0%B5%D0%B4%D0%B6.jpg" />
                            <Card.Body>
                                <Card.Text>
                                    Здание колледжа — архитектурный памятник и центр музыкальной жизни города.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="about-card h-100">
                            <Card.Img variant="top" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/%D0%91%D0%B5%D1%80%D0%B0%D1%81%D1%8C%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D1%96_%D0%BC%D1%83%D0%B7%D1%8B%D1%87%D0%BD%D1%8B_%D0%BA%D0%B0%D0%BB%D0%B5%D0%B4%D0%B6.jpg/401px-%D0%91%D0%B5%D1%80%D0%B0%D1%81%D1%8C%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D1%96_%D0%BC%D1%83%D0%B7%D1%8B%D1%87%D0%BD%D1%8B_%D0%BA%D0%B0%D0%BB%D0%B5%D0%B4%D0%B6.jpg" />
                            <Card.Body>
                                <Card.Text>
                                    Мы предлагаем разнообразные направления: от академической музыки до современной аранжировки.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="about-card h-100">
                            <Card.Img variant="top" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/%D0%91%D0%B5%D1%80%D0%B0%D1%81%D1%8C%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D1%96_%D0%BC%D1%83%D0%B7%D1%8B%D1%87%D0%BD%D1%8B_%D0%BA%D0%B0%D0%BB%D0%B5%D0%B4%D0%B6.jpg/401px-%D0%91%D0%B5%D1%80%D0%B0%D1%81%D1%8C%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D1%96_%D0%BC%D1%83%D0%B7%D1%8B%D1%87%D0%BD%D1%8B_%D0%BA%D0%B0%D0%BB%D0%B5%D0%B4%D0%B6.jpg" />
                            <Card.Body>
                                <Card.Text>
                                    Мы предлагаем разнообразные направления: от академической музыки до современной аранжировки.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="about-row">
                    <Col md={4}>
                        <Card className="about-card h-100">
                            <Card.Img variant="top" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/%D0%91%D0%B5%D1%80%D0%B0%D1%81%D1%8C%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D1%96_%D0%BC%D1%83%D0%B7%D1%8B%D1%87%D0%BD%D1%8B_%D0%BA%D0%B0%D0%BB%D0%B5%D0%B4%D0%B6.jpg/401px-%D0%91%D0%B5%D1%80%D0%B0%D1%81%D1%8C%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D1%96_%D0%BC%D1%83%D0%B7%D1%8B%D1%87%D0%BD%D1%8B_%D0%BA%D0%B0%D0%BB%D0%B5%D0%B4%D0%B6.jpg" />
                            <Card.Body>
                                <Card.Text>
                                    Здание колледжа — архитектурный памятник и центр музыкальной жизни города.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="about-card h-100">
                            <Card.Img variant="top" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/%D0%91%D0%B5%D1%80%D0%B0%D1%81%D1%8C%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D1%96_%D0%BC%D1%83%D0%B7%D1%8B%D1%87%D0%BD%D1%8B_%D0%BA%D0%B0%D0%BB%D0%B5%D0%B4%D0%B6.jpg/401px-%D0%91%D0%B5%D1%80%D0%B0%D1%81%D1%8C%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D1%96_%D0%BC%D1%83%D0%B7%D1%8B%D1%87%D0%BD%D1%8B_%D0%BA%D0%B0%D0%BB%D0%B5%D0%B4%D0%B6.jpg" />
                            <Card.Body>
                                <Card.Text>
                                    Мы предлагаем разнообразные направления: от академической музыки до современной аранжировки.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="about-card h-100">
                            <Card.Img variant="top" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/%D0%91%D0%B5%D1%80%D0%B0%D1%81%D1%8C%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D1%96_%D0%BC%D1%83%D0%B7%D1%8B%D1%87%D0%BD%D1%8B_%D0%BA%D0%B0%D0%BB%D0%B5%D0%B4%D0%B6.jpg/401px-%D0%91%D0%B5%D1%80%D0%B0%D1%81%D1%8C%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D1%96_%D0%BC%D1%83%D0%B7%D1%8B%D1%87%D0%BD%D1%8B_%D0%BA%D0%B0%D0%BB%D0%B5%D0%B4%D0%B6.jpg" />
                            <Card.Body>
                                <Card.Text>
                                    Мы предлагаем разнообразные направления: от академической музыки до современной аранжировки.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default About;
