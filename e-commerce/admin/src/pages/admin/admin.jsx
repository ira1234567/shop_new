import React from 'react';
import './admin.css'
import Sidebar from "../../components/sidebar/sidebar.jsx";
import {Routes, Route} from "react-router-dom";
import AddProduct from "../../components/AddProduct/AddProduct.jsx";
import ListProduct from "../../components/ListProduct/ListProduct.jsx";
import Orderlist from "../../components/OrdersList/orderlist.jsx";

const Admin = () => {
    return <div className='admin'>
        <Sidebar/>
        <Routes>
            <Route path="/addproduct" element={<AddProduct/>}/>
            <Route path="/listproduct" element={<ListProduct/>}/>
            <Route path="/orderslist" element={<Orderlist/>}/>
        </Routes>
    </div>
}
export default Admin;