import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NavBar from './NavBar';
import '../styles/userprofiles.css';
import axios from 'axios';

const UserProfile = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [donations, setDonations] = useState([]);
  const [orders, setOrders] = useState([]);

  // 🚫 Removed invalid code at top-level:
  // - You had useEffect and axios.get() *outside* of component, which is not allowed.
  // - These MUST be inside the functional component body.

  useEffect(() => {
    if (auth.user?._id) {
      axios.get(`http://localhost:5000/api/user/${auth.user._id}`)
        .then(res => {
          if (res.data.profileImage) {
            setProfileImage(`data:image/jpeg;base64,${res.data.profileImage}`);
          }
        })
        .catch(err => console.error(err));

      axios.get(`http://localhost:5000/api/user/${auth.user._id}/donations`)
        .then(res => setDonations(res.data))
        .catch(err => console.error(err));

      axios.get(`http://localhost:5000/api/user/${auth.user._id}/orders`)
        .then(res => setOrders(res.data))
        .catch(err => console.error(err));
    }
  }, [auth.user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', auth.user._id);

      try {
        const res = await axios.post('http://localhost:5000/api/upload-profile-image', formData);
        if (res.data.user.profileImage) {
          setProfileImage(`data:image/jpeg;base64,${res.data.user.profileImage}`);
        }
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }
  };

  const triggerFileSelect = () => fileInputRef.current.click();

  return (
    <>
      <NavBar />
      <div className="user-profile-wrapper">
        <div className="top-section">
          <div className="left-column">
            <div className="profile-image-container">
              <img
                src={profileImage || '/default-avatar.png'}
                alt="Profile"
                className="profile-image"
              />
              <button className="edit-image-btn" onClick={triggerFileSelect}>Edit</button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="right-column">
            <div className="user-info">
              <p><strong>Name:</strong> {auth.user.name}</p>
              <p><strong>Contact:</strong> {auth.user.contact || 'N/A'}</p>
              <p><strong>Email:</strong> {auth.user.email}</p>
              <p><strong>Location:</strong> {auth.user.location || 'N/A'}</p>
              <p><strong>Charity Account:</strong> {auth.user.charityAccount || 'N/A'}</p>
              <button className="edit-profile-btn">Edit Profile</button>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Donations</h3>
          <div className="card-list">
            {donations.map((item, index) => (
              <div className="card" key={index}>
                <p>{item.foodName || 'Donation item'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Orders</h3>
          <div className="card-list">
            {orders.map((order, index) => (
              <div className="card" key={index}>
                <p>{order.foodName || 'Order item'}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </>
  );
};

export default UserProfile;
