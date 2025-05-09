import React from 'react';
import './Style/Profile.css'; // We'll create this CSS file next

const Profile = () => {
  const user = {
    name: 'John Doe',
    username: '@johndoe',
    bio: 'Frontend Developer | React Enthusiast | Coffee Lover',
    location: 'San Francisco, CA',
    website: 'johndoe.dev',
    joinDate: 'Joined June 2018',
    following: 542,
    followers: 1284,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    coverPhoto: 'https://images.unsplash.com/photo-1519681393784-d120267933ba'
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div 
          className="cover-photo"
          style={{ backgroundImage: `url(${user.coverPhoto})` }}
        ></div>
        <div className="profile-info">
          <div className="avatar-container">
            <img src={user.avatar} alt="Profile" className="avatar" />
          </div>
          <div className="profile-actions">
            <button className="edit-profile-btn">Edit Profile</button>
          </div>
        </div>
      </div>

      <div className="profile-details">
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-username">{user.username}</p>
        <p className="profile-bio">{user.bio}</p>
        
        <div className="profile-meta">
          <span className="location">
            <i className="fas fa-map-marker-alt"></i> {user.location}
          </span>
          <span className="website">
            <i className="fas fa-link"></i> <a href={`https://${user.website}`}>{user.website}</a>
          </span>
          <span className="join-date">
            <i className="far fa-calendar-alt"></i> {user.joinDate}
          </span>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <span className="stat-number">{user.following}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat">
            <span className="stat-number">{user.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* User posts/content would go here */}
        <div className="empty-state">
          <p>No posts to show</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;