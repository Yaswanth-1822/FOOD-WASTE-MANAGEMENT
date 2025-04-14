import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/styles.css';

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState('user'); // 'user' or 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log("Login mode is:", mode); // debug

    try {
      if (mode === 'user') {
        const res = await axios.post('http://localhost:5000/api/signin', {
          username,
          password,
        });
        login(res.data.user, res.data.token);
        navigate('/');
      } else {
        // Admin login
        const res = await axios.post('http://localhost:5000/api/admin/login', {
          adminname: username,
          password,
        });
        console.log("Admin login successful:", res.data.message);
        navigate('/admin');
      }
    } catch (err) {
      console.error("Login error details:", err.response?.data, err.response?.status);
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
    }
  };

  return (
    <div className="container signin-container">
      <h2>Sign In</h2>

      {/* Toggle between user and admin */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '15px' }}>
          <input
            type="radio"
            name="mode"
            value="user"
            checked={mode === 'user'}
            onChange={() => setMode('user')}
          />{' '}
          User
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="admin"
            checked={mode === 'admin'}
            onChange={() => setMode('admin')}
          />{' '}
          Admin
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{mode === 'user' ? 'Username' : 'Adminname'}</label>
          <input
            type="text"
            placeholder={mode === 'user' ? 'Enter your username' : 'Enter adminname'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign In</button>

        {error && <p className="error-text">{error}</p>}

        {mode === 'user' && (
          <div className="links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <span> | </span>
            <Link to="/signup">Sign Up</Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignIn;
