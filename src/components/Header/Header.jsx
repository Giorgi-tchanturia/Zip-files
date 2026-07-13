import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice'; 
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';
import styles from './Header.module.css';
import { useWishlist } from '../../context/WishlistContext';

export const Header = () => {
  const { library, clearLibrary } = useLibrary();
  const { user, isAuthenticated, logout } = useAuth();
  const avatarInitial = (user?.username || user?.email || '?').charAt(0).toUpperCase();
  
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm.trim()}`);
    } else {
      navigate('/');
    }
    setIsMenuOpen(false);
  };

  const { wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;

  const handleSignOut = () => {
    logout();         
    clearLibrary();   
    setIsMenuOpen(false); 
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link to="/" className={styles.logoLink} onClick={() => setIsMenuOpen(false)}>
          <img src={logoImg} alt="CoreGames Logo" className={styles.logoImage} />
        </Link>
      </div>

      <button 
        className={`${styles.burgerBtn} ${isMenuOpen ? styles.burgerActive : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle navigation"
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
      >
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
      </button>

      {isMenuOpen && <button className={styles.backdrop} onClick={() => setIsMenuOpen(false)} aria-label="Close navigation" />}

      <div id="primary-navigation" className={`${styles.centerSection} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search store"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <nav className={styles.nav}>
          <Link to="/" className={`${styles.link} ${location.pathname === '/' ? styles.active : ''}`} onClick={() => setIsMenuOpen(false)}>
            Discover
          </Link>
          <Link to="/catalog" className={`${styles.link} ${location.pathname === '/catalog' ? styles.active : ''}`} onClick={() => setIsMenuOpen(false)}>
            Catalog
          </Link>
          <Link to="/news" className={`${styles.link} ${location.pathname === '/news' ? styles.active : ''}`} onClick={() => setIsMenuOpen(false)}>
            News
          </Link>
          <Link to="/giveaways" className={`${styles.link} ${location.pathname === '/giveaways' ? styles.active : ''}`} onClick={() => setIsMenuOpen(false)}>
            Giveaways
          </Link>
      
          <Link to="/library" className={`${styles.link} ${location.pathname === '/library' ? styles.active : ''}`} onClick={() => setIsMenuOpen(false)}>
            Library
            {library.length > 0 && <span className={styles.badge}>{library.length}</span>}
          </Link>
          <Link 
            to="/wishlist" 
            className={`${styles.link} ${location.pathname === '/wishlist' ? styles.active : ''}`} 
            onClick={() => setIsMenuOpen(false)}
          >
            Wishlist
          {wishlistCount > 0 && (
            <span className={styles.badge}>{wishlistCount}</span>
          )}
            </Link>
        </nav>

        <div className={styles.mobileAuth}>
          <button 
            type="button"
            className={styles.themeToggleBtn}
            onClick={() => dispatch(toggleTheme())}
          >
            {themeMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          {isAuthenticated ? (
            <div className={styles.profileContainer}>
               <Link to="/profile" className={styles.avatar} onClick={() => setIsMenuOpen(false)}>
                 {user?.avatar ? (
                   <img src={user.avatar} alt="Profile" className={styles.avatarImg} />
                 ) : (
                   avatarInitial
                 )}
                 <span className={styles.onlineDot}></span>
               </Link>
               <button className={styles.authBtn} onClick={handleSignOut}>Sign Out</button>
            </div>
          ) : (
            <Link to="/login" className={styles.authBtn} onClick={() => setIsMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      </div>

      <div className={styles.desktopAuth}>
        <button 
          type="button"
          className={styles.themeToggleBtn}
          onClick={() => dispatch(toggleTheme())}
        >
          {themeMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        {isAuthenticated ? (
          <div className={styles.profileContainer}>
             <Link to="/profile" className={styles.avatar}>
               {user?.avatar ? (
                 <img src={user.avatar} alt="Profile" className={styles.avatarImg} />
               ) : (
                 avatarInitial
               )}
               <span className={styles.onlineDot}></span>
             </Link>
             <button className={styles.authBtn} onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <Link to="/login" className={styles.authBtn}>Sign In</Link>
        )}
      </div>
    </header>
  );
};
