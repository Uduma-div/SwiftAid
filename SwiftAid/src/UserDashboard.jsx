import React from 'react';
import { Link } from 'react-router-dom';
import './UserDashboard.css';
import { auth } from './firebase';
import  { useState, useEffect } from 'react';

const UserDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="user-dashboard">
      {user ? (
        <div>
        <h2>Welcome to Your Dashboard</h2>
        <div className="dashboard-grid">
          <Link to="/appointment" className="dashboard-item">
            <h3>Appointments</h3>
            <p>View and manage your appointments</p>
          </Link>
          <Link to="/records" className="dashboard-item">
            <h3>Medical Records</h3>
            <p>Access your medical history</p>
          </Link>
          <Link to="/emergency" className="dashboard-item">
            <h3>Emergency Services</h3>
            <p>Quick access to emergency ambulance</p>
          </Link>
          <Link to="/doctors" className="dashboard-item">
            <h3>Find a Doctor</h3>
            <p>Browse our list of healthcare professionals</p>
          </Link>
          </div>
          </div>
      ) : (
        <p>Please log in to access the dashboard.</p>
      )}
    </div>
  );
};

export default UserDashboard;