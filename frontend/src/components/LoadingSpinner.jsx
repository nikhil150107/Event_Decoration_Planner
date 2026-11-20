import React from 'react';
import '../styles/Cards.css';

const LoadingSpinner = ({ message = 'Loading catalog items from server...' }) => {
  return (
    <div className="spinner-container">
      <div className="modern-spinner"></div>
      <p className="spinner-text">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
