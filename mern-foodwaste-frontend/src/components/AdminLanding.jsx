// src/components/AdminLanding.jsx
import React, { useState, createContext } from 'react';
import '../styles/admin.css';
import DeliveryManagement from './DeliveryManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import QualityControl from './QualityControl';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './AdminSettings';
import NotificationsTab from './NotificationsTab';
import DonationsManagement from './DonationsManagement'; // new

export const TabContext = createContext();

const TABS = [
  { key: 'delivery', label: 'Delivery Personnel' },
  { key: 'orders',   label: 'Orders & Fulfillment' },
  { key: 'users',    label: 'Users & Donors' },
  { key: 'donations',label: 'Donations' },            // new
  { key: 'qa',       label: 'Quality Control' },
  { key: 'reports',  label: 'Analytics' },
  { key: 'settings', label: 'Settings' },
  { key: 'alerts',   label: 'Notifications' },
];

const AdminLanding = () => {
  const [activeTab, setActiveTab] = useState('delivery');

  const renderTab = () => {
    switch (activeTab) {
      case 'delivery':   return <DeliveryManagement />;
      case 'orders':     return <OrderManagement />;
      case 'users':      return <UserManagement />;
      case 'donations':  return <DonationsManagement />;
      case 'qa':         return <QualityControl />;
      case 'reports':    return <AdminAnalytics />;
      case 'settings':   return <AdminSettings />;
      case 'alerts':     return <NotificationsTab />;
      default:           return null;
    }
  };

  return (
    <TabContext.Provider value={{ switchTab: setActiveTab }}>
      <div className="admin-container">
        <aside className="admin-sidebar">
          <h1>Admin Dashboard</h1>
          {TABS.map(tab => (
            <div
              key={tab.key}
              className={`sidebar-item ${activeTab===tab.key?'active':''}`}
              onClick={()=>setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </aside>
        <main className="admin-main">
          {renderTab()}
        </main>
      </div>
    </TabContext.Provider>
  );
};

export default AdminLanding;
