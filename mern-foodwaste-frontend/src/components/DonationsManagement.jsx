import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/donations.css';

const DonationsManagement = () => {
  const [donations, setDonations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    axios.get('http://localhost:5000/api/donations')
      .then(res => {
        setDonations(res.data);
        setFiltered(res.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let results = [...donations];
  
    if (search.trim()) {
      const keyword = search.toLowerCase();
      results = results.filter(d =>
        d.donor?.username?.toLowerCase().includes(keyword) ||
        d.items.some(i => i.name.toLowerCase().includes(keyword))
      );
    }
  
    if (filterType !== 'all') {
      results = results.filter(d =>
        d.items && d.items.some(i => i.donationType?.toLowerCase() === filterType)
      );
    }
  
    setFiltered(results);
  }, [search, filterType, donations]);
  

  return (
    <div className="donations-mgmt">
      <h2>🍱 All Donations</h2>

      <div className="donation-controls">
        <input
          type="text"
          placeholder="🔍 Search by donor or item"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="homemade">Home Made</option>
          <option value="packed">Packed</option>
        </select> */}
      </div>

      <div className="donations-grid">
        {filtered.map(d => (
          <div key={d._id} className="donation-card">
            <p><strong>Donor:</strong> {d.donor?.username || 'Unknown'}</p>
            {d.items.map((it, i) => (
              <div key={i} className="donation-item">
                <p><strong>{it.name}</strong> ({it.quantity} {it.quantityUnit})</p>
                <p>{it.description}</p>
                {/* <p><em>Type: {it.donationType}</em></p> */}
              </div>
            ))}
            <p className="date">{new Date(d.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationsManagement;
