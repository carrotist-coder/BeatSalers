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
        <Navbar bg="dark" variant="dark" className="navbar-fixed">
            <Container>
                <NavLink style={{ color: 'white', textDecoration: 'none' }} to={MAIN_ROUTE}>БРЕСТСКИЙ МУЗЫКАЛЬНЫЙ КОЛЛЕДЖ</NavLink>
                <Nav className="ml-auto align-items-center" style={{ color: 'white' }}>
                    <NavLink style={{ color: 'white', textDecoration: 'none', marginRight: '30px' }} to={BEATS_ROUTE}>Аранжировки</NavLink>
                    <NavLink style={{ color: 'white', textDecoration: 'none', marginRight: '30px' }} to={USERS_ROUTE}>Музыканты</NavLink>
                    <NavLink
                        style={{ color: 'white', textDecoration: 'none', marginRight: '30px' }}
                        to={ABOUT_ROUTE}
                    >
                        О колледже
                    </NavLink>
                    {user.isAuth ? (
                        <>
                            <NavLink style={{ color: 'white', textDecoration: 'none', marginRight: '30px' }} to={MY_PROFILE_ROUTE}>Профиль</NavLink>
                            <Button variant={"outline-light"} onClick={logOut}>Выйти</Button>
                        </>
                    ) : (
                        <Button variant={"outline-light"} onClick={() => navigate(AUTH_ROUTE)}>Авторизация</Button>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
});

export default NavBar;
