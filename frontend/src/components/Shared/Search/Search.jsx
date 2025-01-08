import React, { useEffect } from 'react';
import styles from './Search.module.css';
import { useAcco } from '../../../context/AccommodationContext';
import { useBooking } from '../../../context/bookingContext';

export default function Search() {
  const { setStateFilter } = useAcco();
  const { bookingPreview, setCheckIn, setCheckOut, setNumberOfGuests } =
    useBooking();
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
    newDate.setDate(newDate.getDate() + 1); // Setzt auf morgen
    setCheckOut(newDate);
  };

  const handleGuestsChange = (e) => {
    setNumberOfGuests(Number(e.target.value));
  };

  const handleRegionChange = (event) => {
    const selectedRegion = event.target.value;
    setStateFilter(selectedRegion);
    console.log('Selected Region:', selectedRegion);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className={styles.searchbar}>
      <form onSubmit={handleSubmit}>
        <select id='selection' onChange={handleRegionChange}>
          <option value=''>Choose your final destination</option>
          <option value='Baden-Württemberg'>Baden-Württemberg</option>
          <option value='Bavaria'>Bavaria</option>
          <option value='Berlin'>Berlin</option>
          <option value='Brandenburg'>Brandenburg</option>
          <option value='Bremen'>Bremen</option>
          <option value='Hamburg'>Hamburg</option>
          <option value='Hesse'>Hesse</option>
          <option value='Mecklenburg-Western Pomerania'>
            Mecklenburg-Western Pomerania
          </option>
          <option value='Lower Saxony'>Lower Saxony</option>
          <option value='North Rhine-Westphalia'>North Rhine-Westphalia</option>
          <option value='Rhineland-Palatinate'>Rhineland-Palatinate</option>
          <option value='Saarland'>Saarland</option>
          <option value='Saxony'>Saxony</option>
          <option value='Saxony-Anhalt'>Saxony-Anhalt</option>
          <option value='Schleswig-Holstein'>Schleswig-Holstein</option>
          <option value='Thuringia'>Thuringia</option>
        </select>

        <label>
          CheckIn:
          <input
            type='date'
            value={bookingPreview.checkIn.toISOString().split('T')[0]} // Format YYYY-MM-DD
            onChange={handleCheckInChange}
          />
        </label>

        {/* Check-out Date */}
        <label>
          CheckOut:
          <input
            type='date'
            value={bookingPreview.checkOut.toISOString().split('T')[0]} // Format YYYY-MM-DD
            onChange={handleCheckOutChange}
          />
        </label>

        {/* Guests Dropdown */}
        <label>
          Guests:
          <select
            value={bookingPreview.numberOfGuests}
            onChange={handleGuestsChange}
          >
            {[...Array(5)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </label>

        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}
