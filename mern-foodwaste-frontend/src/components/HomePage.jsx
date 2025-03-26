// src/components/HomePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/homepage.css';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState('Vizianagaram');

  // Dummy categories
  const categories = [
    { id: 1, name: 'Biryani', img: 'https://via.placeholder.com/100?text=Biryani' },
    { id: 2, name: 'Pizza', img: 'https://via.placeholder.com/100?text=Pizza' },
    { id: 3, name: 'Burgers', img: 'https://via.placeholder.com/100?text=Burgers' },
    // ...
  ];

  // Dummy donated items
  const donatedItems = [
    {
      id: 101,
      name: 'Homemade Chicken Biryani',
      location: 'Vizianagaram',
      image: 'https://via.placeholder.com/200?text=Chicken+Biryani',
      type: 'homemade'
    },
    {
      id: 102,
      name: 'Packed Veg Burger',
      location: 'Vizianagaram',
      image: 'https://via.placeholder.com/200?text=Veg+Burger',
      type: 'packed'
    },
  ];

  const filteredItems = donatedItems.filter(item => item.location === location);

  // For demonstration
  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="homepage-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">Food Waste Management</div>
          <select 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            className="location-selector"
          >
            <option value="Vizianagaram">Vizianagaram</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        <div className="nav-middle">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search for food items..."
          />
        </div>

        <div className="nav-right">
          <Link to="/homemade" className="nav-link">Home Made Food</Link>
          <Link to="/packed" className="nav-link">Packed Food</Link>
          <Link to="/cart" className="nav-link">Cart</Link>

          {/* Highlighted Donate Button */}
          <Link to="/donate" className="donate-btn">Donate</Link>

          {isLoggedIn ? (
            <div className="profile-dropdown">
              <button className="profile-btn">My Profile</button>
              <button className="logout-btn" onClick={handleLoginLogout}>
                Log Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/signin" className="nav-link">Sign In</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>

      {/* BODY CONTENT */}
      <div className="body-content">
        {/* Horizontal Scroll */}
        <div className="category-scroll">
          {categories.map(cat => (
            <div key={cat.id} className="category-item">
              <img src={cat.img} alt={cat.name} />
              <p>{cat.name}</p>
            </div>
          ))}
        </div>

        <h2 style={{ margin: '20px 0' }}>
          Food Items in {location}
        </h2>
        <div className="items-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="food-card">
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>Type: {item.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
