const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const port = 4000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Підключення до бази даних


// Модель Product
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});

// Модель User
const User = mongoose.model("Users", {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object },
    data: { type: Date, default: Date.now },
});
//Модель Order
const Order = mongoose.model("Order", {
    userId: { type: String, required: true },
    cart: { type: Object, required: true },
    phone: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true },
    postOffice: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: "Очікує" },
    paymentStatus: { type: String, default: "Не оплачено" },
});

// Middleware для перевірки токена
const fetchUsers = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Зареєструйтесь!" });
    }
    try {
        const data = jwt.verify(token, 'secret');
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Використовуйте валідний токен" });
    }
};

// Завантаження зображень
const storage = multer.diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });
app.use('/images', express.static('uploads/images'));
app.post("/upload", upload.single("product"), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`,
    });
});

// Реєстрація користувача
app.post('/signup', async (req, res) => {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, error: "Цей email вже використовується" });
    }

    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: {}, // Порожній об'єкт для кошика
    });

    await user.save();

    const data = {
        user: {
            id: user.id,
        },
    };

    const token = jwt.sign(data, 'secret');
    res.json({
        success: true,
        token,
    });
});
//login
app.post('/login', async (req, res) => {
    let user = await User.findOne({
        email: req.body.email
    });
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret');
            res.json({success: true, token});
        }
        else{
            res.json({success: false, error: "Щось неправильно"})
        }
    }
    else{
        res.json({success: false, error:"Користувача не знайдено"})
    }
})
// Додавання продукту
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1;

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });

    await product.save();
    res.json({ success: true, name: req.body.name });
});

// Видалення продукту
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true });
});

// Отримання всіх продуктів
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    res.send(products);
});

// Додавання до кошика
app.post('/addtocart', fetchUsers, async (req, res) => {
    try {
        const { itemId, size } = req.body;
        if (!itemId || !size) return res.status(400).json({ error: "Недійсні дані" });

        let userData = await User.findOne({ _id: req.user.id });

        // Ініціалізація cartData, якщо вона відсутня
        if (!userData.cartData) {
            userData.cartData = {};
        }

        // Ініціалізація масиву для конкретного товару, якщо його ще немає
        if (!Array.isArray(userData.cartData[itemId])) {
            userData.cartData[itemId] = [];
        }

        // Пошук існуючого запису для розміру
        const sizeEntry = userData.cartData[itemId].find(entry => entry.size === size);

        if (sizeEntry) {
            sizeEntry.quantity += 1; // Збільшуємо кількість для існуючого розміру
        } else {
            userData.cartData[itemId].push({ size, quantity: 1 }); // Додаємо новий розмір
        }

        await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.json({ success: true, cartData: userData.cartData });
    } catch (error) {
        console.error("Помилка додавання до кошика:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
});


// Видалення з кошика
app.post('/removefromcart', fetchUsers, async (req, res) => {
    const { itemId, size } = req.body;
    let userData = await User.findOne({ _id: req.user.id });

    if (userData.cartData[itemId]) {
        const sizeIndex = userData.cartData[itemId].findIndex(entry => entry.size === size);

        if (sizeIndex !== -1) {
            userData.cartData[itemId][sizeIndex].quantity -= 1;

            if (userData.cartData[itemId][sizeIndex].quantity <= 0) {
                userData.cartData[itemId].splice(sizeIndex, 1);
            }

            if (userData.cartData[itemId].length === 0) {
                delete userData.cartData[itemId];
            }
        }
    }

    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.json({ success: true, cartData: userData.cartData });
});

// Отримання кошика
app.post('/getcart', fetchUsers, async (req, res) => {
    let userData = await User.findOne({ _id: req.user.id });
    // Перевірка наявності поля cartData
    if (!userData || !userData.cartData) {
        return res.json({ success: true, cartData: {} }); // Повертаємо порожній кошик
    }
    res.json(userData.cartData);
});

// Популярні товари
app.get('/popularwomen', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let pop = products.slice(0, 4);
    res.send(pop);
});

// Новинки
app.get('/new', async (req, res) => {
    let products = await Product.find({});
    let newProducts = products.slice(-8);
    res.send(newProducts);
});

app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find({});
        const products = await Product.find({});
        const productMap = products.reduce((map, product) => {
            map[product.id] = product;
            return map;
        }, {});

        const detailedOrders = orders.map(order => {
            const { _id, phone, region, city, postOffice, status, cart } = order;

            const productList = Object.entries(cart).flatMap(([productId, items]) => {
                const productDetails = productMap[productId];
                if (!productDetails) {
                    console.warn(`Товар з ID ${productId} не знайдено`);
                }
                return items.map(item => ({
                    name: productDetails?.name || "Невідомий товар",
                    image: productDetails?.image || "url-to-placeholder",
                    size: item.size,
                    quantity: item.quantity,
                }));
            });

            return {
                orderId: _id,
                phone,
                address: `${region}, ${city}, Відділення: ${postOffice}`,
                status,
                products: productList,
            };
        });

        res.send(detailedOrders);
    } catch (error) {
        console.error('Помилка отримання замовлень:', error);
        res.status(500).send({ error: 'Не вдалося отримати замовлення' });
    }
});

//оновлення статусу замовлення для адмінів
app.post('/updateorderstatus', async (req, res) => {
    const { orderId, status } = req.body;
    try {
        await Order.findByIdAndUpdate(orderId, { status });
        res.json({ success: true });
    } catch (error) {
        console.error("Помилка оновлення статусу замовлення:", error);
        res.status(500).json({ success: false, error: "Помилка сервера" });
    }
});
app.use(bodyParser.urlencoded({ extended: false }));

// Тестові реквізити Fondy
const FONDY_MERCHANT_ID = '1396424'; // Тестовий Merchant ID
const FONDY_SECRET_KEY = 'test';     // Тестовий секретний ключ

// Створення платіжного запиту
const axios = require('axios'); // Підключення Axios для HTTP-запитів

app.post('/createorder', fetchUsers, async (req, res) => {
    console.log("я тут був");

    const { cart, amount, phone, region, city, postOffice } = req.body;

    if (!cart || !amount || !phone || !region || !city || !postOffice) {
        return res.status(400).json({ success: false, error: "Усі поля обов'язкові." });
    }

    try {
        // Створення замовлення в базі даних
        const newOrder = new Order({
            userId: req.user.id,
            cart,
            phone,
            region,
            city,
            postOffice,
            amount,
            paymentStatus: "Очікує оплати",
            status: "Очікує",
        });
        await newOrder.save();

        // Очищення кошика користувача
        await User.findOneAndUpdate(
            { _id: req.user.id },
            { cartData: {} }) // Очищення поля cartData

        // Використовуємо _id замовлення як order_id для Fondy
        const orderId = newOrder._id.toString();

        // Дані для створення платежу у Fondy
        const paymentData = {
            merchant_id: FONDY_MERCHANT_ID,
            order_id: orderId,
            order_desc: "Оплата товарів",
            currency: "UAH",
            amount: Math.round(amount * 100), // Сума в копійках
            server_callback_url: `https://b2a3-2a02-2378-11e3-da50-9912-9450-607a-c08.ngrok-free.app/paymentcallback`,
            response_url: `http://localhost:4000/redirect-to-thanks`,
        };

        // Генерація підпису для Fondy
        paymentData.signature = generateSignature(paymentData, FONDY_SECRET_KEY);

        // Надсилання запиту до Fondy
        const fondyResponse = await axios.post('https://pay.fondy.eu/api/checkout/url/', {
            request: paymentData,
        });

        const fondyData = fondyResponse.data.response;

        if (fondyData.response_status === 'success') {
            // Повертаємо URL для оплати
            res.json({ success: true, payment_url: fondyData.checkout_url });
        } else {
            res.status(400).json({ success: false, error: "Помилка створення оплати Fondy" });
        }
    } catch (error) {
        console.error("Помилка створення оплати:", error);
        res.status(500).json({ success: false, error: "Помилка сервера" });
    }
});

app.post('/paymentcallback', async (req, res) => {
    const { signature, order_status, amount, order_id } = req.body;

    // Перевірка статусу замовлення
    if (order_status !== 'approved') {
        return res.status(400).json({ success: false, error: "Платіж не підтверджено" });
    }

    // Перевірка підпису Fondy
    const isValid = verifySignatureFondy(req.body, FONDY_SECRET_KEY);
    if (!isValid) {
        return res.status(400).json({ success: false, error: "Невірний підпис" });
    }

    try {
        // Отримання замовлення з бази даних
        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({ success: false, error: "Замовлення не знайдено" });
        }

        // Оновлення статусу замовлення до "Оплачено"
        order.paymentStatus = "Оплачено";
        await order.save();

        res.json({ success: true, message: "Замовлення оплачено" });
    } catch (error) {
        console.error("Помилка при оновленні замовлення:", error);
        res.status(500).json({ success: false, error: "Помилка сервера" });
    }
});

function generateSignature(params, secretKey) {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([key, value]) =>
            value !== undefined &&
            value !== null &&
            value !== '' &&
            key !== 'signature' &&
            key !== 'response_signature_string'
        )
    );
    const sortedKeys = Object.keys(filteredParams).sort();
    const values = sortedKeys.map((key) => filteredParams[key]);
    values.unshift(secretKey);
    const signatureString = values.join('|');
    console.log("Рядок для підпису:", signatureString);
    return require('crypto')
        .createHash('sha1')
        .update(signatureString, 'utf8')
        .digest('hex');
}

function verifySignatureFondy(body, secretKey) {
    const { signature, ...params } = body;
    const expectedSignature = generateSignature(params, secretKey);
    if (expectedSignature !== signature) {
        console.error("Очікуваний підпис:", expectedSignature);
        console.error("Надісланий підпис:", signature);
    }
    return expectedSignature === signature;
}

app.post('/redirect-to-thanks', (req, res) => {
    res.redirect(303, 'http://localhost:3000/thanks'); // Редірект на GET
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
