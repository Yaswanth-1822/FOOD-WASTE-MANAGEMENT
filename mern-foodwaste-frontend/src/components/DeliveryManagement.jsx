import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/delivery.css';

const DeliveryManagement = () => {
  const [persons, setPersons] = useState([]);
  const [form, setForm]       = useState({ name:'', email:'', phone:'' });
  const [error, setError]     = useState('');

  useEffect(() => load(), []);

  const load = () => {
    axios.get('/api/delivery-persons')
      .then(r => setPersons(r.data))
      .catch(console.error);
  };

  const handleAdd = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/delivery-persons', form);
      setForm({ name:'', email:'', phone:'' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Add failed');
    }
  };

  return (
    <div className="delivery-mgmt">
      <h2>🚚 Delivery Personnel</h2>
      <form onSubmit={handleAdd} className="dp-form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={e=>setForm({...form,name:e.target.value})}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e=>setForm({...form,email:e.target.value})}
          required
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={e=>setForm({...form,phone:e.target.value})}
          required
        />
        <button type="submit">Add</button>
        {error && <p className="error">{error}</p>}
      </form>

      <table className="dp-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Availability</th></tr>
        </thead>
        <tbody>
          {persons.map(p=>(
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.phone}</td>
              <td>
                {p.isActive
                  ? <span className="status available">Available</span>
                  : <span className="status unavailable">Unavailable</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryManagement;
