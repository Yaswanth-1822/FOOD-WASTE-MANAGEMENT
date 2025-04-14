import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/settings.css';

const AdminSettings = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const clearLogs = async () => {
    if (window.confirm("Clear all activity logs?")) {
      try {
        await axios.delete('/api/admin/notifications');
        alert("Activity logs cleared");
      } catch (error) {
        alert("Failed to clear logs");
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout(); // Clear authentication state
      navigate('/signin'); // Redirect to signin
    }
  };

  return (
    <div className="admin-settings">
      <h2>Settings</h2>
      <div className="settings-card">
        <p><strong>Clear Activity Logs</strong></p>
        <button onClick={clearLogs}>Clear Notifications</button>
      </div>

      <div className="settings-card">
        <p><strong>Log Out</strong></p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default AdminSettings;