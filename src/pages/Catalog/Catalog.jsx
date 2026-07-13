import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Catalog.module.css';

const Catalog = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(60);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchCatalogGames = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://www.cheapshark.com/api/1.0/deals?pageSize=30&upperPrice=80'
        );

        const formattedGames = response.data.map((item) => ({
          id: item.dealID,
          title: item.title,
          price: parseFloat(item.salePrice),
          normalPrice: parseFloat(item.normalPrice),
          rating: item.steamRatingPercent > 0 ? (item.steamRatingPercent / 20).toFixed(1) : '4.2',
          image: item.thumb,
          savings: Math.round(parseFloat(item.savings)),
        }));

        setGames(formattedGames);
      } catch (err) {
        console.error('Error fetching catalog:', err);
        setError('Failed to load games catalog. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogGames();
  }, []);

  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = game.price <= maxPrice;
        return matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [games, searchQuery, maxPrice, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setMaxPrice(60);
    setSortBy('featured');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Explore Games Catalog</h1>
        <p className={styles.pageSubtitle}>
          Real-time catalog fetched via CheapShark API. Filter deals by price and rating.
        </p>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Search Game</label>
            <input
              type="text"
              placeholder="Type game title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.priceHeader}>
              <label className={styles.filterLabel}>Max Price</label>
              <span className={styles.priceValue}>${maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className={styles.rangeInput}
            />
          </div>

          <button className={styles.resetBtn} onClick={handleReset}>
            🔄 Reset Filters
          </button>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.topBar}>
            <span className={styles.resultsCount}>
              Showing <strong>{filteredGames.length}</strong> live deals
            </span>

            <div className={styles.sortWrapper}>
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className={styles.noResults}>
              <h2 style={{ color: '#6c5ce7' }}>🔄 Fetching live catalog...</h2>
            </div>
          )}

          {error && (
            <div className={styles.noResults}>
              <h3 style={{ color: '#ff4757' }}>{error}</h3>
            </div>
          )}

          {!loading && !error && filteredGames.length === 0 ? (
            <div className={styles.noResults}>
              <h3>No games match your active filters.</h3>
              <p>Try increasing the price slider.</p>
              <button className={styles.resetBtn} onClick={handleReset}>
                Reset All Filters
              </button>
            </div>
          ) : (
            !loading &&
            !error && (
              <div className={styles.grid}>
                {filteredGames.map((game) => (
                  <div key={game.id} className={styles.card}>
                    <div className={styles.imageWrapper}>
                      <img src={game.image} alt={game.title} className={styles.cardImage} />
                      {game.savings > 0 && (
                        <span className={styles.genreBadge}>-{game.savings}%</span>
                      )}
                    </div>

                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle}>{game.title}</h3>

                      <div className={styles.cardMeta}>
                        <span className={styles.rating}>⭐ {game.rating}</span>
                        {game.normalPrice > game.price && (
                          <span style={{ textDecoration: 'line-through', color: '#71717a' }}>
                            ${game.normalPrice}
                          </span>
                        )}
                      </div>

                      <div className={styles.cardFooter}>
                        <span className={styles.price}>${game.price}</span>
                        <button
                          className={styles.actionBtn}
                          onClick={() => alert(`View deal for "${game.title}"`)}
                        >
                          View Game
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </main>
      </div>

      <div className={styles.backWrapper}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← Back to Store
        </button>
      </div>
    </div>
  );
};

export default Catalog;