// src/components/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HomeNavBar from './HomeNavBar';
import Footer from './Footer';
import '../styles/homepage.css';
import DonationSwiper from './DonationSwiper';

const HomePage = () => {
  const [location, setLocation] = useState('Vizianagaram');
  const [searchQuery, setSearchQuery] = useState('');
  const [donationItems, setDonationItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/donations')
      .then(response => {
        const items = [];
        response.data.forEach(donation => {
          donation.items.forEach(item => {
            items.push({
              ...item,
              donor: donation.donor,
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

  const filteredItems = donationItems.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleCardClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  return (
    <div className="homepage-container">
      <HomeNavBar
        location={location}
        setLocation={setLocation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="body-content">
        <DonationSwiper
          items={[...filteredItems]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10)}
          onCardClick={handleCardClick}
        />

        <h2 style={{ margin: '20px 0' }}>
          Food Items {location && `in ${location}`}
        </h2>
        <div className="items-grid">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="food-card animated-card"
              style={{ minHeight: '350px', padding: '15px', cursor: 'pointer', width: '270px' }}
              onClick={(e) => {
                if (!e.target.classList.contains('order-btn')) {
                  handleCardClick(item._id);
                }
              }}
            >
              <div className="donor-name">
                {item.donor && item.donor.username ? item.donor.username : "Anonymous"}
              </div>
              {item.image ? (
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  className="food-image"
                  style={{ height: '200px', objectFit: 'cover', width: '100%', borderRadius: '4px' }}
                />
              ) : (
                <div className="food-image-placeholder"
                  style={{ backgroundColor: '#ccc', width: '100%', height: '200px', borderRadius: '4px' }}></div>
              )}
              <div className="food-details">
                <h3 className="food-name">{item.name}</h3>
                <p className="food-description">{item.description}</p>
                <p className="food-quantity">
                  {item.quantity} {item.quantityUnit}
                </p>
              </div>
              <div className="food-card-buttons">
                <button className="order-btn">Order</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
