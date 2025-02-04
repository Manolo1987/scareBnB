import React from 'react';
import '../../../App.css';
import styles from './BookedListingsCard.module.css';
import { Envelope } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export default function BookedListingsCard({ listing }) {
  return (
    <div className='cardContainer'>
      <div className='imgContainer'>
        <Link
          to={`/accommodationList/${listing.accommodation.title
            .toLowerCase()
            .replace(/\s+/g, '-')}?id=${listing.accommodation._id}`}
          state={{ id: listing.accommodation._id }}
          className='cardLink'
        >
          <img
            src={listing.accommodation.titleImage.secure_url}
            alt={listing.accommodation.title}
            className='cardImage'
          />
          {listing.isCancelled && (
            <div className='cancelledContainer'>
              <span
                className='cancelledSpan'
                title='Your booking has been cancelled'
              >
                Cancelled
              </span>
            </div>
          )}
        </Link>
      </div>
      <div className='infoContainer'>
        <div className='infoHeader'>
          <span className='cardTitle'>{listing.accommodation.title}</span>
          <span className='cardCity'>{listing.accommodation.city}</span>
        </div>
        <div className='infoBody'>
          <p>
            Guest: {listing.guest.firstName} {listing.guest.lastName}
          </p>
          <p className={styles.cardNumberOfGuests}>
            Number of Guests: {listing.numberOfGuests}
          </p>
          <p className={styles.cardCheckIn}>
            Check In: {new Date(listing.checkIn).toLocaleDateString()}
          </p>
          <p className={styles.cardCheckOut}>
            Check Out: {new Date(listing.checkOut).toLocaleDateString()}
          </p>
          <p className={styles.cardPaymentMethod}>
            Payment Method: {listing.paymentMethod}
          </p>
          <p className={styles.cardTotalPrice}>
            Total Price: {listing.totalPrice}€
          </p>
        </div>
        <div className='cardButtonContainer'>
          <a
            href={`mailto:${listing.guest.email}`}
            className='cardButton'
            title={`Send email to ${listing.guest.email}`}
            aria-label='Send an email'
          >
            <Envelope size={32} className='buttonIcon' />
          </a>
        </div>
      </div>
    </div>
  );
}
