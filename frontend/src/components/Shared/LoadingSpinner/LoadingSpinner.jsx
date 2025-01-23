import React from 'react';
import { Spinner } from '@phosphor-icons/react';
import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({children}) {
  return (
    <div className={styles.loadingContainer}>
      <Spinner size={32} className={styles.spinner} />
      {children}
    </div>
  );
}
