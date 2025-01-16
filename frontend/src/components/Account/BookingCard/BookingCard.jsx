import React from 'react';
import styles from './BookingCard.module.css';
import { useBooking } from '../../../context/bookingContext';
import Feedback from '../../Shared/Feedback/Feedback';
import { Link } from 'react-router-dom';
import { Envelope, Check } from '@phosphor-icons/react';

export default function BookingCard({ booking, cancelBooking, currentDate }) {
  console.log(booking);
  return (
    <Link
      to={`/accommodationList/${booking.accommodation.title
        .toLowerCase()
        .replace(/\s+/g, '-')}?id=${booking.accommodation._id}`}
      state={{ id: booking.accommodation._id }}
      className='cardLink'
    >
      <div className='cardContainer'>
        <div className='imgContainer'>
          <img
            src={booking.accommodation.titleImage.secure_url}
            alt={booking.accommodation.title}
            className='cardImage'
          />
          {booking.isCancelled && (
            <div className='cancelledContainer'>
              <span
                className='cancelledSpan'
                title='Your booking has been cancelled'
              >
                Cancelled
              </span>
            </div>
          )}
        </div>

        <div className='infoContainer'>
          <div className='infoHeader'>
            <span className='cardTitle'>{booking.accommodation.title}</span>
            <span className='cardCity'>{booking.accommodation.city}</span>
          </div>
          <div className='infoBody'>
            <p>
              Guest: {booking.guest.firstName} {booking.guest.lastName}
            </p>
            <p className={styles.cardNumberOfGuests}>
              Number of Guests: {booking.numberOfGuests}
            </p>
            <p className={styles.cardCheckIn}>
              Check In: {new Date(booking.checkIn).toLocaleDateString()}
            </p>
            <p className={styles.cardCheckOut}>
              Check Out: {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <p className={styles.cardPaymentMethod}>
              Payment Method: {booking.paymentMethod}
            </p>
            <p className={styles.cardTotalPrice}>
              Total Price: {booking.totalPrice}€
            </p>
          </div>
          <div className='cardButtonContainer'>
            <a
              href={`mailto:${booking.guest.email}`}
              className='cardButton'
              title='Contact Host'
            >
              <Envelope size={32} className='buttonIcon' />
            </a>
          </div>
          <div className='infoFooter'>
            {!booking.isCancelled &&
              // new Date(booking.checkOut) > currentDate && (
              new Date(booking.checkIn) > currentDate && (
                <button
                  onClick={() => cancelBooking(booking._id)}
                  className='bookingCancelButton'
                >
                  Cancel Booking
                </button>
              )}
            {booking.giveFeedback && (
              <p className='givenFeedback'>
                <span>Feedback already given.</span>
                <Check size={32} className='feedbackCheck' />
              </p>
            )}
            {!booking.giveFeedback &&
              !booking.isCancelled &&
              // new Date(booking.checkOut) < currentDate && (
              new Date(booking.checkIn) < currentDate && (
                <Feedback bookingId={booking._id} />
              )}
          </div>
        </div>
      </div>
    </Link>
  );
}
