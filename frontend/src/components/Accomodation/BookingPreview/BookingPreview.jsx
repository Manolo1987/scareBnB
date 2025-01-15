import React from 'react';
import { useBooking } from '../../../context/bookingContext';
import { useAuth } from '../../../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

import styles from './BookingPreview.module.css';

export default function BookingPreview() {
  const { bookingPreview, setCheckIn, setCheckOut, setNumberOfGuests } =
    useBooking();
  const { isAuthenticated, showLogin, setShowLogin } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

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

  const handleClick = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
    } else {
      navigate('/booking');
    }
  };

  return (
    <div className={styles.bookingPreviewWrapper}>
      <section className={styles.bookingPreviewContent}>
        <h2>{bookingPreview.pricePerNight}€ per Night</h2>

        {/* Check-in Date */}
        <label>
          CheckIn:
          <input
            type='date'
            required
            value={bookingPreview.checkIn.toISOString().split('T')[0]} // Format YYYY-MM-DD
            onChange={handleCheckInChange}
            min={today}
          />
        </label>

        {/* Check-out Date */}
        <label>
          CheckOut:
          <input
            type='date'
            required
            value={bookingPreview.checkOut.toISOString().split('T')[0]} // Format YYYY-MM-DD
            onChange={handleCheckOutChange}
            min={bookingPreview.checkOut.toISOString().split('T')[0]}
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

        {/* Calculations */}
        <p>
          Total Nights: <span>{bookingPreview.nights}</span>
        </p>

        <p>
          Total Price: <span>{bookingPreview.totalPrice}€</span>
        </p>

        {/* Reservation Button */}
        <button onClick={handleClick}>Reservation</button>
      </section>
    </div>
  );
}
