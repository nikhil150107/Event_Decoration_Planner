import React from 'react';
import '../styles/Cards.css';

const ErrorAlert = ({ message, onRetry, title = 'Unable to Load Data' }) => {
  return (
    <div className="error-alert-container">
      <div className="error-alert-icon">⚠️</div>
      <div className="error-alert-content">
        <h4 className="error-alert-title">{title}</h4>
        <p className="error-alert-message">{message}</p>
        <p className="error-alert-hint">
          Make sure your Spring Boot backend is running on <code>http://localhost:8080</code>.
        </p>
        {onRetry && (
          <button className="btn-retry" onClick={onRetry}>
            🔄 Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
