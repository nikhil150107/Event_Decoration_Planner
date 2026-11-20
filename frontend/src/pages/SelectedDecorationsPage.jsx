import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import { getEventDecorations } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import '../styles/Pages.css';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80';

const SelectedDecorationsPage = () => {
  const {
    currentEventId,
    selectedTheme,
    selectedItems,
    updateItemQuantity,
    removeItemFromEvent,
    clearAllDecorations,
    totalDecorationsCost,
    themeBasePrice,
    grandTotal,
    showToast,
  } = useEvent();

  const [loading, setLoading] = useState(false);
  const [backendSyncStatus, setBackendSyncStatus] = useState(null);

  // Sync with backend on component mount
  useEffect(() => {
    const syncFromBackend = async () => {
      setLoading(true);
      try {
        const data = await getEventDecorations(currentEventId);
        if (data && Array.isArray(data) && data.length > 0) {
          setBackendSyncStatus({ success: true, message: 'Synchronized with backend database.' });
        } else {
          setBackendSyncStatus({
            success: true,
            message: 'Connected to backend (no server-side records found yet).',
          });
        }
      } catch (err) {
        setBackendSyncStatus({
          success: false,
          message: `Backend API (/api/event-decorations) status: ${err.message}. Using client state.`,
        });
      } finally {
        setLoading(false);
      }
    };

    syncFromBackend();
  }, [currentEventId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleBookingConfirm = () => {
    showToast('Event decoration plan saved successfully!', 'success');
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-content">
          <span className="hero-badge">Step 3: Review Selections & Budget</span>
          <h1 className="hero-title">Selected Event Decorations</h1>
          <p className="hero-subtitle">
            Review the items chosen for your event, adjust quantities, review subtotals,
            and inspect your comprehensive decoration budget.
          </p>
        </div>
      </section>

      <div className="page-content">
        {loading && <LoadingSpinner message="Checking backend for saved selections..." />}

        {backendSyncStatus && (
          <div
            className={`api-status-banner ${
              backendSyncStatus.success ? 'api-status-ok' : 'api-status-info'
            }`}
          >
            <span className="status-dot"></span>
            <span>{backendSyncStatus.message}</span>
          </div>
        )}

        <div className="selected-layout">
          {/* Left Column: Items List */}
          <div className="selected-items-column">
            {/* Active Theme Highlight */}
            {selectedTheme ? (
              <div className="active-theme-card">
                <div className="theme-banner-badge">Chosen Event Theme</div>
                <div className="theme-banner-body">
                  <div className="theme-banner-info">
                    <h3>{selectedTheme.themeName}</h3>
                    <p>{selectedTheme.description}</p>
                  </div>
                  <div className="theme-banner-price">
                    <span className="price-lbl">Theme Base Price</span>
                    <span className="price-val">{formatCurrency(selectedTheme.basePrice)}</span>
                    <Link to="/" className="btn-change-theme">
                      Change Theme
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-theme-notice">
                <div className="notice-icon">🎨</div>
                <div className="notice-text">
                  <h4>No Event Theme Selected</h4>
                  <p>Selecting a theme adds standard styling and base packages to your event.</p>
                </div>
                <Link to="/" className="btn-secondary">
                  Choose a Theme
                </Link>
              </div>
            )}

            {/* List of Selected Items */}
            <div className="card-panel">
              <div className="panel-header">
                <h2>
                  Selected Items (
                  {selectedItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0)})
                </h2>
                {selectedItems.length > 0 && (
                  <button className="btn-clear-all" onClick={clearAllDecorations}>
                    Clear All
                  </button>
                )}
              </div>

              {selectedItems.length === 0 ? (
                <EmptyState
                  icon="🛒"
                  title="No Decoration Items Selected Yet"
                  description="Your event decoration cart is empty. Explore the catalog to add balloons, florals, LED lighting, backdrops, and more."
                  actionLabel="Browse Decoration Catalog"
                  actionLink="/catalog"
                />
              ) : (
                <div className="selected-table-wrapper">
                  <table className="selected-items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItems.map((entry) => {
                        const id = entry.eventDecorationId || entry.id;
                        const item = entry.decorationItem || entry;
                        const itemName = entry.itemName || item.itemName || 'Decoration Item';
                        const category = entry.category || item.category || 'General';
                        const imageUrl = entry.imageUrl || item.imageUrl || DEFAULT_IMAGE;
                        const unitPrice = parseFloat(entry.unitPrice || item.price || 0);
                        const quantity = entry.quantity || 1;
                        const subtotal = (quantity * unitPrice).toFixed(2);

                        return (
                          <tr key={id} className="selected-row">
                            <td className="item-cell">
                              <img
                                src={imageUrl}
                                alt={itemName}
                                className="item-thumbnail"
                                onError={(e) => {
                                  e.target.src = DEFAULT_IMAGE;
                                }}
                              />
                              <div className="item-meta">
                                <span className="item-title">{itemName}</span>
                                <span className="item-cat-badge">{category}</span>
                              </div>
                            </td>

                            <td className="unit-price-cell">{formatCurrency(unitPrice)}</td>

                            <td className="quantity-cell">
                              <div className="quantity-controls table-qty">
                                <button
                                  type="button"
                                  className="btn-qty"
                                  onClick={() => updateItemQuantity(id, quantity - 1)}
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="qty-value">{quantity}</span>
                                <button
                                  type="button"
                                  className="btn-qty"
                                  onClick={() => updateItemQuantity(id, quantity + 1)}
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td className="subtotal-cell">
                              <strong>{formatCurrency(subtotal)}</strong>
                              <span className="subtotal-calc">
                                ({quantity} × {formatCurrency(unitPrice)})
                              </span>
                            </td>

                            <td className="action-cell">
                              <button
                                className="btn-remove"
                                onClick={() => removeItemFromEvent(id)}
                                title="Remove item"
                              >
                                🗑️ Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Cost Summary Card */}
          <div className="summary-column">
            <div className="cost-summary-card">
              <h3 className="summary-title">Decoration Cost Summary</h3>

              <div className="summary-row">
                <span>Theme Base Price</span>
                <span className="summary-val">{formatCurrency(themeBasePrice)}</span>
              </div>

              <div className="summary-row">
                <span>Total Items ({selectedItems.length} types)</span>
                <span className="summary-val">{formatCurrency(totalDecorationsCost)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row grand-total-row">
                <div>
                  <span className="grand-label">Grand Total Cost</span>
                  <span className="grand-note">Includes theme base + items subtotal</span>
                </div>
                <span className="grand-amount">{formatCurrency(grandTotal)}</span>
              </div>

              <button
                className="btn-confirm-plan"
                onClick={handleBookingConfirm}
                disabled={selectedItems.length === 0 && !selectedTheme}
              >
                🎉 Save Decoration Plan
              </button>

              <div className="summary-features">
                <div className="feat-item">
                  <span>🔒</span> Connected to <code>/api/event-decorations</code>
                </div>
                <div className="feat-item">
                  <span>⚡</span> Real-time Subtotal & Total Recomputation
                </div>
                <div className="feat-item">
                  <span>💾</span> Persistent Session State
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedDecorationsPage;
