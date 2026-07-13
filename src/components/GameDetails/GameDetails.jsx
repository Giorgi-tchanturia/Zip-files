import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 
import { useLibrary } from '../../context/LibraryContext';
import styles from './GameDetails.module.css';

const GameDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); 
  const { addToLibrary, isInLibrary } = useLibrary();
  
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const [commentText, setCommentText] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = 'e3018dadd02b45c48c1255e18cb65601';

  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
        );
        setGame(response.data);
      } catch (err) {
        console.error(err);
        setError('თამაშის ინფორმაცია ვერ მოიძებნა.');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://coregames-project.onrender.com/api/reviews/${id}`);
        setReviews(response.data);
      } catch (err) {
        console.error('ბექენდიდან კომენტარების წამოღება ჩაიშალა:', err);
      }
    };

    fetchReviews();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      const response = await axios.post('https://coregames-project.onrender.com/api/reviews', {
        gameId: id,
        username: user?.username || user?.email?.split('@')[0] || 'Anonymous',
        text: commentText
      });

      setReviews((prev) => [...prev, response.data]);
      setCommentText('');
    } catch (err) {
      console.error('კომენტარის გაგზავნა ჩაიშალა:', err);
    }
  };

  const handleAddToLibrary = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToLibrary({
      dealID: game.id.toString(),
      title: game.name,
      thumb: game.background_image || game.background_image_additional,
      salePrice: game.tags?.some((tag) => tag.slug === 'free-to-play') ? '0.00' : '59.99',
    });
  };

  if (loading) {
    return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>იტვირთება...</h2>;
  }

  if (error || !game) {
    return <h2 style={{ color: '#ff4757', textAlign: 'center', marginTop: '50px' }}>{error}</h2>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.heroBanner}>
        <img 
          src={game.background_image || game.background_image_additional} 
          alt={game.name} 
          className={styles.bannerImage} 
        />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.mainInfo}>
          <h1 className={styles.title}>{game.name}</h1>
          
          <div className={styles.metaTags}>
            {game.genres?.map(genre => (
              <span key={genre.id} className={styles.tag}>{genre.name}</span>
            ))}
            <span className={styles.tag}>Release: {game.released || 'N/A'}</span>
            <span className={styles.tag}>⭐ {game.rating}</span>
          </div>

          <div className={styles.description}>
            <h3>About</h3>
            <p>{game.description_raw || 'აღწერა არ არის ხელმისაწვდომი.'}</p>
          </div>

          <hr className={styles.divider} style={{ margin: '40px 0', borderColor: '#333' }} />

          <div className={styles.reviewsSection}>
            <h2 style={{ color: 'white', marginBottom: '20px' }}>User Reviews</h2>

            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your thoughts about this game..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#202020',
                    color: 'white',
                    border: '1px solid #333',
                    resize: 'none',
                    outline: 'none'
                  }}
                  required
                />
                <button 
                  type="submit" 
                  className={styles.primaryBtn}
                  style={{ alignSelf: 'flex-start', padding: '10px 20px', width: 'auto' }}
                >
                  Post Review
                </button>
              </form>
            ) : (
              <p style={{ color: '#aaa', backgroundColor: '#151515', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                ⚠️ კომენტარის დასაწერად გთხოვთ გაიაროთ <span style={{ color: '#0074e4', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/login')}>ავტორიზაცია</span>.
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              {reviews.length === 0 ? (
                <p style={{ color: '#555', fontStyle: 'italic' }}>ამ თამაშზე მიმოხილვები ჯერ არ არის. იყავი პირველი!</p>
              ) : (
                reviews.map((review) => (
                  <div 
                    key={review.id} 
                    style={{
                      backgroundColor: '#1a1a1a',
                      padding: '15px',
                      borderRadius: '8px',
                      border: '1px solid #252525'
                    }}
                  >
                    <h4 style={{ color: '#0074e4', margin: '0 0 5px 0' }}>👤 {review.username}</h4>
                    <p style={{ color: '#eee', margin: 0, lineHeight: '1.5' }}>{review.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.buyCard}>
            <h2 className={styles.price}>
              {game.tags?.some(t => t.slug === 'free-to-play') ? 'Free' : '₾ 59.99'}
            </h2>
            <button
              className={styles.primaryBtn}
              onClick={handleAddToLibrary}
              disabled={isInLibrary(game.id.toString())}
            >
              {isInLibrary(game.id.toString()) ? 'Added to Library ✓' : 'Add to Library'}
            </button>
            <button 
              className={styles.secondaryBtn} 
              onClick={() => navigate('/')}
            >
              Back to Store
            </button>
            
            <div className={styles.platforms}>
              {game.parent_platforms?.map(({ platform }) => platform.name).join(' • ')}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GameDetails;
