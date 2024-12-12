import React from "react";
import { useNavigate } from "react-router-dom";
import './Thanks.css';

const Thanks = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="thanks-container">
            <h1>Дякуємо за замовлення!</h1>
            <p>Ваше замовлення успішно оформлено та оплачене.</p>
            <button onClick={handleGoHome} className="home-button">
                На головну
            </button>
        </div>
    );
};

export default Thanks;
