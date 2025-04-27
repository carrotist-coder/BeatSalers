import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { NavLink } from 'react-router-dom';
import './Main.css';
import { MAIN_CAROUSEL_DATA } from '../../utils/consts';

const Main = () => {
    return (
        <div className="main-container">
            <div className="content">
                <div className="main-page-content">
                    <h1 className="title">Главная</h1>
                    <div className="carousel-wrapper">
                        <Carousel data-bs-theme="dark">
                            {MAIN_CAROUSEL_DATA.map((item, index) => (
                                <Carousel.Item key={index}>
                                    <NavLink to={item.route} className="carousel-link">
                                        <img
                                            className="d-block w-100 carousel-img"
                                            src={item.imageUrl}
                                            alt={item.alt}
                                        />
                                        <Carousel.Caption className="carousel-caption">
                                            <h5>{item.title}</h5>
                                            <p>{item.text}</p>
                                        </Carousel.Caption>
                                    </NavLink>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
