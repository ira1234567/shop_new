import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    const [selectedSize, setSelectedSize] = useState(null);

    return (
        <div className="productdisplay">
            <div className="productdisplay-left">
                <div className="productdisplay-img">
                    <img className="productdisplay-main-img" src={product.image} alt=" " />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-stars">
                    <img src={star_icon} alt=" " />
                    <img src={star_icon} alt=" " />
                    <img src={star_icon} alt=" " />
                    <img src={star_icon} alt=" " />
                    <img src={star_dull_icon} alt=" " />
                    <p>{122}</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">{product.old_price}₴</div>
                    <div className="productdisplay-right-price-new">{product.new_price}₴</div>
                </div>
                <div className="productdisplay-right-description">
                    Дуже гарні, якісні речі, в'язані, шерстяні
                </div>
                <div className="productdisplay-right-size">
                    <h1>Оберіть розмір</h1>
                    <div className="productdisplay-right-sizes">
                        {["S", "M", "L", "XL", "XXL"].map((size) => (
                            <div
                                key={size}
                                className={selectedSize === size ? "selected" : ""}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => {
                        if (selectedSize) {
                            addToCart(product.id, selectedSize);
                        } else {
                            alert("Будь ласка, оберіть розмір.");
                        }
                    }}
                >
                    ДО КОШИКА
                </button>
                <p className="productdisplay-right-category">
                    <span>Категорія: </span>{product.category}
                </p>
            </div>
        </div>
    );
};

export default ProductDisplay;
