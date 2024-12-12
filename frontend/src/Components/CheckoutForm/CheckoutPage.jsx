import React, { useState, useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
import './CheckoutPage.css'

const CheckoutPage = () => {
    const [formData, setFormData] = useState({
        phone: "",
        region: "",
        city: "",
        postOffice: "",
    });

    const { processCheckout } = useContext(ShopContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.phone || !formData.region || !formData.city || !formData.postOffice) {
            alert("Будь ласка, заповніть всі поля.");
            return;
        }

         await processCheckout(formData); // Очікуємо завершення
    };

    return (
        <div className="checkout-form">
            <div className="checkout-form-container">
                <h2>Підтвердити замовлення</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Телефон:
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Введіть номер телефону"
                            required
                        />
                    </label>
                    <label>
                        Область:
                        <input
                            type="text"
                            name="region"
                            value={formData.region}
                            onChange={handleChange}
                            placeholder="Введіть область"
                            required
                        />
                    </label>
                    <label>
                        Місто:
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Введіть місто"
                            required
                        />
                    </label>
                    <label>
                        Відділення Нової Пошти:
                        <input
                            type="text"
                            name="postOffice"
                            value={formData.postOffice}
                            onChange={handleChange}
                            placeholder="Введіть номер відділення"
                            required
                        />
                    </label>
                    <div className="checkout-buttons">
                        <button type="submit">Підтвердити</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
