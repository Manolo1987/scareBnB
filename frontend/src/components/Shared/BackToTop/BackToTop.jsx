import React, { useState, useEffect } from 'react';
import styles from './BackToTop.module.css';
import { ArrowCircleUp } from '@phosphor-icons/react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      className={`${styles.backToTop} ${
        isVisible ? styles.visible : styles.hidden
      }`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowCircleUp size={40} color='#fdfcfc' weight='fill' />
    </button>
  );
}
