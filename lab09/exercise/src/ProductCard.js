import * as React from "react";
import './ProductCard.css';

export const ProductCard = ({ item, onAddToCart, discount = 0 }) => {
  // TODO - add your component here
  const [itemsInCart, setItemsInCard] = React.useState(0);

  return (
      <div className="card">
        <div className="card-media">
          <img className="card-image" src={item.image} alt={item.title}/>
        </div>

        <div className="card-content">
          <div className="text">
            <h3 className="card-title">{item.title}</h3>
            <p className="card-subtitle">${parseFloat(item.price - (item.price * discount)).toFixed(2)} {item.currency}</p>
            {(item.descriptions && item.descriptions.map((desc) => (
              <p key={desc}>{desc}</p>
            )))}
            <div className="recommendations">
              <p>Highly recommended by {item.recommendationRatio * 100}% users</p>
              <span className={item.recommendationRatio > 0 ? "dot filled" : "dot"}></span>
              <span className={item.recommendationRatio > 0.2 ? "dot filled" : "dot"}></span>
              <span className={item.recommendationRatio > 0.4 ? "dot filled" : "dot"}></span>
              <span className={item.recommendationRatio > 0.6 ? "dot filled" : "dot"}></span>
              <span className={item.recommendationRatio > 0.8 ? "dot filled" : "dot"}></span>
            </div>
          </div>
          <div className="card-actions">
            <button id="minus" aria-label="Minus" className="minus-modifier" onClick={()=> {itemsInCart > 0 && setItemsInCard(itemsInCart - 1)}}>-</button>
            <p id="current-quantity" className="items-label">{itemsInCart}</p>
            <button id="plus" aria-label="Add" className="plus-modifier" onClick={()=> {setItemsInCard(itemsInCart + 1)}}>+</button>
            <button id="add-to-cart" onClick={() => {onAddToCart(item.id, itemsInCart)}}>Add to cart</button>
          </div>
          
        </div>
      </div>
  );
};
