import React from 'react';
import styles from './BookingCard.module.css';
import '../../../App.css';
import { useBooking } from '../../../context/bookingContext';
import Feedback from '../../Shared/Feedback/Feedback';
import { EnvelopeSimple } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export default function BookingCard({
  booking,
  checkInDate,
  checkOutDate,
  cancelBooking,
  currentDate,
}) {
  return (
    <div className={styles.BookingCard}>
      <div className={styles.outer_img_container}>
        <div className={styles.img_container}>
          {booking &&
            booking.accommodation &&
            booking.accommodation.titleImage && (
              <Link
                to={`/accommodationList/${booking.accommodation.title
                  .toLowerCase()
                  .replace(/\s+/g, '-')}?id=${booking.accommodation._id}`}
                state={{ id: booking.accommodation._id }}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.viewButton}
              >
                <img
                  src={booking.accommodation.titleImage.secure_url}
                  alt='location-preview'
                />
              </Link>
            )}
        </div>
      </div>

      <div className={styles.info_container}>
        <h3>
          {booking && booking.accommodation && booking.accommodation.title}
        </h3>
        <p>
          Guest: {booking.guest.firstName} {booking.guest.lastName}
        </p>
        <p>Check In: {checkInDate.toLocaleDateString()}</p>
        <p>Check Out: {checkOutDate.toLocaleDateString()}</p>
        <p>Total: {booking.totalPrice}€</p>
      </div>
      {booking.isCancelled && (
        <div className={styles.info_container}>
          <span
            className={styles.cancelledSpan}
            title='Your booking has been cancelled'
            unselectable="on"
          >
            Cancelled
          </span>
        </div>
      )}
      {booking.giveFeedback && <h3>Feedback given ✅</h3>}
      {!booking.giveFeedback &&
        !booking.isCancelled &&
        checkOutDate < currentDate && <Feedback bookingId={booking._id} />}
      {!booking.isCancelled && checkOutDate > currentDate && (
        <div className={styles.info_container}>
          <button
            onClick={() => cancelBooking(booking._id)}
            className={styles.cancelButton}
          >
            Cancel Booking
          </button>
        </div>
      )}
      <a
        href={`mailto:${booking.host.email}`}
        className={styles.contactLink}
        title='Contact Host'
      >
        <EnvelopeSimple size={32} />
      </a>
    </div>
  );
}
