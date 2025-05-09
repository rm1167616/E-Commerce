import React, { useState } from 'react';
import './Style/WishList.css';
import { FaHeart, FaRegHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';

const WishList = () => {
  const [wishItems, setWishItems] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://via.placeholder.com/150',
      inStock: true,
      liked: true
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      image: 'https://via.placeholder.com/150',
      inStock: false,
      liked: true
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      price: 59.99,
      image: 'https://via.placeholder.com/150',
      inStock: true,
      liked: true
    }
  ]);

  const removeFromWishlist = (id) => {
    setWishItems(wishItems.filter(item => item.id !== id));
  };

  const toggleLike = (id) => {
    setWishItems(wishItems.map(item => 
      item.id === id ? {...item, liked: !item.liked} : item
    ));
  };

  const moveToCart = (id) => {
    // Here you would typically call an API or update global state
    console.log(`Moving item ${id} to cart`);
    removeFromWishlist(id);
  };

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>Your Wishlist</h1>
        <p>{wishItems.length} {wishItems.length === 1 ? 'item' : 'items'}</p>
      </div>

      {wishItems.length === 0 ? (
        <div className="wishlist-empty">
          <FaRegHeart className="empty-heart" />
          <h2>Your wishlist is empty</h2>
          <p>Save items you love for later</p>
          <button className="continue-shopping-btn">Continue Shopping</button>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishItems.map(item => (
            <div key={item.id} className="wishlist-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
                <button 
                  className="like-btn" 
                  onClick={() => toggleLike(item.id)}
                >
                  {item.liked ? <FaHeart className="liked" /> : <FaRegHeart />}
                </button>
              </div>
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="price">${item.price.toFixed(2)}</p>
                <p className={`stock-status ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
              
              <div className="item-actions">
                <button 
                  className="remove-btn"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <FaTrash />
                </button>
                <button 
                  className={`move-to-cart-btn ${!item.inStock ? 'disabled' : ''}`}
                  onClick={() => moveToCart(item.id)}
                  disabled={!item.inStock}
                >
                  <FaShoppingCart /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;