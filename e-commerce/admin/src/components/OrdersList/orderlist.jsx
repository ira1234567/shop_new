import React, { useEffect, useState } from 'react';
import './orderlist.css';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [statusMap, setStatusMap] = useState({});

    // Завантаження замовлень
    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:4000/orders', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Помилка отримання замовлень:', error);
        }
    };

    // Оновлення статусу замовлення
    const updateOrderStatus = async (orderId) => {
        try {
            const response = await fetch('http://localhost:4000/updateorderstatus', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    status: statusMap[orderId],
                }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Статус оновлено!');
                fetchOrders(); // Оновлюємо список замовлень
            } else {
                alert('Помилка оновлення статусу.');
            }
        } catch (error) {
            console.error('Помилка оновлення статусу:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);
    return (
        <div className="scrollable-container">
            <div className="orders-list">
                <h1>Список замовлень</h1>
                {orders.map((order) => (
                    <div key={order.orderId} className="order-card">
                        <h3>Замовлення #{order.orderId}</h3>
                        <p>Телефон: {order.phone}</p>
                        <p>Адреса: {order.address}</p>
                        <p>Статус: {order.status}</p>
                        <div>
                            {order.products.map((product, index) => (
                                <div key={index} className="product-info">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                    <p>Назва: {product.name}</p>
                                    <p>Розмір: {product.size}</p>
                                    <p>Кількість: {product.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="order-card-controls">
                            <select
                                className="order-status-select"
                                value={statusMap[order.orderId] || order.status}
                                onChange={(e) =>
                                    setStatusMap({ ...statusMap, [order.orderId]: e.target.value })
                                }
                            >
                                <option value="Очікує">Очікує</option>
                                <option value="Виконано">Виконано</option>
                                <option value="Відхилено">Відхилено</option>
                            </select>
                            <button
                                className="update-button"
                                onClick={() => updateOrderStatus(order.orderId)}
                            >
                                Оновити статус
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersList;
