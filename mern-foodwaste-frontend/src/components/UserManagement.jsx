import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/users.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');

  useEffect(() => {
    axios.get('/api/admin/users')
      .then(res => {
        setUsers(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let result = [...users];

    // Search
    if (search) {
      result = result.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Activity filter
    if (activityFilter === 'donors') {
      result = result.filter(u => u.totalDonations > 0 && u.totalOrders === 0);
    } else if (activityFilter === 'orderers') {
      result = result.filter(u => u.totalOrders > 0 && u.totalDonations === 0);
    } else if (activityFilter === 'both') {
      result = result.filter(u => u.totalOrders > 0 && u.totalDonations > 0);
    } else if (activityFilter === 'inactive') {
      result = result.filter(u => u.totalOrders === 0 && u.totalDonations === 0);
    }

    setFiltered(result);
  }, [search, activityFilter, users]);

  return (
    <div className="users-mgmt">
      <h2>Users & Donors</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={activityFilter} onChange={e => setActivityFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="donors">Only Donors</option>
          <option value="orderers">Only Orderers</option>
          <option value="both">Donor & Orderer</option>
          <option value="inactive">Inactive Users</option>
        </select>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Registered</th>
            <th>Total Donations</th>
            <th>Total Orders</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>{u.totalDonations}</td>
              <td>{u.totalOrders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
