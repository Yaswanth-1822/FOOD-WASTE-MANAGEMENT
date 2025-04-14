import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/orders.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPeople, setDeliveryPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, dpRes] = await Promise.all([
          axios.get('/api/orders'),
          axios.get('/api/delivery-persons')
        ]);
        
        setOrders(ordersRes.data);
        setDeliveryPeople(dpRes.data.filter(p => p.isActive));
        setError('');
      } catch (err) {
        console.error('Data loading failed:', err);
        setError('Failed to load orders. Please try refreshing the page.');
        setOrders([]);
        setDeliveryPeople([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const reloadAll = async () => {
    try {
      const [ordersRes, dpRes] = await Promise.all([
        axios.get('/api/orders'),
        axios.get('/api/delivery-persons')
      ]);
      
      setOrders(ordersRes.data);
      setDeliveryPeople(dpRes.data.filter(p => p.isActive));
      setError('');
    } catch (err) {
      console.error('Reload failed:', err);
      setError('Failed to refresh data. Please check your connection.');
    }
  };

  const assign = async (orderId, dpId) => {
    if (!dpId) return;
    try {
      await axios.put(`/api/orders/${orderId}/assign`, { deliveryPersonId: dpId });
      await reloadAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Assign failed');
    }
  };

  const deliver = async order => {
    if (!order.assignedTo) {
      return alert('Assign a delivery person first');
    }
    try {
      await axios.put(`/api/orders/${order._id}/deliver`);
      await reloadAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Deliver failed');
    }
  };

  return (
    <div className="orders-mgmt">
      <h2>🧾 Orders & Fulfillment</h2>
      {error && <div className="error-banner">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>User</th><th>Items</th><th>Assign To</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order._id}>
                  <td>{order.user?.username || 'Unknown'}</td>
                  <td>
                    {order.items.map((it, i) => (
                      <div key={i}>
                        {it.donationId?.slice(-4)}‑#{it.itemIndex + 1}
                      </div>
                    ))}
                  </td>
                  <td>
                    <select
                      value={order.assignedTo?._id || ''}
                      onChange={e => assign(order._id, e.target.value)}
                      disabled={order.status !== 'pending' || order.assignedTo}
                    >
                      <option value="">— Unassigned —</option>
                      {deliveryPeople.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>{order.status}</td>
                  <td>
                    {order.status === 'in-process' && (
                      <button onClick={() => deliver(order)}>
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-orders">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderManagement;