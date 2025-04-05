// src/components/DonationNavBar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/NavBar.css';

const DonationNavBar = ({ location, setLocation }) => {
  const { auth } = useContext(AuthContext);

  return (
    // Ensure the donation nav bar uses the "donation-nav" class for the proper black background and z-index
    <nav className="navbar donation-nav">
      {/* Left Section: location dropdown + site name */}
      <div className="nav-left">
        <select 
          value={location} 
          onChange={(e) => setLocation(e.target.value)}
          className="location-selector"
        >
          <option value="Vizianagaram">Vizianagaram</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Bangalore">Bangalore</option>
        </select>
        <div className="logo">Food Waste Management</div>
      </div>

      {/* Right Section: Home link, Home Made Food, Packed Food, sign in/up or profile */}
      <div className="nav-right">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="#" className="nav-link">Home Made Food</Link>
        <Link to="#" className="nav-link">Packed Food</Link>
        {auth.isLoggedIn ? (
          <Link to="/profile" className="nav-link">Profile</Link>
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

export default DonationNavBar;
