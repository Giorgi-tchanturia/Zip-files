import { Link } from 'react-router-dom';
import { useLibrary } from '../../context/LibraryContext';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { library } = useLibrary(); 

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.logo}>
          🎮 GameStore
        </Link>
      </div>

      <div className={styles.navLinks}>
        <Link to="/" className={styles.link}>
          CoreGames
        </Link>
        <Link to="/news" className={styles.link}>
          News
        </Link>
        <Link to="/library" className={styles.link}>
          Library
          {library.length > 0 && (
            <span className={styles.badge}>{library.length}</span>
          )}
        </Link>
      </div>
    </nav>
  );
};