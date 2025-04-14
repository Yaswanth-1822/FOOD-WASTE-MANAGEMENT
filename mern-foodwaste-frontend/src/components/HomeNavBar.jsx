// src/components/HomeNavBar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/NavBar.css';

const HomeNavBar = ({ location, setLocation, searchQuery, setSearchQuery }) => {
  const { auth } = useContext(AuthContext);

  // Handler for the "Donate Food" link
  const handleDonateClick = (e) => {
    if (!auth.isLoggedIn) {
      e.preventDefault();
      alert('Please log in to donate food');
    }
  };

  return (
    <nav className="navbar">
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

      {/* Center Section: search bar */}
      <div className="nav-middle">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Search food items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right Section: homemade/packed links, donate link, sign in/up or profile */}
      <div className="nav-right">
        <Link to="/homemade" className="nav-link">Home Made Food</Link>
        <Link to="/packed" className="nav-link">Packed Food</Link>
        
        {/* Donate Food link with login check */}
        <Link 
          to="/donate"
          className="nav-link"
          onClick={handleDonateClick}
        >
          Donate Food
        </Link>

        {auth.isLoggedIn ? (
          <Link to="/profile" className="nav-link">Profile</Link>
        ) : (
          <Link to="/signin" className="nav-link">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default HomeNavBar;
