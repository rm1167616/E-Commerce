import React, { useState } from 'react';
import '../Section/Style/Profile.css';
import { FiUser, FiMail, FiLogOut, FiClock, FiCheckCircle, FiTruck, FiEdit, FiChevronRight } from 'react-icons/fi';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    address: '123 Main St, New York, NY 10001'
  });

  const user = {
    ...formData,
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
        { name: 'Wireless Headphones Pro', price: 99.99, quantity: 1, image: 'https://m.media-amazon.com/images/I/61KbggGOGaL._AC_SL1500_.jpg' },
        { name: 'Premium Phone Case', price: 25.00, quantity: 2, image: 'https://m.media-amazon.com/images/I/71i6xU8qH0L._AC_SL1500_.jpg' }
      ]
    },
    {
      id: '#ORD-12344',
      date: '10 Oct 2023',
      status: 'Shipped',
      items: 2,
      total: 89.99,
      details: [
        { name: 'Smart Watch Series 5', price: 79.99, quantity: 1, image: 'https://m.media-amazon.com/images/I/71YlH-4MUQL._AC_SL1500_.jpg' },
        { name: 'Tempered Glass Screen Protector', price: 10.00, quantity: 1, image: 'https://m.media-amazon.com/images/I/61U1tDY5xXL._AC_SL1500_.jpg' }
      ]
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the data to your backend
  };

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
          <div className="avatar-container">
            <img src={user.avatar} alt="Profile" className="profile-avatar" />
            <div className="avatar-overlay">
              <FiEdit className="edit-avatar-icon" />
            </div>
          </div>
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
            <span>Account Details</span>
            <FiChevronRight className="arrow-icon" />
          </button>
          <button 
            className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FiClock className="icon" />
            <span>Order History</span>
            <FiChevronRight className="arrow-icon" />
          </button>
        </nav>
        
        <button className="logout-btn">
          <FiLogOut className="icon" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {activeTab === 'account' ? (
          <div className="account-details">
            <div className="content-header">
              <h1>Account Information</h1>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <FiEdit /> Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="save-btn" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>
            
            <div className="details-section">
              <h2>Personal Details</h2>
              {!isEditing ? (
                <>
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
                </>
              ) : (
                <form className="edit-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      rows="3"
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="order-history">
            <div className="content-header">
              <h1>Order History</h1>
              <div className="order-filter">
                <select>
                  <option>All Orders</option>
                  <option>Delivered</option>
                  <option>Shipped</option>
                  <option>Processing</option>
                </select>
              </div>
            </div>
            
            <div className="orders-list">
              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-meta">
                        <div className="order-id">Order {order.id}</div>
                        <div className="order-date">Placed on {order.date}</div>
                      </div>
                      <div className={`order-status ${order.status.toLowerCase()}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </div>
                    </div>
                    <div className="order-details">
                      <div className="order-items">
                        {order.details.map((item, index) => (
                          <div key={index} className="order-item">
                            <div className="item-image">
                              <img src={item.image} alt={item.name} />
                            </div>
                            <div className="item-info">
                              <h4>{item.name}</h4>
                              <div className="item-meta">
                                <span>Qty: {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="order-summary">
                        <div className="summary-details">
                          <span>{order.items} item{order.items !== 1 ? 's' : ''}</span>
                          <span className="order-total">Total: ${order.total.toFixed(2)}</span>
                        </div>
                        <div className="order-actions">
                          <button className="track-btn">Track Order</button>
                          <button className="details-btn">View Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-orders">
                  <div className="empty-state">
                    <img src="https://cdn.dribbble.com/users/204955/screenshots/4930541/media/75b7d12ad59a9bc2c0e9a9f0b4a5b2a0.png" alt="No orders" />
                    <h3>No Orders Yet</h3>
                    <p>You haven't placed any orders yet. When you do, they'll appear here.</p>
                    <button className="shop-btn">Start Shopping</button>
                  </div>
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