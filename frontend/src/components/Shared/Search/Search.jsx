import React, { useState } from 'react';
import styles from './Search.module.css';
import { useAcco } from '../../../context/AccommodationContext';
import { useBooking } from '../../../context/bookingContext';
import { useNavigate } from 'react-router-dom';
import { states } from '../../../assets/data/statesList';
import { MagnifyingGlass } from '@phosphor-icons/react';

export default function Search() {
  const navigate = useNavigate();
  const { stateFilter, setStateFilter, setCurrentPage } = useAcco();

  const { bookingPreview, setCheckIn, setCheckOut, setNumberOfGuests } =
    useBooking();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const [selectedRegion, setSelectedRegion] = useState(stateFilter);

  const handleCheckInChange = (e) => {
    if (e.target.value === '') {
      setCheckIn(new Date());
    } else {
      setCheckIn(new Date(e.target.value));
    }
  };

  const handleCheckOutChange = (e) => {
    const value = e.target.value;
    const newDate = value ? new Date(value) : new Date();
    if (newDate <= bookingPreview.checkIn) {
      const adjustedDate = new Date(bookingPreview.checkIn);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      setCheckOut(adjustedDate);
    } else {
      setCheckOut(newDate);
    }
  };

  const handleGuestsChange = (e) => {
    setNumberOfGuests(Number(e.target.value));
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setCurrentPage(1);
    setStateFilter(selectedRegion);

    const searchParams = new URLSearchParams({
      state: selectedRegion,
      checkIn: bookingPreview.checkIn.toISOString().split('T')[0],
      checkOut: bookingPreview.checkOut.toISOString().split('T')[0],
      guests: bookingPreview.numberOfGuests,
    });

    navigate(`/accommodationlist?${searchParams.toString()}`);
  };

  return (
    <div className={styles.searchbar}>
      <form onSubmit={handleSubmit} className={styles.searchbarForm}>
        <select
          id='selection'
          value={selectedRegion}
          onChange={handleRegionChange}
          className={styles.searchbarSelect}
        >
          <option value=''>Choose your final destination</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <label className={styles.searchbarLabel}>CheckIn:</label>
        <label>
          <input
            type='date'
            value={bookingPreview.checkIn.toISOString().split('T')[0]}
            onChange={handleCheckInChange}
            className={styles.searchbarInput}
            id='checkIn'
            min={today}
          />
        </label>
        <label className={styles.searchbarLabel}>CheckOut:</label>
        <label>
          <input
            type='date'
            value={bookingPreview.checkOut.toISOString().split('T')[0]}
            onChange={handleCheckOutChange}
            className={styles.searchbarInput}
            min={bookingPreview.checkIn.toISOString().split('T')[0]}
          />
        </label>
        <label className={styles.searchbarLabel}>Guests:</label>
        <select
          value={bookingPreview.numberOfGuests}
          onChange={handleGuestsChange}
          className={styles.searchbarSelect}
        >
          {[...Array(5)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
        <div className={styles.buttonContainer}>
          <button className='buttonEffect' type='submit'>
            <MagnifyingGlass size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
