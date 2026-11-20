import React, { useState, useEffect } from 'react';
import { getThemes } from '../services/api';
import ThemeCard from '../components/ThemeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import '../styles/Pages.css';

const ThemesPage = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchThemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getThemes();
      const list = Array.isArray(data) ? data : data?.content || [];
      setThemes(list);
    } catch (err) {
      setError(err.message || 'Failed to fetch themes from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadThemes = async () => {
      try {
        const data = await getThemes();
        if (active) {
          const list = Array.isArray(data) ? data : data?.content || [];
          setThemes(list);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to fetch themes from server');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadThemes();
    return () => {
      active = false;
    };
  }, []);

  // Filtered themes
  const filteredThemes = themes.filter((theme) => {
    const q = searchQuery.toLowerCase();
    const nameMatches = theme.themeName?.toLowerCase().includes(q);
    const descMatches = theme.description?.toLowerCase().includes(q);
    return nameMatches || descMatches;
  });

  return (
    <div className="page-container">
      {/* Header Banner */}
      <section className="page-hero">
        <div className="hero-content">
          <span className="hero-badge">Step 1: Choose Your Vibe</span>
          <h1 className="hero-title">Explore Event Themes</h1>
          <p className="hero-subtitle">
            Select a signature decoration theme that defines the ambience, color palette,
            and luxury feel of your special celebration.
          </p>

          <div className="search-bar-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by theme name (e.g. Royal Wedding, Birthday, Corporate)..."
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

      {/* Main Content Area */}
      <div className="page-content">
        {loading && <LoadingSpinner message="Connecting to GET /api/themes..." />}

        {!loading && error && (
          <ErrorAlert
            title="Backend Server Not Reachable"
            message={`Error calling GET /api/themes: ${error}`}
            onRetry={fetchThemes}
          />
        )}

        {!loading && !error && filteredThemes.length === 0 && (
          <EmptyState
            icon="🎨"
            title={searchQuery ? 'No Matching Themes Found' : 'No Themes in Catalog'}
            description={
              searchQuery
                ? `No decoration theme matches "${searchQuery}". Try a different keyword.`
                : 'The database currently contains no themes. Make sure the backend database is seeded.'
            }
            actionLabel={searchQuery ? 'Clear Search' : 'Reload Themes'}
            onAction={searchQuery ? () => setSearchQuery('') : fetchThemes}
          />
        )}

        {!loading && !error && filteredThemes.length > 0 && (
          <div className="themes-grid">
            {filteredThemes.map((theme) => (
              <ThemeCard key={theme.themeId || theme.id} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemesPage;
