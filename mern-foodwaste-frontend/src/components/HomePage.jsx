// src/components/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeNavBar from './HomeNavBar';
import '../styles/homepage.css';

const HomePage = () => {
  const [location, setLocation] = useState('Vizianagaram');
  const [searchQuery, setSearchQuery] = useState('');
  const [donationItems, setDonationItems] = useState([]);

  // Fetch donation records from the backend and flatten the items array
  useEffect(() => {
    axios.get('http://localhost:5000/api/donations')
      .then(response => {
        const items = [];
        response.data.forEach(donation => {
          donation.items.forEach(item => {
            items.push({
              ...item,
              donor: donation.donor,         // donor field is populated with username via populate()
              donationId: donation._id,
              itemsCount: donation.items.length
            });
          });
        });
        setDonationItems(items);
      })
      .catch(error => {
        console.error("Error fetching donations:", error);
      });
  }, []);

  // Filter items based on search query
  const filteredItems = donationItems.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="homepage-container">
      <HomeNavBar
        location={location}
        setLocation={setLocation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="body-content">
        <h2 style={{ margin: '20px 0' }}>
          Food Items {location && `in ${location}`}
        </h2>
        <div className="items-grid">
          {filteredItems.map((item, index) => (
            <div key={index} className="food-card animated-card" style={{ minHeight: '350px', padding: '15px' }}>
              {/* If multiple items in donation, label as "Family Pack" */}
              {item.itemsCount > 1 && (
                <div className="offer-label">Family Pack</div>
              )}
              {/* Display donor's username */}
              <div className="donor-name">
                {item.donor && item.donor.username ? item.donor.username : "Anonymous"}
              </div>
              {/* Food image or gray placeholder */}
              {item.image ? (
                <img 
                  src={`data:image/jpeg;base64,${item.image}`} 
                  alt={item.name} 
                  className="food-image" 
                  style={{ height: '200px', objectFit: 'cover', width: '100%', borderRadius: '4px' }}
                />
              ) : (
                <div 
                  className="food-image-placeholder" 
                  style={{ backgroundColor: '#ccc', width: '100%', height: '200px', borderRadius: '4px' }}
                ></div>
              )}
              {/* Food details */}
              <div className="food-details">
                <h3 className="food-name">{item.name}</h3>
                <p className="food-description">{item.description}</p>
                <p className="food-quantity">
                  {item.quantity} {item.quantityUnit}
                </p>
              </div>
              {/* Action Buttons */}
              <div className="food-card-buttons">
                <button className="order-btn">Order</button>
                <button className="view-btn">View More Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
