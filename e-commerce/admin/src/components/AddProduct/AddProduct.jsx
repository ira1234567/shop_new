import React, {useState} from 'react';
import './AddProduct.css'
import upload from '../../assets/upload.png'

const AddProduct = () => {
    const [image, setImage] = useState(false);
    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: ""
    });
    const changeHandler = (e) =>{
        setProductDetails({...productDetails, [e.target.name]: e.target.value});
    }
    const AddProd = async () => {
        console.log(productDetails)
        let response;
        let product = productDetails;
        let formData = new FormData();
        formData.append("product", image);
        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        }).then((response) => response.json())
            .then((data) => {
                response = data;
            });
        if(response.success){
            product.image = response.image_url;
            console.log(product);
            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            }).then((response) => response.json())
                .then((data) => {
                    data.success ? alert("Товар додано") : alert("Failed");
                });
        }
    }
    return (
        <div className="addproduct">
            <div className="addproduct-field">
                <p>Назва товару</p>
                <input value = {productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Введіть назву'/>
            </div>
            <div className="addproduct-price">
                <div className="addproduct-field">
                    <p>Ціна</p>
                    <input value = {productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Введіть ціну'/>
                </div>
                <div className="addproduct-field">
                    <p>Ціна зі знижкою</p>
                    <input value = {productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Введіть ціну'/>
                </div>
            </div>
            <div className="addproduct-field">
                <p>Категорія товару</p>
                <select value = {productDetails.category} onChange={changeHandler} name="category" className="addproductor-select" >
                    <option value ="women">Жіночий</option>
                    <option value ="men">Чоловічий</option>
                    <option value ="kid">Дитячий</option>
                </select>
            </div>
            <div className="addproduct-field">
                <label htmlFor="file-input">
                    <img src={image?URL.createObjectURL(image):upload} className="addproduct-main-img" alt=""/>
                </label>
                <input onChange={imageHandler} type="file" name="image" id="file-input" hidden/>
            </div>
            <button onClick={() => {AddProd()}} className="addproduct-btn">Додати</button>
        </div>
    )
}

export default AddProduct;