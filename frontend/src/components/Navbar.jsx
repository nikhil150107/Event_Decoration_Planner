import React from 'react';
import { NavLink } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { selectedItems, selectedTheme } = useEvent();
  const totalItemsCount = selectedItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0);

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon">✨</span>
          <div className="brand-text">
            <span className="brand-title">Event Decoration Planner</span>
            <span className="brand-subtitle">Theme & Decoration Module</span>
          </div>
        </NavLink>

        <nav className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <span className="nav-icon">🎨</span>
            <span>Themes</span>
          </NavLink>

          <NavLink
            to="/catalog"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <span className="nav-icon">🎈</span>
            <span>Decoration Catalog</span>
          </NavLink>

          <NavLink
            to="/selected"
            className={({ isActive }) => (isActive ? 'nav-link active cart-link' : 'nav-link cart-link')}
          >
            <span className="nav-icon">📋</span>
            <span>Selected Items</span>
            {totalItemsCount > 0 && (
              <span className="badge-count">{totalItemsCount}</span>
            )}
          </NavLink>
        </nav>

        {selectedTheme && (
          <div className="theme-pill" title="Currently Selected Event Theme">
            <span className="pill-dot"></span>
            <span className="pill-label">Theme:</span>
            <strong className="pill-name">{selectedTheme.themeName}</strong>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
