// src/Pages/LoginPage.js
import React from 'react';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    onLogin(); // Call the onLogin function passed from App.js
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          Find<span className="logo-accent">Q</span>Me
        </div>
        <form onSubmit={handleSubmit}> {/* Add a form element */}
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter your username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>
          <button className="login-button" type="submit">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;