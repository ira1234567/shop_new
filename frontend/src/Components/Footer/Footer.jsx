import React from 'react';
import './Footer.css'
import instagram_icon from '../Assets/instagram.png'
import pinterest_icon from '../Assets/pinterest.png'
import whatsapp_icon from '../Assets/whatsup.png'
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>© 2024 Компанія. Усі права захищені.</p>
                <nav className="footer-nav">
                    <a href="#">Про нас</a>
                    <a href="#">Контакти</a>
                    <a href="#">Політика конфіденційності</a>
                    <a href="#">Умови користування</a>
                </nav>
                <div className="footer-social-icon">
                    <div className="footer-icons-container">
                        <img src={instagram_icon} alt=" "/>
                    </div>
                    <div className="footer-icons-container">
                        <img src={pinterest_icon} alt=" "/>
                    </div>
                    <div className="footer-icons-container">
                        <img src={whatsapp_icon} alt=" "/>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;