import React, { useState, useEffect, useRef } from 'react';
import styles from './FilterAndSort.module.css';
import { Sliders } from '@phosphor-icons/react';
import PriceFilter from './PriceFilter.jsx';
import BedroomsFilter from './BedroomsFilter.jsx';
import RatingFilter from './RatingFilter.jsx';
import Sort from './Sort.jsx';
import { useAcco } from '../../../context/AccommodationContext.jsx';

export default function FilterAndSort() {
  const { selectedView } = useAcco();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className={styles.filterDropdown} title='Filter and sort'>
      <div
        ref={buttonRef}
        className={`${styles.dropdownButton} ${
          showDropdown ? styles.selected : ''
        }`}
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <Sliders size={32} role='button' />
      </div>
      {showDropdown && (
        <div className={styles.dropDownListContainer} ref={dropdownRef}>
          <ul className={styles.dropdownList}>
            <li>
              <div className={styles.filter_item} title='Price'>
                <PriceFilter />
              </div>
            </li>
            <li>
              <div className={styles.filter_item} title='Bedrooms'>
                <BedroomsFilter />
              </div>
            </li>
            <li>
              <div className={styles.filter_item} title='Rating'>
                <RatingFilter />
              </div>
            </li>
            {selectedView === 'gallery-view' && (
              <li>
                <div className={styles.filter_item} title='Sort'>
                  <Sort />
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
