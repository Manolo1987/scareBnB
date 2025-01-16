import React from 'react';
import '../../../App.css';
import styles from './BookedListingsCard.module.css';
import { Envelope } from '@phosphor-icons/react';

export default function BookedListingsCard({ listing }) {
  //console.log(listing);
  return (
    <div className={`cardContainer ${styles.cardContainer_special}`}>
      {/* hier eventuell globale styles anwenden */}

      <div className='imgContainer'>
        <img
          src={listing.accommodation.titleImage.secure_url}
          alt={listing.accommodation.title}
          className='cardImage'
        />
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
      </div>
      <div className={styles.contactLinkContainer}>
        <a
          href={`mailto:${listing.guest.email}`}
          className={styles.contactLink}
          title='Contact Host'
        >
          <Envelope size={32} className={styles.icon} />
        </a>
      </div>
      {listing.isCancelled && (
        <div className={styles.cancelledContainer}>
          <span
            className={styles.cancelledSpan}
            title='Your booking has been cancelled'
          >
            Cancelled
          </span>
        </div>
      )}
    </div>
  );
}
