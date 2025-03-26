// src/components/NavBar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/NavBar.css';

const NavBar = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    // Navigate to a user profile page
    navigate('/profile');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo">Food Waste Management</div>
      </div>
      <div className="nav-right">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/cart" className="nav-link">Cart</Link>
        <Link 
          to="/donate" 
          className="nav-link donate-link"
          onClick={(e) => { 
            if (!auth.isLoggedIn) { 
              e.preventDefault(); 
              alert("Please log in to donate food"); 
            } 
          }}
        >
          Donate Food
        </Link>
        {auth.isLoggedIn ? (
          <div className="profile">
            <img 
              src={auth.user?.profilePic || "https://via.placeholder.com/40"} 
              alt="Profile" 
              className="profile-icon" 
              onClick={handleProfileClick}
            />
          </div>
        ) : (
          <>
            <Link to="/signin" className="nav-link">Sign In</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
