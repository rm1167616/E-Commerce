import React from 'react';
import './Style/Profile.css';

const Profile = () => {
  const user = {
    name: 'Jane Smith',
    title: 'Web Developer',
    bio: 'I build websites and web applications using modern technologies.',
    email: 'jane.smith@example.com',
    phone: '(123) 456-7890',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
  };

  return (
    <div className="basic-profile">
      <div className="profile-card">
        <div className="avatar-container">
          <img src={user.avatar} alt="Profile" className="avatar" />
        </div>
        
        <div className="profile-info">
          <h1>{user.name}</h1>
          <h2>{user.title}</h2>
          <p className="bio">{user.bio}</p>
          
          <div className="contact-info">
            <div className="contact-item">
              <span className="label">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="contact-item">
              <span className="label">Phone:</span>
              <span>{user.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;