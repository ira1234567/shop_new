import React from 'react';
import './sidebar.css'
import {Link} from 'react-router-dom'
import add_product from '../../assets/add.png'
import list from '../../assets/list.png'
import orders from '../../assets/orders.png'
const Sidebar = () => {
    return (
        <div className="sidebar">
            <Link to = {'/addproduct'} style={{textDecoration: 'none'}} >
                <div className="sidebaritem">
                    <img src={add_product} alt=""/>
                    <p>Додати товар</p>
                </div>
            </Link>
            <Link to = {'/listproduct'} style={{textDecoration: 'none'}} >
                <div className="sidebaritem">
                    <img src={list} alt=""/>
                    <p>Наявні товари</p>
                </div>
            </Link>
            <Link to = {'/orderslist'} style={{textDecoration: 'none'}} >
                <div className="sidebaritem">
                    <img src={orders} alt=""/>
                    <p>Замовлення</p>
                </div>
            </Link>
        </div>
    )
}

export default Sidebar;