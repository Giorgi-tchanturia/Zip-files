import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext'; 
import styles from './GameCard.module.css';

export const GameCard = ({ 
  id, 
  title, 
  image, 
  price, 
  isAdded, 
  onAddToLibrary,
  isWishlistCard, 
  onRemove        
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); 

  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();

  const isInWishlist = wishlistItems.some(item => item.id === id);

  const handleMainActionClick = (e) => {
    e.preventDefault(); 
    
    if (isWishlistCard && onRemove) {
      onRemove(id);
      return;
    }

    if (!isAuthenticated) {
      alert('თამაშის ბიბლიოთეკაში დასამატებლად გთხოვთ გაიაროთ ავტორიზაცია!');
      navigate('/login');
      return;
    }

    if (onAddToLibrary) {
      onAddToLibrary();
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('სურვილების სიაში დასამატებლად გთხოვთ გაიაროთ ავტორიზაცია!');
      navigate('/login');
      return;
    }

    if (isInWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, title, image, price });
    }
  };

  return (
    <Link 
      to={`/game/${id}`} 
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
    >
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
          
          {!isWishlistCard && (
            <button 
              className={styles.wishlistIconBtn} 
              onClick={handleWishlistToggle}
              title={isInWishlist ? "სურვილების სიიდან ამოშლა" : "სურვილების სიაში დამატება"}
            >
              {isInWishlist ? '❤️' : '🤍'}
            </button>
          )}
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title} title={title}>{title}</h3>
          <div className={styles.footer}>
            <span className={styles.price}>{price}</span>
            <button 
              className={isWishlistCard ? styles.removeButton : styles.addButton} 
              onClick={handleMainActionClick} 
              disabled={!isWishlistCard && isAdded}
              style={{ backgroundColor: (!isWishlistCard && isAdded) ? '#2ed573' : undefined }}
            >
              {isWishlistCard 
                ? '🗑 ამოშლა' 
                : (isAdded ? 'დამატებულია ✓' : '+ დამატება')
              }
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};