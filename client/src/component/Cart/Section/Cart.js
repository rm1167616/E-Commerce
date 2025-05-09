import React, { useState } from 'react';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Style/Cart.css'
const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://via.placeholder.com/80',
      quantity: 1,
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      image: 'https://via.placeholder.com/80',
      quantity: 2,
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      price: 59.99,
      image: 'https://via.placeholder.com/80',
      quantity: 1,
    }
  ]);

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    ));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <Link to="/products" className="continue-shopping">
          <FaArrowLeft /> Continue Shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items yet</p>
          <Link to="/products" className="shop-now-btn">Shop Now</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="price">${item.price.toFixed(2)}</p>
                  
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
                
                <div className="item-total">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;