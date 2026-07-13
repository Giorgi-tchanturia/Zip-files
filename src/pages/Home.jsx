import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GameCard } from '../components/GameCard/GameCard';
import { useLibrary } from '../context/LibraryContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import styles from './Home.module.css';

// ფასების გენერირების ფუქნცია(API-ში არ იყო)
const getMockPrice = (game, isDiscount = false) => {
  if (game.tags?.some(tag => tag.slug === 'free-to-play')) return 'Free';
  
  if (isDiscount) return '₾ 29.99';
  
  if (game.rating >= 4.5) return '₾ 119.99';
  if (game.rating >= 4.0) return '₾ 89.99';
  return '₾ 59.99';
};

export const Home = () => {
  const [sectionsData, setSectionsData] = useState({
    popular: [],
    newGames: [],
    discounts: [],
    random: [],
    searchResults: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);

  const { addToLibrary, isInLibrary } = useLibrary();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  //RAWG API გასაღები
  const API_KEY = 'e3018dadd02b45c48c1255e18cb65601';

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpoint = searchQuery 
          ? `https://api.rawg.io/api/games?key=${API_KEY}&search=${searchQuery}&page_size=20`
          : `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-added&page_size=20`;

        const response = await axios.get(endpoint);

        const data = response.data.results; 

        if (searchQuery) {
          setSectionsData({
            popular: [], newGames: [], discounts: [], random: [],
            searchResults: data
          });
        } else {
          const popular = data.slice(0, 5);

          const newGames = [...data]
            .sort((a, b) => new Date(b.released) - new Date(a.released))
            .slice(0, 5);

          const discounts = data.slice(5, 10);

          const random = [...data.slice(10, 20)]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

          setSectionsData({ popular, newGames, discounts, random, searchResults: [] });
          setActiveFeature(0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [searchQuery]);


  const handleAddToLibrary = (game, priceStr) => {
    addToLibrary({
      dealID: game.id.toString(), 
      title: game.name,            
      thumb: game.background_image, 
      salePrice: priceStr === 'Free' ? '0.00' : priceStr.replace('₾ ', '')
    });
  };

  const handleFeatureWishlist = (game) => {
    if (!isAuthenticated) return navigate('/login');
    const saved = wishlistItems.some((item) => item.id === game.id);
    if (saved) removeFromWishlist(game.id);
    else addToWishlist({ id: game.id, title: game.name, image: game.background_image, price: getMockPrice(game) });
  };

  if (loading) return <h2 style={{ color: 'white', padding: '24px' }}>იტვირთება...</h2>;
  if (error) return <h2 style={{ color: 'red', padding: '24px' }}>შეცდომა: {error}</h2>;

  if (searchQuery) {
    return (
      <div className={styles.container}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>ძებნის შედეგები: "{searchQuery}"</h2>
          </div>
          
          {sectionsData.searchResults.length === 0 ? (
            <p style={{ color: '#aaaaae', padding: '12px 0' }}>თამაშები ვერ მოიძებნა.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
              {sectionsData.searchResults.map((game) => {
                const price = getMockPrice(game);
                return (
                  <GameCard 
                    key={game.id} 
                    id={game.id} 
                    title={game.name} 
                    image={game.background_image} 
                    price={price}
                    isAdded={isInLibrary(game.id.toString())} 
                    onAddToLibrary={() => handleAddToLibrary(game, price)} 
                  />
                )
              })}
            </div>
          )}
        </section>
      </div>
    );
  }


  const homeSections = [
    { id: 'popular', title: 'პოპულარული თამაშები', games: sectionsData.popular, isDiscount: false },
    { id: 'new', title: 'ახალი თამაშები', games: sectionsData.newGames, isDiscount: false },
    { id: 'discounts', title: 'ფასდაკლებები', games: sectionsData.discounts, isDiscount: true },
    { id: 'random', title: 'რანდომ თამაშები', games: sectionsData.random, isDiscount: false },
  ];
  const featuredGames = sectionsData.popular;
  const featuredGame = featuredGames[activeFeature] || featuredGames[0];

  return (
    <div className={styles.container}>
      {featuredGame && (
        <section className={styles.featured} aria-label="Featured games">
          <button className={styles.featureMain} onClick={() => navigate(`/game/${featuredGame.id}`)} style={{ backgroundImage: `linear-gradient(90deg, rgba(10, 10, 12, .88) 0%, rgba(10, 10, 12, .36) 56%, rgba(10, 10, 12, .08) 100%), url(${featuredGame.background_image})` }}>
            <span className={styles.featureContent}>
              <span className={styles.featureEyebrow}>FEATURED NOW</span>
              <strong>{featuredGame.name}</strong>
              <span>{featuredGame.genres?.slice(0, 2).map((genre) => genre.name).join(' · ') || 'Discover a new world'}</span>
              <span className={styles.featureCta}>View game →</span>
            </span>
          </button>
          <div className={styles.featureRail}>
            {featuredGames.map((game, index) => {
              const saved = wishlistItems.some((item) => item.id === game.id);
              return <button key={game.id} className={`${styles.featureThumb} ${index === activeFeature ? styles.featureThumbActive : ''}`} onClick={() => setActiveFeature(index)}>
                <img src={game.background_image} alt="" />
                <span>{game.name}</span>
                <span className={styles.featureHeart} onClick={(event) => { event.stopPropagation(); handleFeatureWishlist(game); }} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>{saved ? '❤️' : '🤍'}</span>
              </button>;
            })}
          </div>
        </section>
      )}
      {homeSections.map((section) => (
        <section key={section.id} className={styles.section}>
          
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {section.title}
              <span className={styles.arrow}>&gt;</span>
            </h2>
          </div>

          <div className={styles.cardsGrid}>
            {section.games.map((game) => {
              const price = getMockPrice(game, section.isDiscount);
              return (
                <div key={game.id} className={styles.cardWrapper}>
                  <GameCard 
                    id={game.id}
                    title={game.name} 
                    image={game.background_image} 
                    price={price}
                    isAdded={isInLibrary(game.id.toString())} 
                    onAddToLibrary={() => handleAddToLibrary(game, price)} 
                  />
                </div>
              )
            })}
          </div>

        </section>
      ))}
    </div>
  );
};
