import React from 'react';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import styles from './FilterAndSort.module.css';

export default function PriceFilter() {
  const { minPrice, setMinPrice, maxPrice, setMaxPrice } = useAcco();

  const handlePriceChange = (e) => {
    if (e.target.value === 'all') {
      setMinPrice('');
      setMaxPrice('');
    } else {
      setMinPrice(e.target.value.split('-')[0]);
      setMaxPrice(e.target.value.split('-')[1]);
    }
  };
  return (
    <>
      <label htmlFor='price'>Price:</label>
      <select
        name='price'
        id='price'
        value={
          minPrice !== '' && maxPrice !== '' ? `${minPrice}-${maxPrice}` : 'all'
        }
        onChange={handlePriceChange}
        className={`${styles.controlsSelect} ${styles.filterSelect}`}
      >
        <option value='all'>all</option>
        <option value='0-80'>0 - 80</option>
        <option value='81-100'>81 - 100</option>
        <option value='101-120'>101 - 120</option>
      </select>
    </>
  );
}
