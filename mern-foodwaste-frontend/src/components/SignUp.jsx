// src/components/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername]  = useState('');
  const [email, setEmail]        = useState('');
  const [password, setPassword]  = useState('');
  const [location, setLocation]  = useState('');
  const [error, setError]        = useState('');

  // Function to auto-detect location using browser Geolocation API and reverse geocoding.
  // This is left here so that new users can auto-fill their location during sign up.
  const autoDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Use OpenStreetMap's Nominatim API for reverse geocoding.
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          // Prioritize specific address components.
          const detectedLocation = data.address.city || data.address.town || data.address.village || data.display_name;
          setLocation(detectedLocation);
        } catch (err) {
          console.error("Error detecting location", err);
          setError("Could not automatically detect your location. Please enter it manually.");
        }
      }, (err) => {
        console.error("Geolocation error", err);
        setError("Unable to retrieve your location. Please enter it manually.");
      });
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        username,
        email,
        password,
        location // include the location field
      });
      console.log("SignUp response:", response.data);
      navigate('/signin');
    } catch (err) {
      console.error("SignUp error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* New Location Field */}
        <div className="form-group">
          <label>Location</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              style={{ flexGrow: 1 }}
            />
            <button
              type="button"
              onClick={autoDetectLocation}
              style={{ marginLeft: '10px' }}
            >
              Auto Detect
            </button>
          </div>
        </div>
        <button type="submit">Create Account</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;
