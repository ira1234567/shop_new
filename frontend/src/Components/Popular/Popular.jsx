import React, {useEffect, useState} from 'react';
import './Popular.css'
import Item from "../Items/Item";
const Popular = () =>{
    const[popular,setPopular]=useState([]);
    useEffect(()=>{
        fetch("http://localhost:4000/popularwomen")
            .then(res => res.json())
            .then(data => setPopular(data));
    },[])
    return(
        <div className="popular">
            <h1>ПОПУЛЯРНЕ СЕРЕД ЖІНОК</h1>
            <hr />
            <div className="popular-item">
                {popular.map((item,i)=>{
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
                })}
            </div>
        </div>
    )
}

export default Popular