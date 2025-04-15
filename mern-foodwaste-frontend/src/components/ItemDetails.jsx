import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeNavBar from './HomeNavBar';
import Footer from './Footer';
import { AuthContext } from '../context/AuthContext';
import '../styles/itemdetails.css';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [useSaved, setUseSaved] = useState(false);
  const [manualLocation, setManualLocation] = useState('');

  // Fetch the item with donationId & itemIndex
  useEffect(() => {
    axios.get('http://localhost:5000/api/donations')
      .then(res => {
        let found = null;
        res.data.forEach(donation => {
          donation.items.forEach((it, idx) => {
            if (it._id === id) {
              found = {
                ...it,
                donor: donation.donor,
                donationId: donation._id,
                itemIndex: idx
              };
            }
          });
        });
        setItem(found);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!item) return <div>Loading...</div>;

  const openPopup = () => {
    if (!auth.isLoggedIn) {
      alert('Please sign in to place an order');
      return navigate('/signin');
    }
    setUseSaved(false);
    setManualLocation('');
    setShowPopup(true);
  };

  const handleContinue = () => {
    let loc = '';
    if (useSaved) {
      loc = auth.user.location || '';
      if (!loc) {
        alert('No saved location on your profile');
        return;
      }
    } else {
      loc = manualLocation.trim();
      if (!loc) {
        alert('Please enter a location');
        return;
      }
    }

    setShowPopup(false);
    navigate(`/order/${id}`, {
      state: {
        donationId: item.donationId,
        itemIndex: item.itemIndex,
        location: loc
      }
    });
  };

  return (
    <>
      <HomeNavBar />

      <div className="item-details-container">
        <div className="item-details-content">
          <h2>{item.name}</h2>
          <img
            src={`data:image/jpeg;base64,${item.image}`}
            alt={item.name}
            className="item-image"
          />
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Quantity:</strong> {item.quantity} {item.quantityUnit}</p>
          <p><strong>Donor:</strong> {item.donor?.username || 'Anonymous'}</p>

          <button
            onClick={openPopup}
            className="order-button"
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Order This Food
          </button>
        </div>

        <div className="item-details-description">
          <h3>About this item</h3>
          <p>
            This food item has been generously donated to reduce food waste.
            Make sure to place an order if you are in need and within the
            delivery location. All donations are free of charge.
          </p>
        </div>
      </div>

      {showPopup && (
        <div className="location-popup">
          <div className="popup-content">
            <h3>Choose Delivery Location</h3>

            <label>
              <input
                type="radio"
                checked={useSaved}
                onChange={() => setUseSaved(true)}
              />{' '}
              Use my saved location
            </label>
            <br />

            <label>
              <input
                type="radio"
                checked={!useSaved}
                onChange={() => setUseSaved(false)}
              />{' '}
              Enter a new location
            </label>

            {!useSaved && (
              <input
                type="text"
                placeholder="Enter your location"
                value={manualLocation}
                onChange={e => setManualLocation(e.target.value)}
                style={{ width: '100%', marginTop: '10px', padding: '8px' }}
              />
            )}

            <div style={{ marginTop: '15px' }}>
              <button onClick={handleContinue} style={{ marginRight: '10px' }}>
                Continue
              </button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ItemDetails;
