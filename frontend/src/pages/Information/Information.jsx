import React, { useEffect } from 'react';
import styles from './Information.module.css';

export default function Information() {
  useEffect(() => {
    // Check if there's a hash in the URL and scroll to the corresponding section
    const { hash } = window.location;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const handleContactClick = () => {
    window.location.href = 'mailto:scarebnba@gmail.com';
  };

  return (
    <div className="info-wrapper">

      <div className={styles.info}>
        <section id='privacy' className={styles.box}>
          <h2>Privacy</h2>
          <div className={styles.privacyContent}>
            <h3>Introduction</h3>
            <p>Welcome to Scarebnb, an experimental project focused on providing unique, spooky accommodation experiences.</p>

            <h3>Project Status</h3>
            <p><strong>Important Notice:</strong> Scarebnb is a developmental project created by enthusiasts exploring the intersection of hospitality and horror-themed experiences.</p>

            <h3>Data Collection</h3>
            <ul>
              <li>Name</li>
              <li>Contact information</li>
              <li>Payment details</li>
              <li>Accommodation preferences</li>
              <li>Travel dates</li>
            </ul>

            <h3>Data Protection Transparency</h3>
            <p>We acknowledge that:</p>
            <ul>
              <li>Our security infrastructure is in its early stages</li>
              <li>We may have limited experience in comprehensive data protection</li>
              <li>There is a higher potential risk of data exposure compared to established platforms</li>
            </ul>
          </div>
        </section>

        <section id='imprint' className={styles.box}>
          <h2>Imprint</h2>
          <div className={styles.imprintContent}>
            <p><strong>Disclaimer:</strong> This is an entirely fictional imprint created for the Scarebnb project.</p>

            <h3>Company Details</h3>
            <p>Scarebnb GmbH (Fictional)</p>

            <h3>Postal Address</h3>
            <address>
              Geisterberg Straße 13<br />
              13666 Spukstadt, Niedersachsen<br />
              Germany
            </address>

            <h3>Management</h3>
            <p>Fictional Managing Directors:</p>
            <ul>
              <li>Elena Schattenwanderer</li>
              <li>Marcus Geisterjäger</li>
            </ul>
          </div>
        </section>

        <section id='contact' className={styles.box}>
          <h2>Contact</h2>
          <button
            onClick={handleContactClick}
            className={styles.contactButton}
          >
            Email Us at scarebnba@gmail.com
          </button>
        </section>
      </div>
    </div>
  );
}