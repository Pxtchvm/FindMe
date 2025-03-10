// src/Pages/SearchInterface.js

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchInterface.css'; // Create this CSS file

function SearchInterface() {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item; // Get the item data passed from StudentDashboard

  if (!item) {
    // Handle the case where no item data is passed
    return <div>Item not found.</div>;
  }

  return (
    <div className="search-interface-container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>

      <div className="content">
        <div className="item-details">
          <h2>{item.name}</h2>
          <p className="category">{item.category}</p>

          <div className="description">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="date">
            <span className="icon">📅</span> {item.date}
          </div>

          <div className="location">
            <span className="icon">📍</span> {item.location}
          </div>

          <div className="surrendered-by">
            <span className="icon">👤</span> {item.surrenderedBy}
          </div>
        </div>

        <div className="item-image">
          <img src={item.image} alt={item.name} />
        </div>
      </div>

      <button className="claim-btn">CLAIM THIS ITEM</button>
    </div>
  );
}

export default SearchInterface;