// src/components/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="navbar-left">
          <h1>Food Wastage Management and Optimization</h1>
        </div>
        <div className="navbar-right">
          <Link to="/signin" className="nav-btn">Sign In</Link>
          <Link to="/signup" className="nav-btn">Sign Up</Link>
        </div>
      </nav>
      <div className="landing-content">
        <div className="option">
          <Link to="/donate" className="option-btn">Donate</Link>
        </div>
        <div className="option">
          <Link to="/get-food" className="option-btn">Get Food</Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
