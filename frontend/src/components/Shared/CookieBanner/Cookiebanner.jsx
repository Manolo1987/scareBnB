import React, { useState, useEffect } from 'react';
import styles from './Cookiebanner.module.css';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Überprüfen, ob der Cookie "cookiesAccepted" existiert
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      acc[name] = value;
      return acc;
    }, {});

    if (!cookies.cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    // Cookie setzen, der die Zustimmung speichert
    const expirationDays = 14; // Cookie läuft nach 14 Tagen ab
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    document.cookie = `cookiesAccepted=true; path=/; expires=${expirationDate.toUTCString()}; Secure; SameSite=None`;

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
