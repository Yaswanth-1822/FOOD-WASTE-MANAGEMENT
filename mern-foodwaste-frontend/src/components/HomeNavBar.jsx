// src/components/HomeNavBar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/NavBar.css';

const HomeNavBar = ({ location, setLocation, searchQuery, setSearchQuery }) => {
  const { auth } = useContext(AuthContext);
  const [editingLocation, setEditingLocation] = useState(false);
  const [inputLocation, setInputLocation] = useState(location);

  // On mount/update, if user is logged in and has a stored location, use it.
  useEffect(() => {
    if (auth.isLoggedIn && auth.user?.location) {
      // Check if setLocation is provided; if not, skip.
      if (typeof setLocation === 'function') {
        setLocation(auth.user.location);
      }
      setInputLocation(auth.user.location);
    }
  }, [auth, setLocation]);

  // Only available in edit mode.
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const detectedCity = data.address.city || data.address.town || data.address.village || data.address.state || "Unknown";
          if (typeof setLocation === 'function') {
            setLocation(detectedCity);
          }
          setInputLocation(detectedCity);
          setEditingLocation(false);
        } catch (err) {
          alert("Could not detect location");
        }
      }, () => {
        alert("Location access denied.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (inputLocation.trim()) {
      if (typeof setLocation === 'function') {
        setLocation(inputLocation.trim());
      }
      setEditingLocation(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center' }}>
        {auth.isLoggedIn && (
          <div className="location-section" style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              onClick={() => setEditingLocation(!editingLocation)}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-geo-alt"
              viewBox="0 0 16 16"
              style={{ marginRight: '5px', cursor: 'pointer' }}
              title="Click to change location"
            >
              <path d="M12.166 8.94c-.246.348-.58.81-1.042 1.298-.514.56-1.114 1.175-1.76 1.84C8.558 12.787 8.26 13.1 8 13.382c-.26-.282-.558-.595-.364-.5l.5.384a.607.607 0 0 0 .643 0l.5-.384c.194-.095-.104-.218-.364-.5-.26.282-.558.595-.364.5l.5-.384a.607.607 0 0 1 .643 0l.5.384c.194.095-.104.218-.364.5-.26-.282-.558-.595-.364-.5l.5-.384a.607.607 0 0 1 .643 0l.5.384z"/>
              <path fillRule="evenodd" d="M8 0a5 5 0 0 0-5 5c0 5.25 5 9 5 9s5-3.75 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
            </svg>

            {editingLocation ? (
              <form onSubmit={handleManualSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={inputLocation}
                  onChange={(e) => setInputLocation(e.target.value)}
                  placeholder="Enter location"
                  style={{ padding: '2px 6px', fontSize: '14px', marginRight: '5px' }}
                />
                <button type="submit" style={{ marginRight: '5px' }}>Set</button>
                <button type="button" onClick={handleDetectLocation}>Detect</button>
              </form>
            ) : (
              <span className="location-text" style={{ cursor: 'pointer' }}>
                {location}
              </span>
            )}
          </div>
        )}
        <div className="logo" style={{ marginLeft: '15px' }}>Food Waste Management</div>
      </div>

      <div className="nav-middle">
        <input
          type="text"
          className="search-bar"
          placeholder="Search food items..."
          value={searchQuery}
          onChange={(e) => {
            if (typeof setSearchQuery === 'function') {
              setSearchQuery(e.target.value);
            }
          }}
        />
      </div>

      <div className="nav-right">
        <Link to="/homemade" className="nav-link">Home Made Food</Link>
        <Link to="/packed" className="nav-link">Packed Food</Link>
        <Link to="/donate" className="nav-link" onClick={(e) => {
          if (!auth.isLoggedIn) {
            e.preventDefault();
            alert("Please log in to donate food");
          }
        }}>Donate Food</Link>
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

HomeNavBar.defaultProps = {
  setLocation: () => {},
  location: '',
  searchQuery: '',
  setSearchQuery: () => {},
};

export default HomeNavBar;
