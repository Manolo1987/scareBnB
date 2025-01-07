import React, { useState } from 'react';
import styles from './Search.module.css';
import { useAcco } from '../../../context/AccommodationContext';
import { useBooking } from '../../../context/bookingContext';
import { useNavigate } from 'react-router-dom';
import { states } from '../../../assets/data/statesList';

export default function Search() {
  const navigate = useNavigate();
  const {
    setStateFilter,
    getAllAccommodations,
    setCurrentPage,
  } = useAcco();

  const { bookingPreview, setCheckIn, setCheckOut, setNumberOfGuests } = useBooking();
  const [selectedRegion, setSelectedRegion] = useState('');

  const handleCheckInChange = (e) => {
    setCheckIn(new Date(e.target.value));
  };

  const handleCheckOutChange = (e) => {
    setCheckOut(new Date(e.target.value));
  };

  const handleGuestsChange = (e) => {
    setNumberOfGuests(Number(e.target.value));
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // pagination Reset bei neuer Suche
    setCurrentPage(1);

    setStateFilter(selectedRegion);

    // Fetch accommodations mit neuem filter
    await getAllAccommodations();

    // Navigate mit search parametern
    const searchParams = new URLSearchParams({
      state: selectedRegion,
      checkIn: bookingPreview.checkIn.toISOString().split('T')[0],
      checkOut: bookingPreview.checkOut.toISOString().split('T')[0],
      guests: bookingPreview.numberOfGuests
    });

    navigate(`/accommodationlist?${searchParams.toString()}`);
  };

  return (
    <div className={styles.searchbar}>
      <form onSubmit={handleSubmit}>
        <select
          id="selection"
          value={selectedRegion}
          onChange={handleRegionChange}
        >
          <option value="">Choose your final destination</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <label>
          CheckIn:
          <input
            type="date"
            value={bookingPreview.checkIn.toISOString().split('T')[0]}
            onChange={handleCheckInChange}
          />
        </label>
        <label>
          CheckOut:
          <input
            type="date"
            value={bookingPreview.checkOut.toISOString().split('T')[0]}
            onChange={handleCheckOutChange}
          />
        </label>
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
        <button type="submit">Search</button>
      </form>
    </div>
  );
}