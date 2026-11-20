import React, { useState } from 'react';
import { useEvent } from '../context/EventContext';
import '../styles/Cards.css';

const DEFAULT_DECORATION_IMAGE =
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80';

const DecorationCard = ({ item }) => {
  const { addItemToEvent } = useEvent();
  const [quantity, setQuantity] = useState(1);
  const [imgSrc, setImgSrc] = useState(item.imageUrl || DEFAULT_DECORATION_IMAGE);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(item.price || 0);

  const availableQty = item.availableQuantity !== undefined ? item.availableQuantity : 10;
  const isOutOfStock = availableQty <= 0;

  const handleIncrement = () => {
    if (quantity < availableQty) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAdd = () => {
    addItemToEvent(item, quantity);
  };

  return (
    <div className={`decoration-card ${isOutOfStock ? 'card-out-of-stock' : ''}`}>
      <div className="card-image-wrapper">
        <img
          src={imgSrc}
          alt={item.itemName}
          className="card-image"
          onError={() => setImgSrc(DEFAULT_DECORATION_IMAGE)}
          loading="lazy"
        />
        <span className="category-pill">{item.category || 'General'}</span>
        {isOutOfStock && <span className="sold-out-badge">Out of Stock</span>}
      </div>

      <div className="card-body">
        <div className="item-header">
          <h3 className="card-title">{item.itemName}</h3>
          <span className="stock-info">
            {isOutOfStock ? (
              <span className="stock-empty">Unavailable</span>
            ) : (
              <span className="stock-available">{availableQty} in stock</span>
            )}
          </span>
        </div>

        <p className="card-description">
          {item.description || 'Premium decoration product for your celebration.'}
        </p>

        <div className="card-footer">
          <div className="price-tag">
            <span className="price-label">Unit Price</span>
            <span className="price-amount">{formattedPrice}</span>
          </div>

          {!isOutOfStock && (
            <div className="quantity-controls">
              <button
                type="button"
                className="btn-qty"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                type="button"
                className="btn-qty"
                onClick={handleIncrement}
                disabled={quantity >= availableQty}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}

          <button
            className="btn-primary btn-add-event"
            onClick={handleAdd}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecorationCard;
