// src/components/DonationPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import DonationNavBar from './DonationNavBar'; // Ensure DonationNavBar is correctly implemented
import '../styles/donation.css';

const DonationPage = () => {
  const [donationType, setDonationType] = useState('homemade');
  const [items, setItems] = useState([{
    name: '',
    description: '',
    quantity: '',
    quantityUnit: 'Kg',
    timeSinceMade: '',
    madeDate: '',
    expiryDate: '',
    errors: {}
  }]);
  const [location, setLocation] = useState('Vizianagaram');

  const handleAddItem = () => {
    setItems([...items, {
      name: '',
      description: '',
      quantity: '',
      quantityUnit: 'Kg',
      timeSinceMade: '',
      madeDate: '',
      expiryDate: '',
      errors: {}
    }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (newItems[index].errors && newItems[index].errors[field]) {
      newItems[index].errors[field] = '';
    }
    setItems(newItems);
  };

  const validateItems = () => {
    let valid = true;
    const newItems = items.map(item => {
      let errors = {};
      if (!item.name) {
        errors.name = "Item name is required";
        valid = false;
      }
      if (!item.description) {
        errors.description = "Description is required";
        valid = false;
      }
      if (!item.quantity) {
        errors.quantity = "Quantity is required";
        valid = false;
      }
      if (donationType === 'homemade') {
        if (!item.timeSinceMade) {
          errors.timeSinceMade = "Time Since Made is required";
          valid = false;
        }
      } else {
        if (!item.madeDate) {
          errors.madeDate = "Made Date is required";
          valid = false;
        }
        if (!item.expiryDate) {
          errors.expiryDate = "Expiry Date is required";
          valid = false;
        }
      }
      return { ...item, errors };
    });
    setItems(newItems);
    return valid;
  };

  const handleUpload = async () => {
    if (!validateItems()) {
      alert("Please fill all required fields before submitting.");
      return;
    }
    try {
      const payload = {
        donationType,
        items: items.map(item => {
          const { errors, ...data } = item;
          return { ...data, quantity: Number(data.quantity) };
        })
      };
      console.log("Payload:", payload);
      // Get the token from localStorage (set in AuthContext after login)
      const token = localStorage.getItem("token");
      const response = await axios.post('http://localhost:5000/api/donations', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Donation response:', response.data);
      alert('Donation uploaded successfully!');
      setItems([{
        name: '',
        description: '',
        quantity: '',
        quantityUnit: 'Kg',
        timeSinceMade: '',
        madeDate: '',
        expiryDate: '',
        errors: {}
      }]);
    } catch (error) {
      console.error('Error uploading donation:', error.response ? error.response.data : error);
      alert('Error in uploading. Please try again later.');
    }
  };

  return (
    <div className="donation-page">
      <DonationNavBar location={location} setLocation={setLocation} />

      <div className="donation-content">
        <div className="donation-header">
          <img 
            src="/images/donate-food.jpg" 
            alt="Donate Food" 
            className="header-image" 
          />
          <div className="header-text">
            <h1>Share Your Food, Spread Happiness!</h1>
            <p>
              Every donation makes a difference. Help us reduce food waste while feeding those in need.
            </p>
          </div>
        </div>

        <div className="toggle-buttons">
          <button 
            className={`toggle-btn ${donationType === 'homemade' ? 'active' : ''}`}
            onClick={() => setDonationType('homemade')}
          >
            Home Made
          </button>
          <button 
            className={`toggle-btn ${donationType === 'packed' ? 'active' : ''}`}
            onClick={() => setDonationType('packed')}
          >
            Packed
          </button>
        </div>

        <div className="items-container">
          {items.map((item, index) => (
            <div className="donation-card" key={index}>
              <h3>{donationType === 'homemade' ? 'Home Made Item' : 'Packed Item'}</h3>

              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  placeholder="Enter item name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className={item.errors.name ? 'error' : ''}
                />
                {item.errors.name && <p className="error-text">{item.errors.name}</p>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className={item.errors.description ? 'error' : ''}
                ></textarea>
                {item.errors.description && <p className="error-text">{item.errors.description}</p>}
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Quantity</label>
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className={item.errors.quantity ? 'error' : ''}
                  />
                  {item.errors.quantity && <p className="error-text">{item.errors.quantity}</p>}
                </div>
                <div className="form-group half">
                  <label>Unit</label>
                  <select 
                    value={item.quantityUnit}
                    onChange={(e) => handleItemChange(index, 'quantityUnit', e.target.value)}
                  >
                    <option value="Kg">Kg</option>
                    <option value="Liters">Liters</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Boxes">Boxes</option>
                  </select>
                </div>
              </div>

              {donationType === 'homemade' ? (
                <div className="form-group">
                  <label>Time Since Made</label>
                  <input
                    type="text"
                    placeholder="e.g., 2 hrs"
                    value={item.timeSinceMade}
                    onChange={(e) => handleItemChange(index, 'timeSinceMade', e.target.value)}
                    className={item.errors.timeSinceMade ? 'error' : ''}
                  />
                  {item.errors.timeSinceMade && <p className="error-text">{item.errors.timeSinceMade}</p>}
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Made Date</label>
                    <input
                      type="date"
                      value={item.madeDate}
                      onChange={(e) => handleItemChange(index, 'madeDate', e.target.value)}
                      className={item.errors.madeDate ? 'error' : ''}
                    />
                    {item.errors.madeDate && <p className="error-text">{item.errors.madeDate}</p>}
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      value={item.expiryDate}
                      onChange={(e) => handleItemChange(index, 'expiryDate', e.target.value)}
                      className={item.errors.expiryDate ? 'error' : ''}
                    />
                    {item.errors.expiryDate && <p className="error-text">{item.errors.expiryDate}</p>}
                  </div>
                </>
              )}

              <div className="action-row">
                {donationType === 'homemade' ? (
                  <button 
                    className="scanner-btn"
                    onClick={() => alert('Open food quality scanner (camera)')}
                  >
                    Scan Food Quality
                  </button>
                ) : (
                  <button 
                    className="scanner-btn"
                    onClick={() => alert('Open barcode scanner')}
                  >
                    Scan Barcode
                  </button>
                )}
                <div className="side-actions">
                  <button onClick={() => handleRemoveItem(index)} className="remove-btn">−</button>
                  <button onClick={handleAddItem} className="add-btn">＋</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="upload-section">
          <button onClick={handleUpload} className="upload-btn">Upload Food Items</button>
        </div>
      </div>

      <div className="extra-info">
        <h2>Why Donate?</h2>
        <p>
          Donating food not only helps reduce waste but transforms surplus into hope.
          Every item you donate brings nourishment to someone in need.
          Join us in building a sustainable, caring community.
        </p>
      </div>
      <div className="extra-section">
        <h2>Our Impact</h2>
        <p>
          With thousands of meals served and countless lives touched, our platform is making a real difference.
          Learn how your contributions are turning into smiles and hope.
        </p>
      </div>

      <footer className="footer">
        <p>&copy; 2025 Food Waste Management. All rights reserved.</p>
        <p>
          Designed with care. Contact us at <a href="mailto:support@foodwastagemanagement.com">support@foodwastagemanagement.com</a>
        </p>
      </footer>
    </div>
  );
};

export default DonationPage;
