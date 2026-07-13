import { useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import styles from './Library.module.css';

export const Library = () => {
  const { library, cartItems, ownedItems, cartTotal, removeFromLibrary } = useLibrary();
  const navigate = useNavigate();

  if (library.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2>შენი ბიბლიოთეკა ცარიელია 🎮</h2>
        <p>გადადი მთავარ გვერდზე და დაამატე სასურველი თამაშები!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {cartItems.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.heading}>კალათა ({cartItems.length})</h2>
            <span className={styles.total}>ჯამი: ${cartTotal.toFixed(2)}</span>
          </div>

          <div className={styles.grid}>
            {cartItems.map((game) => (
              <div key={game.dealID} className={styles.card}>
                <img src={game.thumb} alt={game.title} className={styles.image} />
                <div className={styles.info}>
                  <h3>{game.title}</h3>
                  <p className={styles.price}>${game.salePrice}</p>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromLibrary(game.dealID)}
                >
                  წაშლა 🗑️
                </button>
              </div>
            ))}
          </div>

          <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
            გადახდაზე გადასვლა · ${cartTotal.toFixed(2)}
          </button>
        </section>
      )}

      {ownedItems.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.heading}>ჩემი თამაშები ({ownedItems.length})</h2>

          <div className={styles.grid}>
            {ownedItems.map((game) => (
              <div key={game.dealID} className={styles.card}>
                <img src={game.thumb} alt={game.title} className={styles.image} />
                <div className={styles.info}>
                  <h3>{game.title}</h3>
                  <p className={styles.owned}>✓ შეძენილია</p>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromLibrary(game.dealID)}
                >
                  წაშლა 🗑️
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

