// src/Pages/StudentDashboard.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

import Adapter from './Adapter.jpeg'
import Laptop from './Laptop.jpg'
import Wallet from './Wallet.jpg'


function StudentDashboard({ onLogout }) {
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    navigate('/search-interface', { state: { item } });
  };

  // Sample item data (replace with your actual data)
  const items = [
    {
      id: 1,
      name: 'Adapter',
      category: 'Electronics',
      description: 'Old looking Omni adapter',
      date: '05-26-2015',
      location: 'Room 407-Makati',
      surrenderedBy: 'Beatriz Obama',
      image: Adapter, // Replace with your image URL
    },
    {
      id: 2,
      name: 'Laptop',
      category: 'Electronics',
      description: 'Black HP laptop with a dent on the corner.',
      date: '06-15-2023',
      location: 'Library, 2nd Floor',
      surrenderedBy: 'John Doe',
      image: Laptop, // Replace with your image URL
    },
    {
      id: 3,
      name: 'Wallet',
      category: 'Personal Items',
      description: 'Brown leather wallet with ID cards.',
      date: '07-01-2023',
      location: 'Cafeteria',
      surrenderedBy: 'Jane Smith',
      image: Wallet, // Replace with your image URL
    },
    // ... add more items ...
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>FindMe</h1>
          <span>Student Dashboard</span>
        </div>
        <div className="header-right">
          <div className="icons-wrapper">
            <button className="profile-btn" onClick={onLogout}>
              ↪ Logout
            </button>
            <button className="profile-icon">👤</button>
            <Link to="/notifications">
              <button className="notification-btn">🔔</button>
            </Link>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="action-buttons">
          <Link to="/report-item">
            <button className="report-lost-btn">+ Report Lost Item</button>
          </Link>
          <Link to="/report-item">
            <button className="report-found-btn">+ Report Found Item</button>
          </Link>
        </div>

        <div className="search-bar">
          <button className="menu-btn">☰</button>
          <input type="text" placeholder="Search Items..." />
          <button className="search-icon">🔍</button>
        </div>

        <div className="recent-items">
          <h2>Recent Items</h2>
          {items.map((item) => (
            <div className="item-card" key={item.id} onClick={() => handleItemClick(item)}>
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>{item.category} - {item.location} - {item.date}</p>
                <button className="view-details-btn">View Details</button>
              </div>
              <span className="item-status claimed">Claimed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;