import React from 'react';
import './Breadcrun.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'
const Breadcrumb = (props) => {
    const {product} = props;
    console.log(product);
    return (
        <div className="breadcrum">
            Home <img src={arrow_icon} alt='arrow' /> Shop <img src={arrow_icon} alt='arrow' />{product.category} <img src={arrow_icon} alt='arrow'/> {product.name}
        </div>
    )
}

export default Breadcrumb;