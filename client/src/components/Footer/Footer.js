import React from 'react';
import { Container } from 'react-bootstrap';
import './Footer.css';
import { FaGithub, FaUniversity } from 'react-icons/fa';
import {GITHUB_AUTHOR_LINK, OFFICIAL_COLLEGE_LINK} from "../../utils/consts";

const Footer = () => {
    return (
        <footer className="footer">
            <Container className="footer-container">
                <div className="footer-top">
                    <div className="footer-author">
                        Создан Дмитрием Марковским, студентом БрГТУ (2 курс)
                    </div>
                    <div className="footer-links">
                        <a href={GITHUB_AUTHOR_LINK} target="_blank" rel="noopener noreferrer">
                            <FaGithub /> GitHub
                        </a>
                        <a href={OFFICIAL_COLLEGE_LINK} target="_blank" rel="noopener noreferrer">
                            <FaUniversity /> БГМК
                        </a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="footer-copy">© {new Date().getFullYear()} Все права защищены</div>
                    <div className="footer-quote">«Музыка — это волшебство, которое можно услышать.»</div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
