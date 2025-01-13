import React, { useState } from 'react';
import styles from './Filter.module.css';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import RatingFilter from './RatingFilter';

export default function Filter() {
  //possible price range: 50 - 120 (seeded data)
  // possible bedrooms: 2 - 5 (seeded data)
  // possible ratings: up to 5 (seeded between 3 and 5)
  const [price, setPrice] = useState();
  const {
    setMinPrice,
    setMaxPrice,
    bedrooms,
    setBedrooms,
    minRating,
    setMinRating,
  } = useAcco();

  const handlePriceChange = (e) => {
    if (e.target.value === 'all') {
      setMinPrice('');
      setMaxPrice('');
    } else {
      setMinPrice(e.target.value.split('-')[0]);
      setMaxPrice(e.target.value.split('-')[1]);
    }
  };

  const handleBedroomsChange = (e) => {
    if (e.target.value === 'all') {
      setBedrooms('');
    } else {
      setBedrooms(e.target.value);
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
      <div className={styles.filter_item}>
        <label htmlFor='bedrooms'>Bedrooms:</label>
        <select
          name='bedrooms'
          id='bedrooms'
          value={bedrooms}
          onChange={handleBedroomsChange}
        >
          <option value={'all'}>all</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
        </select>
      </div>
      <RatingFilter minRating={minRating} setMinRating={setMinRating} />
    </div>
  );
}
