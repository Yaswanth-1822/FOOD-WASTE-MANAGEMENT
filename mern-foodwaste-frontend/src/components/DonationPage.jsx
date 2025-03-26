// src/components/DonationPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/donation.css';

const DonationPage = () => {
  const [donationType, setDonationType] = useState('homemade');
  const [items, setItems] = useState([{}]);

  const handleAddItem = () => {
    setItems([...items, {}]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleUpload = () => {
    console.log('Uploading items:', items);
    alert('Items uploaded (simulated)!');
  };

  return (
    <div className="donation-page">
      {/* NAVBAR */}
      <nav className="navbar donation-nav">
        <div className="nav-left">
          <div className="logo">Food Waste Management</div>
        </div>
        <div className="nav-middle">
          <h2>Donate Food</h2>
        </div>
        <div className="nav-right">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/cart" className="nav-link">Cart</Link>
          <Link to="/signin" className="nav-link">Sign In</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </div>
      </nav>

      {/* Main Content */}
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

        {/* Toggle Buttons */}
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

        {/* Donation Form Cards */}
        <div className="items-container">
          {items.map((item, index) => (
            <div className="donation-card" key={index}>
              <h3>{donationType === 'homemade' ? 'Home Made Item' : 'Packed Item'}</h3>

              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  placeholder="Enter item name"
                  value={item.name || ''}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter description"
                  value={item.description || ''}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Quantity</label>
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity || ''}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  />
                </div>

                {donationType === 'homemade' ? (
                  <div className="form-group half">
                    <label>Time Since Made</label>
                    <input
                      type="text"
                      placeholder="e.g., 2 hrs"
                      value={item.timeSinceMade || ''}
                      onChange={(e) => handleItemChange(index, 'timeSinceMade', e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="form-group half">
                      <label>Made Date</label>
                      <input
                        type="date"
                        value={item.madeDate || ''}
                        onChange={(e) => handleItemChange(index, 'madeDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group half">
                      <label>Expiry Date</label>
                      <input
                        type="date"
                        value={item.expiryDate || ''}
                        onChange={(e) => handleItemChange(index, 'expiryDate', e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Action Row: Scanner and +/- Buttons */}
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
                  <button 
                    onClick={() => handleRemoveItem(index)} 
                    className="remove-btn"
                  >
                    −
                  </button>
                  <button 
                    onClick={handleAddItem} 
                    className="add-btn"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="upload-section">
          <button onClick={handleUpload} className="upload-btn">
            Upload Food Items
          </button>
        </div>
      </div>

      {/* Extra Sections */}
      <div className="extra-info">
        <h2>Why Donate?</h2>
        <p>
          Donating food not only helps reduce waste, but transforms surplus into hope.
          Every item you donate brings nourishment to someone in need.
          Join us in building a sustainable, caring community.
        </p>
      </div>

      <div className="extra-section">
        <h2>Our Impact</h2>
        <p>
          With thousands of meals served and countless lives touched, our platform is making
          a real difference. Learn how your contributions are turning into smiles and hope.
        </p>
      </div>

      {/* Footer */}
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
