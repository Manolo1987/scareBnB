import React from 'react';
import styles from './PaginationPage.module.css';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

function PaginationPage({ currentPage, totalPages, onPageChange }) {
  const createPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 2) {
      pages.push(1);
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = createPageNumbers();

  return (
    <div className={styles.pagination}>
      <CaretLeft size={20} color='#fcfcfc' />
      <button
        className={styles.pg_button}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            className={page === currentPage ? styles.active : styles.pg_button}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}
      <button
        className={styles.pg_button}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
      <CaretRight size={20} color='#fcfcfc' />
    </div>
  );
}

export default PaginationPage;
