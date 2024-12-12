import React, {useEffect, useState} from 'react';
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'

const ListProduct = () => {
    const [allProducts, setAllProducts] = useState([]);
    const fetchinf = async () => {
        await fetch('http://localhost:4000/allproducts')
            .then((res) => res.json()).then((data) => {
                setAllProducts(data);
            })
    }
    useEffect(() => {
        fetchinf();
    },[])

    const remove = async (id) => {
        await fetch('http://localhost:4000/removeproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id})
        })
        await fetchinf();
    }
    return (
        <div className="listproduct">
            <h1>Усі товари</h1>
            <div className="listprod-form-main">
                <p>Товар</p>
                <p>Назва</p>
                <p>Стара ціна</p>
                <p>Нова ціна</p>
                <p>Категорія</p>
                <p>Видалити</p>
            </div>
            <div className="listprod-allproducts">
               <hr/>
                {allProducts.map((product, index) => {
                    return <><div key={index} className="listprod-form-main listprod-format">
                        <img src={product.image} alt="" className="listprod-prod-item"/>
                        <p>{product.name}</p>
                        <p>{product.old_price}₴</p>
                        <p>{product.new_price}₴</p>
                        <p>{product.category}</p>
                        <img onClick={() =>{remove(product.id)}} src={cross_icon} alt="" className="listprod-remove"/>
                    </div>
                    <hr/>
                    </>
                })}
            </div>
        </div>
    )

}
export default ListProduct;