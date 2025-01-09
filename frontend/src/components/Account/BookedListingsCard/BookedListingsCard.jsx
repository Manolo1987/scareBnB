import React from 'react';
import styles from './BookedListingsCard.module.css';

export default function BookedListingsCard({ listing }) {
  //console.log(listing);
  return (
    <div className={styles.bookedListingCard}>
      <div className={styles.imgContainer}>
        <img
          src={listing.accommodation.titleImage.secure_url}
          alt={listing.accommodation.title}
          className={styles.cardImage}
        />
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.cardTitle}>{listing.accommodation.title}</span>
        <span className={styles.cardCity}>{listing.accommodation.city}</span>
        <span className={styles.cardRating}>
          {listing.accommodation.rating.toFixed(1)}
        </span>
        <span className={styles.cardBedrooms}>
          Bedrooms: {listing.accommodation.bedrooms}
        </span>
        <span className={styles.cardPricePerNight}>
          Price per Night: {listing.accommodation.pricePerNight}
        </span>
      </div>
      <div className={styles.cardBookingInfoContainer}>
        <span className={styles.cardNumberOfGuests}>
          Number of Guests: {listing.numberOfGuests}
        </span>
        <span className={styles.cardCheckIn}>Check In: {listing.checkIn}</span>
        <span className={styles.cardCheckOut}>
          Check Out: {listing.checkOut}
        </span>
        <span className={styles.cardPaymentMethod}>
          Payment Method: {listing.paymentMethod}
        </span>
      </div>
    </div>
  );
}
