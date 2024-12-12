import React from 'react';
import './description.css'

const Description = () =>{
    return (
        <div className="description">
            <div className="description-navigator">
                <div className="description-nav">Опис товару</div>
                <div className="description-nav fade">Відгуки (122)</div>
            </div>
            <div className="description-description">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur doloribus labore natus odio provident ratione reiciendis, rerum saepe tempore totam? Aliquid dignissimos fuga ipsam, molestiae natus quia quidem totam velit.</p>
                <p>
                    написано усе правда
                </p>
            </div>
        </div>
    )
}
export default Description;