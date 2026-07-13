import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Giveaways.module.css';

const PLATFORMS = ['All', 'PC', 'Steam', 'Epic Games Store', 'PlayStation', 'Xbox'];

const Giveaways = () => {
  const navigate = useNavigate();
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchGiveaways = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://www.gamerpower.com/api/giveaways');
        setGiveaways(response.data);
      } catch (err) {
        console.error('Error fetching giveaways:', err);
        setError('Failed to load giveaways. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGiveaways();
  }, []);

  const filteredGiveaways = giveaways.filter((item) => {
    const matchesPlatform =
      selectedPlatform === 'All' ||
      item.platforms.toLowerCase().includes(selectedPlatform.toLowerCase());
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>🎁 Free Games & Giveaways</h1>
          <p className={styles.pageSubtitle}>
            Track active giveaways, free-to-keep games, and loot across all major gaming platforms.
          </p>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search giveaways..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.platforms}>
        {PLATFORMS.map((platform) => (
          <button
            key={platform}
            className={`${styles.platformBtn} ${
              selectedPlatform === platform ? styles.activePlatform : ''
            }`}
            onClick={() => setSelectedPlatform(platform)}
          >
            {platform}
          </button>
        ))}
      </div>

      {loading && (
        <div className={styles.loadingState}>
          <h2>🔄 Loading active giveaways...</h2>
        </div>
      )}

      {error && (
        <div className={styles.errorState}>
          <h3>{error}</h3>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.grid}>
          {filteredGiveaways.length === 0 ? (
            <div className={styles.noResults}>
              <h3>No giveaways found matching your criteria.</h3>
            </div>
          ) : (
            filteredGiveaways.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={item.image} alt={item.title} className={styles.cardImage} />
                  <span className={styles.worthBadge}>
                    {item.worth === 'N/A' ? 'FREE' : item.worth}
                  </span>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.metaRow}>
                    <span className={styles.platformBadge}>{item.platforms}</span>
                    <span className={styles.typeBadge}>{item.type}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.description}</p>

                  <div className={styles.cardFooter}>
                    <span className={styles.usersCount}>👥 {item.users}+ claimed</span>
                    <a
                      href={item.open_giveaway_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.claimBtn}
                    >
                      Get Game →
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className={styles.backWrapper}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← Back to Store
        </button>
      </div>
    </div>
  );
};

export default Giveaways;