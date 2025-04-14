import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/admin-analytics.css';
import { TabContext } from './AdminLanding';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminAnalytics = () => {
  const { switchTab } = useContext(TabContext);
  const [stats, setStats] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [startDate, endDate]);

  const fetchStats = async () => {
    const params = {};
    if (startDate) params.start = startDate.toISOString();
    if (endDate)   params.end   = endDate.toISOString();
    const res = await axios.get('http://localhost:5000/api/admin/stats', { params });
    setStats(res.data);
  };

  if (!stats) return <p className="loading">Loading analytics…</p>;

  const barData = {
    labels: stats.weeklyDonations.map(d => `Wk ${d._id}`),
    datasets: [{
      label: 'Weekly Donations',
      data: stats.weeklyDonations.map(d => d.count),
      backgroundColor: 'rgba(52,152,219,0.7)',
      borderRadius: 4,
      barPercentage: 0.6
    }]
  };

  const pieData = {
    labels: stats.recentDonors.map(d => d.username),
    datasets: [{
      data: stats.recentDonors.map(d => d.count),
      backgroundColor: ['#3498db','#e74c3c','#f1c40f','#2ecc71','#9b59b6']
    }]
  };

  return (
    <div className="admin-analytics">
      <h2>📊 Platform Analytics</h2>

      <div className="date-filters">
        <DatePicker
          selected={startDate}
          onChange={setStartDate}
          placeholderText="Start Date"
          className="date-input"
        />
        <DatePicker
          selected={endDate}
          onChange={setEndDate}
          placeholderText="End Date"
          className="date-input"
        />
      </div>

      <div className="summary-cards">
        {[
          { icon: '👥', label: 'Users',     value: stats.totalUsers,          tab: 'users'     },
          { icon: '📦', label: 'Donations', value: stats.totalDonations,      tab: 'donations' },
          { icon: '🛒', label: 'Orders',    value: stats.totalOrders,         tab: 'orders'    },
          { icon: '🚚', label: 'Delivery',  value: stats.totalDeliveryPersons,tab: 'delivery'  },
        ].map((c,i) => (
          <div key={i} className="card" onClick={() => switchTab(c.tab)}>
            <div className="card-icon">{c.icon}</div>
            <div className="card-info">
              <h3>{c.value}</h3>
              <p>{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-container">
        <div className="chart-box bar">
          <h4>📈 Weekly Donations</h4>
          <div className="bar-wrapper">
            <Bar
              data={barData}
              options={{
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
              }}
            />
          </div>
        </div>

        <div className="chart-box pie">
          <h4>🏆 Top Donors</h4>
          <div className="pie-wrapper">
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      <div className="top-donors-list">
        <h3>👑 Top Donors</h3>
        <ul>
          {stats.recentDonors.map((d,i) => (
            <li key={i} onClick={() => switchTab('users')}>
              <span className="rank">{i+1}</span>
              <span className="name">{d.username}</span>
              <span className="count">{d.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminAnalytics;
