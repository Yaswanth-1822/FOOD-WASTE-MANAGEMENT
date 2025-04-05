// src/components/UserProfile.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/styles.css';

const UserProfile = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {auth.user ? (
        <div>
          <div className="user-details">
            <p><strong>Name:</strong> {auth.user.name}</p>
            <p><strong>Email:</strong> {auth.user.email}</p>
            {/* Additional user details can be added here */}
          </div>
          <div className="user-donations">
            <h3>Your Donations</h3>
            <p>List of donated food items will appear here.</p>
          </div>
          <div className="user-orders">
            <h3>Your Ordered Foods</h3>
            <p>Details of your orders will appear here.</p>
          </div>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default UserProfile;
