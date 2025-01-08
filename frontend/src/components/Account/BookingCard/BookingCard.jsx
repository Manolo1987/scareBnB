import React from 'react';
import styles from './BookingCard.module.css';
import { useBooking } from '../../../context/bookingContext';

export default function BookingCard({
  booking,
  checkInDate,
  checkOutDate,
  cancelBooking,
}) {
  return (
    <div className={styles.accoCardContainer}>
      <div className={styles.info_container}>
        <p>
          Accommodation:{' '}
          {booking && booking.accommodation && booking.accommodation.title}
        </p>
        <div className={styles.img_container}>
          {booking &&
            booking.accommodation &&
            booking.accommodation.titleImage && (
              <img
                src={booking.accommodation.titleImage.secure_url}
                alt='location-preview'
              />
            )}
        </div>
      </div>

      <div className={styles.info_container}>
        <p>
          Guest: {booking.guest.firstName} {booking.guest.lastName}
        </p>
        <p>Check In: {checkInDate.toLocaleDateString()}</p>
        <p>Check Out: {checkOutDate.toLocaleDateString()}</p>
        <p>Number of Guests: {booking.numberOfGuests}</p>
        <p>Payment Method: {booking.paymentMethod}</p>
        {booking.isCancelled && <p>Booking Cancelled</p>}
        {!booking.isCancelled && (
          <button onClick={() => cancelBooking(booking._id)}>
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
}
