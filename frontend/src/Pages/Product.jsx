import React, {useContext} from 'react';
import {ShopContext} from "../Context/ShopContext";
import {useParams} from "react-router-dom";
import Breadcrumb from "../Components/Breadcrums/Breadcrumb";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import Description from "../Components/description/Description";
//import RelatedProduct from "../Components/relatedproduct/RelatedProduct";

const Product = () => {
    const {all_product} = useContext(ShopContext);
    const {productId} = useParams();
    const product = all_product.find((e) => e.id === Number(productId));
    console.log(productId, product);
    return(
        <div>
            <Breadcrumb product={product}/>
            <ProductDisplay product={product}/>
            <Description/>
        </div>
    )
}

export default Product;