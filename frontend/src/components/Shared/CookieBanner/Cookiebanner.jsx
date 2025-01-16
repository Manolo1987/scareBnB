import React, { useState, useEffect } from 'react';
import styles from './Cookiebanner.module.css';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Überprüfen, ob der Benutzer die Cookies bereits akzeptiert hat
    const cookiesAccepted = sessionStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    // Speichern der Zustimmung im sessionStorage
    sessionStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className={styles.cookieBanner}>
      <p className={styles.cookieContent}>
        This website uses cookies to ensure you get the best experience. By
        using this site, you agree to our use of cookies.
      </p>
      <button onClick={handleAcceptCookies} className={styles.cookieButton}>
        OK
      </button>
    </div>
  );
};

export default CookieBanner;
