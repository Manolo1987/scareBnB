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
    <div className={styles.container}>
      <section id="privacy" className={styles.section}>
        <h2>Privacy</h2>
        <div className={styles.content}>
          <h3>Introduction</h3>
          <p>Welcome to Scarebnb, an experimental project focused on providing unique, spooky accommodation experiences.</p>

          <h3>Project Status</h3>
          <p><strong className={styles.red}>Important Notice:</strong> Scarebnb is a developmental project created by enthusiasts exploring the intersection of hospitality and horror-themed experiences.</p>

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
            <li>- Our security infrastructure is in its early stages</li>
            <li>- We may have limited experience in comprehensive data protection</li>
            <li>- There is a higher potential risk of data exposure compared to established platforms</li>
          </ul>

          <h3>Data Protection</h3>
          <p>We are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information.</p>

          <h3>How We Use Your Data</h3>
          <ul>
            <li>Process bookings and reservations.</li>
            <li>Provide customer support.</li>
            <li>Improve our services and user experience.</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h3>Data Sharing and Transfer</h3>
          <p>We do not share your personal data with third parties, except as necessary to fulfill your booking or comply with legal requirements.</p>

          <h3>Data Security</h3>
          <p>We implement reasonable security measures to protect your personal data from unauthorized access, use, or disclosure. However, no system is completely secure.</p>

          <h3>Cookies</h3>
          <p>We use cookies to store user login information.</p>

          <h3>Your Rights</h3>
          <ul>
            <li><strong>Access:</strong> You can request access to your personal data.</li>
            <li><strong>Rectification:</strong> You can request the correction of inaccurate or incomplete personal data.</li>
            <li><strong>Erasure:</strong> You can request the deletion of your personal data.</li>
            <li><strong>Restriction of Processing:</strong> You can request the restriction of processing your personal data.</li>
            <li><strong>Data Portability:</strong> You can request the transfer of your personal data to another controller.</li>
            <li><strong>Objection:</strong> You can object to the processing of your personal data.</li>
          </ul>

          <h3>Contact Us</h3>
          <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at <a href="mailto:scarebnba@gmail.com">scarebnba@gmail.com</a>.</p>
        </div>
      </section>

      <section id="imprint" className={styles.section}>
        <h2>Imprint</h2>
        <div className={styles.content}>
          <p><strong className={styles.red}>Disclaimer:</strong> This is an entirely fictional imprint created for the Scarebnb project for showcasing purposes.</p>

          <h3>Company Details</h3>
          <p>Scarebnb GmbH (Fictional)</p>

          <h3>Postal Address</h3>
          <address>
            Geisterberg Straße 13<br />
            13666 Spukstadt, Niedersachsen<br />
            Germany
          </address>

          <h3>Management</h3>
          <ul>
            <li>Elena Schattenwanderer</li>
            <li>Marcus Geisterjäger</li>
          </ul>
        </div>
      </section>

      <section id="contact" className={styles.section}>
        <h2>Contact</h2>
        <button className={`buttonEffect ${styles.contactButton}`}>
          <a href="mailto:scarebnba@gmail.com">scarebnba@gmail.com</a>
        </button>
      </section>
    </div>
  );
}