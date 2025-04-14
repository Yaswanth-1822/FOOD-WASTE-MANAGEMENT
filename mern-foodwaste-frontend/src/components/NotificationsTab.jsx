import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/notifications.css';

const NotificationsTab = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/notifications').then(res => setLogs(res.data));
  }, []);

  return (
    <div className="notifications-tab">
      <h2>Activity Logs</h2>
      {logs.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        <ul>
          {logs.map((log, idx) => (
            <li key={idx}>
              <strong>[{log.type.toUpperCase()}]</strong> {log.message}
              <br />
              <small>{new Date(log.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsTab;
