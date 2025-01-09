import React from 'react';
import styles from './BookedListingsCard.module.css';

export default function BookedListingsCard({ listing }) {
  return (
    <div className={styles.bookedListingCard}>
      {/* add booked listing infos and styling here */}
      {listing.title}
      {listing.city}
      {listing.rating.toFixed(1)}
      {listing.bedroms}
      {listing.pricePerNight}
      {listing.numberOfGuests}
      {listing.checkIn}
      {listing.checkOut}
      {listing.paymentMethod}
    </div>
  );
}
