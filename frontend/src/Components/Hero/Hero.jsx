import React from 'react';
import './Hero.css'
import hero_image from '../Assets/hero_img.png'
const Hero = () => {
    return (
        <div className="hero">
            <div className='hero-left'>
                <h2>ТІЛЬКИ НОВИНКИ</h2>
                <div>
                    <div className="hero-hand-icon">
                        <p>Нові</p>
                    </div>
                    <p>колекції</p>
                    <p>для всіх</p>
                </div>
            </div>
            <div className='hero-right'>
                <img src={hero_image} alt=""/>
            </div>
        </div>
    )
}
export default Hero;