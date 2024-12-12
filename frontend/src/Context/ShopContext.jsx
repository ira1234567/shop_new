import React, {createContext, useEffect, useState} from "react";
export const ShopContext = createContext(null);
const getCart = () =>{
    let cart = {};
    for(let i = 0; i < 300+1; i++){
        cart[i] = 0;
    }
    return cart;
}
const ShopContextProvider = (props) => {
    const [all_product, setAllProduct] = useState([]);
    const[cartItem, setCartItem] = useState(getCart());
    useEffect(()=>{
        fetch('http://localhost:4000/allproducts')
            .then(res => res.json())
            .then((data) => setAllProduct(data))
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: ""
            }).then(res => res.json()).then((data) => setCartItem(data))
        }
    }, [])
    const addToCart = (itemId, size) => {
        if (!size) return alert("Оберіть розмір.");

        setCartItem((prev) => {
            const newCart = { ...prev };

            // Якщо товар ще не доданий, створюємо масив
            if (!Array.isArray(newCart[itemId])) {
                newCart[itemId] = [];
            }

            // Перевіряємо, чи вже існує запис для цього розміру
            const sizeEntry = newCart[itemId].find(entry => entry.size === size);

            if (sizeEntry) {
                sizeEntry.quantity += 1; // Збільшуємо кількість для існуючого розміру
            } else {
                newCart[itemId].push({ size: size, quantity: 1 }); // Додаємо новий розмір
            }

            return newCart;
        });

        // Відправка на сервер
        if (localStorage.getItem("auth-token")) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem("auth-token"),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId, size }),
            }).then(res => res.json())
                .then(data => console.log(data))
                .catch(err => console.error("Error adding to cart:", err));
        }
    };

    const removefromCart = (itemId, size) => {
        setCartItem((prev) => {
            const newCart = { ...prev };

            // Перевіряємо, чи існує товар у кошику
            if (Array.isArray(newCart[itemId])) {
                const sizeIndex = newCart[itemId].findIndex(entry => entry.size === size);

                if (sizeIndex !== -1) {
                    newCart[itemId][sizeIndex].quantity -= 1; // Зменшуємо кількість
                    if (newCart[itemId][sizeIndex].quantity <= 0) {
                        newCart[itemId].splice(sizeIndex, 1); // Видаляємо розмір
                    }
                    if (newCart[itemId].length === 0) {
                        delete newCart[itemId]; // Видаляємо товар, якщо немає розмірів
                    }
                }
            }
            return newCart;
        });

        // Відправка на сервер
        if (localStorage.getItem("auth-token")) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem("auth-token")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId, size }),
            })
                .then(res => res.json())
                .then(data => console.log(data));
        }
    };

    const getTotalCartAmount = () => {
        return Object.entries(cartItem).reduce((total, [itemId, sizes]) => {
            if (Array.isArray(sizes)) {
                const product = all_product.find(product => product.id === Number(itemId));
                if (product) {
                    sizes.forEach(entry => {
                        total += product.new_price * entry.quantity;
                    });
                }
            }
            return total;
        }, 0);
    };
    const getTotalCartItems = () => {
        return Object.entries(cartItem).reduce((totalItems, [itemId, sizes]) => {
            if (Array.isArray(sizes)) {
                sizes.forEach(entry => {
                    totalItems += entry.quantity;
                });
            }
            return totalItems;
        }, 0);
    };
    const processCheckout = async (formData) => {
        try {
            console.log("Дані перед відправленням:", {
                ...formData,
                cart: cartItem, // Перевіряємо, чи передається кошик
                amount: getTotalCartAmount(), // Загальна сума
            });

            const response = await fetch('http://localhost:4000/createorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'), // Токен користувача
                },
                body: JSON.stringify({
                    ...formData,
                    cart: cartItem,
                    amount: getTotalCartAmount(),
                }),
            });

            const data = await response.json();
            console.log("Відповідь сервера:", data);

            if (data.success) {
                window.location.href = data.payment_url;
                return true;
            } else {
                alert(data.error || "Помилка створення замовлення");
                return false;
            }
        } catch (error) {
            console.error("Помилка під час оформлення замовлення:", error);
            alert("Помилка сервера");
            return false;
        }
    };


    const contextValue = {getTotalCartItems, getTotalCartAmount, all_product, cartItem, addToCart, removefromCart, processCheckout};
    return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
}
export default ShopContextProvider;