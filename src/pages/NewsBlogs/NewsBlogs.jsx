import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './NewsBlogs.module.css';

const IGN_RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/ign/news';

const NewsBlog = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLiveNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(IGN_RSS_URL);
        if (response.data.status === 'ok') {
          const formattedNews = response.data.items.map((item, index) => {
            const imgUrl =
              item.thumbnail ||
              item.enclosure?.link ||
              'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';

            const cleanDescription = item.description
              ? item.description.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...'
              : 'Click to read full article on IGN.';

            return {
              id: index + 1,
              title: item.title,
              author: item.author || 'IGN Staff',
              date: new Date(item.pubDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              image: imgUrl,
              snippet: cleanDescription,
              link: item.link,
              category: 'IGN News',
            };
          });

          setNews(formattedNews);
        } else {
          setError('სიახლეების ჩატვირთვა ვერ მოხერხდა.');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('სიახლეების წამოღებისას დაფიქსირდა შეცდომა.');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveNews();
  }, []);

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredItem = news[0];

  return (
    <div className={styles.container}>
      {/* Header & Search */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Gaming News & Blog</h1>
          <p className={styles.pageSubtitle}>
            Real-time live news directly fetched from IGN News feed.
          </p>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search live news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading && (
        <h2 style={{ textAlign: 'center', color: '#0074e4', margin: '60px 0' }}>
          🔄 Loading live gaming news...
        </h2>
      )}

      {error && (
        <h3 style={{ textAlign: 'center', color: '#ff4757', margin: '60px 0' }}>
          {error}
        </h3>
      )}

      {!loading && !error && (
        <>
          {/* Featured Hero Card */}
          {!searchQuery && featuredItem && (
            <div className={styles.featuredCard}>
              <img
                src={featuredItem.image}
                alt={featuredItem.title}
                className={styles.featuredImage}
              />
              <div className={styles.featuredOverlay}>
                <span className={styles.badge}>🔥 Latest Top Story</span>
                <h2 className={styles.featuredTitle}>{featuredItem.title}</h2>
                <p className={styles.featuredSnippet}>{featuredItem.snippet}</p>
                <div className={styles.metaInfo}>
                  <span>👤 {featuredItem.author}</span>
                  <span>📅 {featuredItem.date}</span>
                </div>
              </div>
            </div>
          )}

          {/* News Grid */}
          <div className={styles.newsGrid}>
            {filteredNews.length === 0 ? (
              <div className={styles.noResults}>
                <h3>No news found matching "{searchQuery}"</h3>
              </div>
            ) : (
              filteredNews.map((article) => (
                <article key={article.id} className={styles.newsCard}>
                  <div className={styles.cardImageWrapper}>
                    <img
                      src={article.image}
                      alt={article.title}
                      className={styles.cardImage}
                    />
                    <span className={styles.cardBadge}>{article.category}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.author}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    <p className={styles.cardSnippet}>{article.snippet}</p>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.readMoreBtn}
                    >
                      Read on IGN →
                    </a>
                  </div>
                </article>
              ))
            )}
          </div>
        </>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← Back to Store
        </button>
      </div>
    </div>
  );
};

export default NewsBlog;