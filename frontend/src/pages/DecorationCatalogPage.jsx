import React, { useState, useEffect, useMemo } from 'react';
import { getDecorationItems } from '../services/api';
import DecorationCard from '../components/DecorationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import '../styles/Pages.css';

const DecorationCatalogPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDecorationItems();
      const list = Array.isArray(data) ? data : data?.content || [];
      setItems(list);
    } catch (err) {
      setError(err.message || 'Failed to fetch decoration items from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadItems = async () => {
      try {
        const data = await getDecorationItems();
        if (active) {
          const list = Array.isArray(data) ? data : data?.content || [];
          setItems(list);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to fetch decoration items from server');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadItems();
    return () => {
      active = false;
    };
  }, []);

  // Compute unique categories dynamically from API data
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [items]);

  // Filter items by category and search keyword
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.itemName?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-content">
          <span className="hero-badge">Step 2: Add Decoration Items</span>
          <h1 className="hero-title">Decoration Products Catalog</h1>
          <p className="hero-subtitle">
            Browse our handpicked inventory of balloon structures, floral arrangements,
            ambient lighting, stage centerpieces, and backdrops.
          </p>

          {/* Search Bar */}
          <div className="search-bar-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search items by name, category, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="btn-clear-search"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <div className="page-content">
        {/* Category Filter Pills */}
        {categories.length > 1 && (
          <div className="category-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'ALL' ? '🌟 All Items' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && <LoadingSpinner message="Connecting to GET /api/decoration-items..." />}

        {/* Error State */}
        {!loading && error && (
          <ErrorAlert
            title="Backend Server Not Reachable"
            message={`Error calling GET /api/decoration-items: ${error}`}
            onRetry={fetchItems}
          />
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <EmptyState
            icon="🎈"
            title={searchQuery || selectedCategory !== 'ALL' ? 'No Items Found' : 'Catalog is Empty'}
            description={
              searchQuery || selectedCategory !== 'ALL'
                ? `No decoration items match the selected category "${selectedCategory}" and search "${searchQuery}".`
                : 'No decoration products are available in the database yet. Please ensure the backend is seeded.'
            }
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
          />
        )}

        {/* Items Grid */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="catalog-grid">
            {filteredItems.map((item) => (
              <DecorationCard key={item.itemId || item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DecorationCatalogPage;
