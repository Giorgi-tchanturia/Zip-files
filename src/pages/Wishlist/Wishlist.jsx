// import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext'; 
import { GameCard } from '../../components/GameCard/GameCard'; 
import styles from './Wishlist.module.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>სურვილების სია</h1>
          <span className={styles.badge}>{wishlistItems.length}</span>
        </div>
        
        {wishlistItems.length > 0 ? (
          <div className={styles.cardsGrid}>
            {wishlistItems.map((game) => (
              <div key={game.id} className={styles.cardWrapper}>
                <GameCard 
                  id={game.id}       
                  title={game.title} 
                  price={game.price} 
                  image={game.image}
                  isWishlistCard={true} 
                  onRemove={() => removeFromWishlist(game.id)} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎮</div>
            <h2 className={styles.emptyTitle}>შენი სია ცარიელია</h2>
            <p className={styles.emptyText}>
              ჯერ არცერთი თამაში არ დაგიმატებია. აღმოაჩინე ახალი თავგადასავლები ჩვენს კატალოგში და შეინახე ისინი აქ.
            </p>
            <Link to="/catalog" className={styles.exploreBtn}>
              თამაშების ძიება
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;