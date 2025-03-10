import React, { useState } from 'react';
import './Notifications.css';

function Notifications() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Item Claim Approved',
      message: 'Your claim for "MacBook Pro" has been approved. Please visit the lost and found office to collect your item.',
      date: '2025-01-28 14:30',
    },
    {
      id: 2,
      type: 'info',
      title: 'Similar Item Found',
      message: 'A black laptop bag matching your lost description has been reported.',
      date: '2025-01-27 09:15',
    },
    {
      id: 3,
      type: 'warning',
      title: 'Claim Requires Additional Proof',
      message: 'Please provide additional documentation for your claim on "Student ID Card".',
      date: '2025-01-26 16:45',
    },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`notifications-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="notifications-header">
        <h1 style={{ color: isDarkMode ? 'white' : '#333' }}>Notifications</h1>
        <div className="header-actions">
          <button className="preferences-btn" onClick={toggleDarkMode}>
            ⚙️ {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      <div className="notifications-filter">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Unread</button>
        <button className="filter-btn">Claims</button>
        <button className="filter-btn">Updates</button>
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <div className="notification-icon">
              {notification.type === 'success' && '✅'}
              {notification.type === 'info' && 'ℹ️'}
              {notification.type === 'warning' && '⚠️'}
            </div>
            <div className="notification-content">
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
            </div>
            <span className="notification-date">{notification.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;