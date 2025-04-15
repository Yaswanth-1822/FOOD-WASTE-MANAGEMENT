import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage       from './components/HomePage';
import DonationPage   from './components/DonationPage';
import SignIn         from './components/SignIn';
import SignUp         from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import UserProfile    from './components/UserProfile';
import ItemDetails    from './components/ItemDetails';
import AdminLanding   from './components/AdminLanding';  // ← import admin

import { AuthContext } from './context/AuthContext';
import ItemDetails from './components/ItemDetails';
const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  if (!auth.isLoggedIn) {
    alert("Please log in to donate food");
    return <Navigate to="/signin" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/item/:id" element={<ItemDetails />} />

        {/* Protected user route */}
        <Route 
          path="/donate" 
          element={
            <ProtectedRoute>
              <DonationPage />
            </ProtectedRoute>
          } 
        />

        {/* Profile */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/item/:id" element={<ItemDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
