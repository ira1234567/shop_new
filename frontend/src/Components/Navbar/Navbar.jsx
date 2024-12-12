import React, {useContext, useRef, useState} from "react";
import './Navbar.css'
import logo from '../Assets/log.png'
import cart_icon from '../Assets/cart_icon.png'
import {Link} from "react-router-dom";
import {ShopContext} from "../../Context/ShopContext";
import nav_drop from '../Assets/nav_dropdown.png'
const Navbar = () => {
    const[menu, setMenu] = useState("shop");
    const {getTotalCartItems} = useContext(ShopContext);
    const menuRef = useRef(null);

    const dropdown = (e) =>{
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }
    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt='logo' />
                <p>FASHIONISTA</p>
            </div>
            <img className='nav-dropd' onClick={dropdown} src={nav_drop} alt=""/>
            <ul ref={menuRef} className='nav-menu'>
                <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration: 'none'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("men")}}><Link style={{textDecoration: 'none'}} to='/men'>Чоловічий</Link>{menu==="men"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("women")}}><Link style={{textDecoration: 'none'}} to='/women'>Жіночий</Link>{menu==="women"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration: 'none'}} to='kids'>Дитячий</Link>{menu==="kids"?<hr/>:<></>}</li>
            </ul>
            <div className="nav-login-cart">
                {localStorage.getItem('auth-token') ?<button onClick={()=>{localStorage.removeItem('auth-token');
                window.location.replace('/')}}>Вийти</button>:<Link to='/login'><button>Login</button></Link>}
                <Link to='/cart'><img src ={cart_icon} alt =""/></Link>
                <div className="nav-cart-count">
                    {getTotalCartItems()}
                </div>
            </div>
        </div>
    )
}

export default Navbar;