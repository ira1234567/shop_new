import React from 'react';
import './Offers.css'
import exclusive_image from '../Assets/bang (2).png'
const Offers = () => {
    return (
        <div className="offers">
            <div className="offers-left">
                <h1>Ексклюзивні пропозиції</h1>
                <p>ТІЛЬКИ НАЙКРАЩІ ТОВАРИ</p>
                <button>Отримати</button>
            </div>
            <div className="offers-right">
                <img src={exclusive_image} alt=" "/>
            </div>
        </div>
    )
}

export default Offers;