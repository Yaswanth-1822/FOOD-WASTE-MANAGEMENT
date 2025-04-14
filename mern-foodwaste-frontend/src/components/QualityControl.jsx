// src/components/QualityControl.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/quality.css';

const QualityControl = () => {
  const [pending, setPending] = useState([]);

  const loadPendingDonations = () => {
    axios.get('/api/admin/pending-donations')
      .then(res => setPending(res.data))
      .catch(err => console.error('Error loading pending donations:', err));
  };

  useEffect(() => {
    loadPendingDonations();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.put(`/api/admin/pending-donations/${id}/${action}`);
      loadPendingDonations();
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Error processing request');
    }
  };

  return (
    <div className="qc-container">
      <h2>Pending Food Donations</h2>
      {pending.length === 0 ? (
        <p>No pending items to review.</p>
      ) : (
        <div className="qc-grid">
          {pending.map(donation => (
            <div key={donation._id} className="qc-card">
              <h3>{donation.donationType.charAt(0).toUpperCase() + donation.donationType.slice(1)} Donation</h3>
              {donation.items.map((item, index) => (
                <div key={index} className="qc-item">
                  <p><strong>Item:</strong> {item.name}</p>
                  <p><strong>Quantity:</strong> {item.quantity} {item.quantityUnit}</p>
                  <p><strong>Description:</strong> {item.description}</p>
                  {donation.donationType === 'homemade' ? (
                    <p><strong>Time Since Made:</strong> {item.timeSinceMade}</p>
                  ) : (
                    <>
                      <p><strong>Made Date:</strong> {new Date(item.madeDate).toLocaleDateString()}</p>
                      <p><strong>Expiry Date:</strong> {new Date(item.expiryDate).toLocaleDateString()}</p>
                    </>
                  )}
                  {/* Optionally display location here if desired */}
                  {donation.location && (
                    <p><strong>Location:</strong> {donation.location}</p>
                  )}
                </div>
              ))}
              <div className="qc-btns">
                <button className="approve" onClick={() => handleAction(donation._id, 'approve')}>
                  Approve
                </button>
                <button className="reject" onClick={() => handleAction(donation._id, 'reject')}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QualityControl;
