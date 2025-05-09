import React, { useState } from 'react';
import '../Section/Style/Profile.css';
import { FiUser, FiMail, FiLogOut, FiClock, FiCheckCircle, FiTruck, FiEdit } from 'react-icons/fi';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('orders'); // Default to orders tab
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    address: '123 Main St, New York, NY 10001',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  const orders = [
    {
      id: '#ORD-12345',
      date: '15 Oct 2023',
      status: 'Delivered',
      items: 3,
      total: 149.99,
      details: [
        { name: 'Wireless Headphones', price: 99.99, quantity: 1 },
        { name: 'Phone Case', price: 25.00, quantity: 2 }
      ]
    },
    {
      id: '#ORD-12344',
      date: '10 Oct 2023',
      status: 'Shipped',
      items: 2,
      total: 89.99,
      details: [
        { name: 'Smart Watch', price: 79.99, quantity: 1 },
        { name: 'Screen Protector', price: 10.00, quantity: 1 }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return <FiCheckCircle className="icon delivered" />;
      case 'Shipped': return <FiTruck className="icon shipped" />;
      default: return <FiClock className="icon processing" />;
    }
  };

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <div className="user-info">
          <img src={user.avatar} alt="Profile" className="profile-avatar" />
          <h2>{user.name}</h2>
          <div className="user-email">
            <FiMail className="icon" />
            <span>{user.email}</span>
          </div>
        </div>
        
        <nav className="profile-menu">
          <button 
            className={`menu-item ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <FiUser className="icon" />
            Account Details
          </button>
          <button 
            className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FiClock className="icon" />
            Order History
          </button>
        </nav>
        
        <button className="logout-btn">
          <FiLogOut className="icon" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {activeTab === 'account' ? (
          <div className="account-details">
            <h1>Account Information</h1>
            
            <div className="details-section">
              <h2>Personal Details</h2>
              <div className="detail-row">
                <span className="detail-label">Full Name:</span>
                <span className="detail-value">{user.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{user.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{user.address}</span>
              </div>
              <button className="edit-btn">
                <FiEdit /> Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="order-history">
            <h1>Order History</h1>
            
            <div className="orders-list">
              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-id">{order.id}</div>
                      <div className="order-date">{order.date}</div>
                    </div>
                    <div className="order-status">
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                    <div className="order-details">
                      <div className="order-items">
                        {order.details.map((item, index) => (
                          <div key={index} className="order-item">
                            <span>{item.quantity} × {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-summary">
                        <span>{order.items} item{order.items !== 1 ? 's' : ''}</span>
                        <span className="order-total">Total: ${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-orders">
                  <p>You haven't placed any orders yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;