import React, { useContext } from 'react';
import './CartItem.css';
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from '../Assets/cart_cross_icon.png';
import { Link } from 'react-router-dom';

const CartItem = () => {
    const { getTotalCartAmount, all_product, cartItem, removefromCart } = useContext(ShopContext);
    const isCartEmpty = () => {
        return Object.values(cartItem).every((sizes) => !sizes || sizes.length === 0);
    };
    const isAuthenticated = !!localStorage.getItem('auth-token');

    return (
        <div className="CartItem">
            <div className="cartitem-main">
                <p>Товари</p>
                <p>Назва</p>
                <p>Розмір</p>
                <p>Ціна</p>
                <p>Кількість</p>
                <p>Усього</p>
                <p>Видалити</p>
            </div>
            <hr />
            {all_product.map((product) => {
                const sizes = cartItem[product.id];
                if (Array.isArray(sizes) && sizes.length > 0) {
                    return sizes.map((entry, index) => (
                        <div key={`${product.id}-${index}`}>
                            <div className="cartitem-format cartitem-main">
                                <img src={product.image} alt="" className='cartitem-image' />
                                <p>{product.name}</p>
                                <p>{entry.size}</p>
                                <p>{product.new_price}₴</p>
                                <button className="cartitems-quantity">{entry.quantity}</button>
                                <p>{product.new_price * entry.quantity}₴</p>
                                <img
                                    src={remove_icon}
                                    onClick={() => removefromCart(product.id, entry.size)}
                                    alt=""
                                    className="cartremove"
                                />
                            </div>
                            <hr />
                        </div>
                    ));
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-tot">
                    <h1>До сплати</h1>
                    <hr />
                    <div className="cartitem-total-container">
                        <h3 className="cartitem-total-sum">{getTotalCartAmount()}₴</h3>
                        {isAuthenticated ? (
                            <Link to="/checkout">
                                <button disabled={isCartEmpty()}>Підтвердити</button>
                            </Link>
                        ) : (
                            <Link to="/login">
                                <button>Увійти для підтвердження</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
