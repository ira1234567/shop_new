import React from 'react';
import  './navbar.css'
import profile from '../../assets/profile.svg'
import logo from '../../assets/img.png'
const Navbar = () => {
    return (
        <div className="navbar">
            <div className="navlog">
                <img src={logo} alt='logo'/>
                <p>FASHIONISTA</p></div>
            <img src={profile} alt="" className="nav-logo"/>
        </div>
    )
}

export default Navbar;