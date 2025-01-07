import React from 'react';
import styles from './BookingPreview.module.css';
import { useBooking } from '../../../context/bookingContext';

export default function BookingPreview() {
  const { bookingPreview } = useBooking();

  return (
    <div className={styles.bookingPreviewWrapper}>
      <section className={styles.bookingPreviewContent}>
        <h2>{bookingPreview.accommodation}</h2>
        <p>
          {' '}
          checkIn:
          <span>
            {bookingPreview.checkIn.toLocaleDateString('de-DE', {
              timeZone: 'Europe/Berlin',
            })}
          </span>
        </p>
        <p>
          {' '}
          checkOut:
          <span>
            {bookingPreview.checkOut.toLocaleDateString('de-DE', {
              timeZone: 'Europe/Berlin',
            })}
          </span>
        </p>
        <p>
          Guests:
          <span>{bookingPreview.numberOfGuests}</span>
        </p>
        <p>
          Total Nights: <span>{bookingPreview.nights}</span>
        </p>
        <p>
          Price per Night: <span>{bookingPreview.pricePerNight}€</span>
        </p>
        <p>
          Total Price: <span>{bookingPreview.totalPrice}€</span>
        </p>
        <button>Reservation</button>{' '}
        {/* TODO Add onClick to make a booking and navigate to the booking page */}
      </section>
    </div>
  );
}
