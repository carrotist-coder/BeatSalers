import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { NavLink } from 'react-router-dom';
import './Main.css';
import {BEATS_ROUTE, USERS_ROUTE} from "../utils/consts";

const Main = () => {
    return (
        <div className="main-container">
            <div className="content">
                <h1 className="title">Главная</h1>
                <div className="carousel-wrapper">
                    <Carousel data-bs-theme="dark">
                        <Carousel.Item>
                            <NavLink to={BEATS_ROUTE} className="carousel-link">
                                <img
                                    className="d-block w-100"
                                    src="https://dummyimage.com/800x400/f5f5f5/000000"
                                    alt="Аранжировки"
                                />
                                <Carousel.Caption>
                                    <h5>Аранжировки</h5>
                                    <p>Лучшие музыкальные аранжировки от талантливых авторов</p>
                                </Carousel.Caption>
                            </NavLink>
                        </Carousel.Item>
                        <Carousel.Item>
                            <NavLink to={USERS_ROUTE} className="carousel-link">
                                <img
                                    className="d-block w-100"
                                    src="https://dummyimage.com/800x400/eeeeee/000000"
                                    alt="Музыканты"
                                />
                                <Carousel.Caption>
                                    <h5>Музыканты</h5>
                                    <p>Творческие коллективы и солисты нашего колледжа</p>
                                </Carousel.Caption>
                            </NavLink>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Main;
