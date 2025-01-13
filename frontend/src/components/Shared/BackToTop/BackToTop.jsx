import React from 'react';
import styles from './BackToTop.module.css';
import { ArrowCircleUp } from '@phosphor-icons/react';

export default function BackToTop() {
  return (
    <button className={styles.backToTop} onClick={() => window.scrollTo(0, 0)}>
      <ArrowCircleUp size={40} color='#fdfcfc' weight='fill' />
    </button>
  );
}
