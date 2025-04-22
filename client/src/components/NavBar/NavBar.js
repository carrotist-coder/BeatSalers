import React, { useContext } from 'react';
import { Context } from '../../index.js';
import Navbar from 'react-bootstrap/Navbar';
import { Button, Container, Nav } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { NavLink, useNavigate } from "react-router-dom";
import './NavBar.css';
import {
    MAIN_ROUTE,
    AUTH_ROUTE,
    USERS_ROUTE,
    BEATS_ROUTE,
    MY_PROFILE_ROUTE,
    ABOUT_ROUTE
} from "../../utils/consts";

const NavBar = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const logOut = () => {
        localStorage.removeItem('token');
        user.setUser({});
        user.setIsAuth(false);
        navigate(MAIN_ROUTE);
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="navbar-fixed">
            <Container>
                <Navbar.Brand as={NavLink} to={MAIN_ROUTE} style={{ color: 'white', textDecoration: 'none' }}>
                    БРЕСТСКИЙ МУЗЫКАЛЬНЫЙ КОЛЛЕДЖ
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto align-items-center" style={{ color: 'white' }}>
                        <NavLink className="nav-link-custom" to={BEATS_ROUTE}>Аранжировки</NavLink>
                        <NavLink className="nav-link-custom" to={USERS_ROUTE}>Музыканты</NavLink>
                        <NavLink className="nav-link-custom" to={ABOUT_ROUTE}>О колледже</NavLink>
                        {user.isAuth ? (
                            <>
                                <NavLink className="nav-link-custom" to={MY_PROFILE_ROUTE}>Профиль</NavLink>
                                <Button variant={"outline-light"} onClick={logOut}>Выйти</Button>
                            </>
                        ) : (
                            <Button variant={"outline-light"} onClick={() => navigate(AUTH_ROUTE)}>Авторизация</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});

export default NavBar;
