import React, {useContext, useEffect, useRef, useState} from 'react';
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
    const [expanded, setExpanded] = useState(false);
    const navbarRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const logOut = () => {
        localStorage.removeItem('token');
        user.setUser({});
        user.setIsAuth(false);
        navigate(MAIN_ROUTE);
    }

    return (
        <Navbar
            ref={navbarRef}
            bg="dark"
            variant="dark"
            expand="lg"
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            className="navbar-fixed"
        >
        <Container>
            <Navbar.Brand
                as={NavLink}
                to={MAIN_ROUTE}
                className="brand-title"
                onClick={() => setExpanded(false)}
            >
                БРЕСТСКИЙ МУЗЫКАЛЬНЫЙ КОЛЛЕДЖ
            </Navbar.Brand>
            <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                className="custom-toggler"
            />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto align-items-center" style={{ color: 'white' }}>
                        <NavLink className="nav-link-custom" to={BEATS_ROUTE} onClick={() => setExpanded(false)}>Аранжировки</NavLink>
                        <NavLink className="nav-link-custom" to={USERS_ROUTE} onClick={() => setExpanded(false)}>Музыканты</NavLink>
                        <NavLink className="nav-link-custom" to={ABOUT_ROUTE} onClick={() => setExpanded(false)}>О колледже</NavLink>
                        {user.isAuth ? (
                            <>
                                <NavLink className="nav-link-custom" to={MY_PROFILE_ROUTE} onClick={() => setExpanded(false)}>Профиль</NavLink>
                                <Button className="nav-link-custom" variant={"outline-light"} onClick={() => {
                                    logOut();
                                    setExpanded(false);
                                }}>Выйти</Button>
                            </>
                        ) : (
                            <Button className="nav-link-custom" variant={"outline-light"} onClick={() => {
                                setExpanded(false)
                                navigate(AUTH_ROUTE)
                            }}>Авторизация</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});

export default NavBar;
