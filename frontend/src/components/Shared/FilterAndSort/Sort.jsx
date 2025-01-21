import React from 'react';
import styles from './FilterAndSort.module.css';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import { SortAscending, SortDescending } from '@phosphor-icons/react';

export default function Sort() {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useAcco();
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  const handleSortOrderChange = (newOrder) => {
    setSortOrder(newOrder);
  };
  return (
    <div className={styles.sort_container}>
      <label htmlFor='sort'>Sort by:</label>
      <select
        name='sort'
        id='sort'
        value={sortBy}
        onChange={handleSortChange}
        className={styles.controlsSelect}
      >
        <option value='pricePerNight'>Price</option>
        <option value='rating'>Rating</option>
        <option value='bedrooms'>Bedrooms</option>
      </select>
      <div className={styles.sortOrder_container}>
        {sortOrder === 'asc' ? (
          <div
            role='button'
            aria-label='Sort Descending'
            onClick={() => handleSortOrderChange('desc')}
            className={styles.icon_button}
            tabIndex='0'
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSortOrderChange('desc');
              }
            }}
          >
            <SortDescending size={32} className={styles.icon} />
          </div>
        ) : (
          <div
            role='button'
            aria-label='Sort Ascending'
            onClick={() => handleSortOrderChange('asc')}
            className={styles.icon_button}
            tabIndex='0'
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSortOrderChange('asc');
              }
            }}
          >
            <SortAscending size={32} className={styles.icon} />
          </div>
        )}
      </div>
    </div>
  );
}
