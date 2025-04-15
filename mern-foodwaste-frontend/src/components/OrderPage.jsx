// src/components/OrderPage.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeNavBar from './HomeNavBar';
import Footer from './Footer';
import { AuthContext } from '../context/AuthContext';
import '../styles/orderpage.css';

const OrderPage = () => {
  const { id } = useParams(); // item _id
  const locationHook = useLocation();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [location, setLocation] = useState('');

  // 1. Try React Router state
  const state = locationHook.state || {};
  let { donationId, itemIndex, location: passedLocation } = state;

  // 2. Fallback: query string
  const qs = new URLSearchParams(locationHook.search);
  if (!passedLocation && qs.get('location')) {
    passedLocation = qs.get('location');
  }
  if (!donationId && qs.get('donationId')) {
    donationId = qs.get('donationId');
  }
  if (itemIndex === undefined && qs.get('itemIndex') !== null) {
    itemIndex = Number(qs.get('itemIndex'));
  }

  // Validate on mount
  useEffect(() => {
    if (!auth.isLoggedIn) {
      alert('Please sign in first');
      return navigate('/signin');
    }
    if (!donationId || itemIndex === undefined || !passedLocation) {
      alert('Missing order details. Redirecting you back.');
      return navigate(`/item/${id}`);
    }
    setLocation(passedLocation);
  }, [auth, donationId, itemIndex, passedLocation, navigate, id]);

  // Fetch item details for display
  useEffect(() => {
    axios.get('http://localhost:5000/api/donations')
      .then(res => {
        let found = null;
        res.data.forEach(donation => {
          donation.items.forEach((it, idx) => {
            if (it._id === id) {
              found = { ...it, donationId: donation._id, itemIndex: idx };
            }
          });
        });
        setItem(found);
      })
      .catch(err => {
        console.error('Error fetching item for order:', err);
        alert('Could not load item details');
      });
  }, [id]);

  const handlePlaceOrder = async () => {
    const payload = {
      user: auth.user._id,
      items: [{ donationId, itemIndex }],
      location
    };

    console.log('🛒 Placing order payload:', payload);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/orders',
        payload
      );
      console.log('✅ Order response:', res.data);
      alert('Order placed successfully!');
      navigate('/profile');
    } catch (err) {
      console.error('❌ Order placement failed:', err.response || err.message);
      const msg = err.response?.data?.message || err.message;
      alert(`Failed to place order: ${msg}`);
    }
  };

  if (!item) return <div>Loading order info...</div>;

  return (
    <>
      <HomeNavBar />
      <div className="order-page">
        <h2>Confirm Your Order</h2>
        <p><strong>Item:</strong> {item.name}</p>
        <p><strong>Quantity:</strong> {item.quantity} {item.quantityUnit}</p>
        <p><strong>Location:</strong> {location}</p>
        <button onClick={handlePlaceOrder} className="place-order-button">
          Place Order
        </button>
      </div>
      <Footer />
    </>
  );
};

export default OrderPage;
