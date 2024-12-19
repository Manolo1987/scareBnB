import React, { useState } from 'react';
import styles from './Filter.module.css';
import { useAcco } from '../../../context/AccommodationContext.jsx';

export default function Filter() {
  const [price, setPrice] = useState();
  const { minPrice, maxPrice, setMinPrice, setMaxPrice } = useAcco();
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
    <div className={styles.filter_container}>
      <div className={styles.filter_item}>
        <label htmlFor='price'>Price:</label>
        <select
          name='price'
          id='price'
          value={price}
          onChange={handlePriceChange}
        >
          <option value={'all'}>all</option>
          <option value='0-80'>0 - 80</option>
          <option value='81-100'>81 - 100</option>
          <option value='101-120'>101 - 120</option>
        </select>
      </div>
    </div>
  );
}
