import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.linksBlock}>
          <a href="#" className={styles.link}>Privacy Policy</a>
          <a href="#" className={styles.link}>Terms of Service</a>
          <a href="#" className={styles.link}>Support</a>
        </div>
        
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} CoreGames, Inc. All rights reserved. 
          Epic Games styling project.
        </p>
      </div>
    </footer>
  );
};