import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSmoothScroll = (e, sectionId) => {
    // If we're already on the Information page
    if (location.pathname === '/information') {
      e.preventDefault();
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're navigating to the Information page
      navigate(`/information#${sectionId}`);
    }
  };

  return (
    <footer className={styles.footer}>
      <nav>
        <ul className={styles.footerNav}>
          <li>
            <Link
              to='/information#privacy'
              onClick={(e) => handleSmoothScroll(e, 'privacy')}
            >
              Privacy
            </Link>
          </li>
          <li>
            <Link
              to='/information#imprint'
              onClick={(e) => handleSmoothScroll(e, 'imprint')}
            >
              Imprint
            </Link>
          </li>
          <li>
            <Link
              to='/information#contact'
              onClick={(e) => handleSmoothScroll(e, 'contact')}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
