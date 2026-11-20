import React, { useState } from 'react';
import { useEvent } from '../context/EventContext';
import '../styles/Cards.css';

const DEFAULT_THEME_IMAGE =
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

const ThemeCard = ({ theme }) => {
  const { selectedTheme, selectTheme } = useEvent();
  const [imgSrc, setImgSrc] = useState(theme.imageUrl || DEFAULT_THEME_IMAGE);

  const isSelected = selectedTheme && selectedTheme.themeId === theme.themeId;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(theme.basePrice || 0);

  return (
    <div className={`theme-card ${isSelected ? 'theme-card-selected' : ''}`}>
      <div className="card-image-wrapper">
        <img
          src={imgSrc}
          alt={theme.themeName}
          className="card-image"
          onError={() => setImgSrc(DEFAULT_THEME_IMAGE)}
          loading="lazy"
        />
        {isSelected && (
          <span className="selected-badge">
            ✓ Selected Theme
          </span>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">{theme.themeName}</h3>
        <p className="card-description">
          {theme.description || 'Elevate your event with a cohesive, curated aesthetic.'}
        </p>

        <div className="card-footer">
          <div className="price-tag">
            <span className="price-label">Starting from</span>
            <span className="price-amount">{formattedPrice}</span>
          </div>

          <button
            className={`btn-select ${isSelected ? 'btn-select-active' : ''}`}
            onClick={() => selectTheme(theme)}
          >
            {isSelected ? '✓ Theme Applied' : 'Select Theme'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeCard;
