import React from 'react';
import '../styles/Navbar.css';

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <h4>✨ Event Decoration Planner</h4>
          <p>
            Theme & Decoration Management Module for planning weddings, birthdays,
            corporate galas, and celebrations.
          </p>
        </div>
        <div className="footer-meta">
          <p>© {currentYear} Event Decoration Planner • Full-Stack College Project</p>
          <p className="footer-tech">React + Spring Boot + JPA + MySQL</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
