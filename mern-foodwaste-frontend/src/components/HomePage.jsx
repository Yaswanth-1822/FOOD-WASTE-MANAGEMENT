// src/components/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HomeNavBar from './HomeNavBar';
import Footer from './Footer';
import '../styles/homepage.css';
import { AuthContext } from '../context/AuthContext';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import SwiperCore, { Navigation, Pagination, EffectCoverflow } from 'swiper';
SwiperCore.use([Navigation, Pagination, EffectCoverflow]);

const HomePage = () => {
  const { auth } = useContext(AuthContext);
  // Set initial location from the logged in user’s stored location.
  const [location, setLocation] = useState(
    auth.isLoggedIn && auth.user?.location ? auth.user.location : ''
  );
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [donationItems, setDonationItems] = useState([]);
  const navigate = useNavigate();

  // Fetch donations and for items missing coordinates, try to fetch them using donationLocation.
  useEffect(() => {
    axios.get('http://localhost:5000/api/donations')
      .then(response => {
        const items = [];
        // Collect all donation items from response.
        response.data.forEach(donation => {
          donation.items.forEach(item => {
            items.push({
              ...item,
              donor: donation.donor,
              donationId: donation._id,
              itemsCount: donation.items.length,
              donationLocation: donation.location,
              donationLat: donation.latitude,   // May be undefined
              donationLon: donation.longitude     // May be undefined
            });
          });
        });

        // For any item without coordinates, attempt to fetch them using the donationLocation string.
        const fetchCoordinatesForItems = async (itemsArray) => {
          const updatedItems = await Promise.all(
            itemsArray.map(async item => {
              if ((!item.donationLat || !item.donationLon) && item.donationLocation) {
                try {
                  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(item.donationLocation)}&format=json`);
                  const data = await res.json();
                  if (data && data.length > 0) {
                    return {
                      ...item,
                      donationLat: parseFloat(data[0].lat),
                      donationLon: parseFloat(data[0].lon)
                    };
                  }
                } catch (error) {
                  console.error("Error geocoding donation location:", error);
                }
              }
              return item;
            })
          );
          return updatedItems;
        };

        fetchCoordinatesForItems(items).then(updatedItems => {
          setDonationItems(updatedItems);
        });
      })
      .catch(error => {
        console.error("Error fetching donations:", error);
      });
  }, []);

  // Forward geocode the nav bar location to get userCoordinates.
  useEffect(() => {
    if (location) {
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            setUserCoordinates({
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon)
            });
          } else {
            setUserCoordinates(null);
          }
        })
        .catch(error => console.error("Error fetching user coordinates:", error));
    }
  }, [location]);

  // Haversine formula: calculate distance (in km) between two coordinates.
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Filter items:
  // • If userCoordinates and donation coordinates are available, check distance (≤ 30 km).
  // • Otherwise, if coordinates are missing, fall back to comparing donation location strings.
  const filteredItems = donationItems.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (userCoordinates && item.donationLat && item.donationLon) {
      const distance = getDistanceFromLatLonInKm(
        userCoordinates.lat,
        userCoordinates.lon,
        item.donationLat,
        item.donationLon
      );
      return distance <= 30;
    }
    // Fallback: if coordinates are not available, compare strings.
    if (item.donationLocation) {
      return item.donationLocation.toLowerCase() === location.toLowerCase();
    }
    return false;
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
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          navigation
          className="swiper-container"
        >
          {[...filteredItems]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10)
            .map(item => (
              <SwiperSlide
                key={item._id}
                className="swiper-slide"
                style={{ width: '300px', height: '400px' }}
                onClick={() => handleCardClick(item._id)}
              >
                <div className="swiper-slide-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
                  {item.image ? (
                    <img
                      src={`data:image/jpeg;base64,${item.image}`}
                      alt={item.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                  ) : (
                    <div style={{ backgroundColor: '#ccc', width: '100%', height: '200px', borderRadius: '10px' }}></div>
                  )}
                  <h3 style={{ margin: '10px 0 5px' }}>{item.name}</h3>
                  <p style={{ fontSize: '14px', color: '#555' }}>{item.description}</p>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>

        <h2 style={{ margin: '20px 0' }}>Food Items near {location}</h2>
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
                {item.donor?.username || "Anonymous"}
              </div>
              {item.image ? (
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  className="food-image"
                  style={{ height: '200px', objectFit: 'cover', width: '100%', borderRadius: '4px' }}
                />
              ) : (
                <div className="food-image-placeholder" style={{ backgroundColor: '#ccc', width: '100%', height: '200px', borderRadius: '4px' }}></div>
              )}
              <div className="food-details">
                <h3 className="food-name">{item.name}</h3>
                <p className="food-description">{item.description}</p>
                <p className="food-quantity">{item.quantity} {item.quantityUnit}</p>
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
