import React, { useState } from 'react';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import styles from './FilterAndSort.module.css';

export default function BedroomsFilter() {
  const { bedrooms, setBedrooms } = useAcco();
  const handleBedroomsChange = (e) => {
    if (e.target.value === 'all') {
      setBedrooms('');
    } else {
      setBedrooms(e.target.value);
    }
  };
  return (
    <>
      <label htmlFor='bedrooms'>Bedrooms:</label>
      <select
        name='bedrooms'
        id='bedrooms'
        value={bedrooms}
        onChange={handleBedroomsChange}
        className={`${styles.controlsSelect} ${styles.filterSelect}`}
      >
        <option value={'all'}>all</option>
        <option value='2'>2</option>
        <option value='3'>3</option>
        <option value='4'>4</option>
        <option value='5'>5</option>
      </select>
    </>
  );
}
