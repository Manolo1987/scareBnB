import React from 'react';
import styles from './BookingPreview.module.css';
import { useBooking } from '../../../context/bookingContext';
import { useAuth } from '../../../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookingPreview() {
  const { bookingPreview, setCheckIn, setCheckOut, setNumberOfGuests } =
    useBooking();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckInChange = (e) => {
    setCheckIn(new Date(e.target.value));
  };

  const handleCheckOutChange = (e) => {
    setCheckOut(new Date(e.target.value));
  };

  const handleGuestsChange = (e) => {
    setNumberOfGuests(Number(e.target.value));
  };

  const handleClick = () => {
    navigate('/booking');
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
