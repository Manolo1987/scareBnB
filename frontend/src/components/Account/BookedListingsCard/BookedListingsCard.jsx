import React from 'react';
import '../../../App.css';
import styles from './BookedListingsCard.module.css';

export default function BookedListingsCard({ listing }) {
  //console.log(listing);
  return (
    <div className='cardContainer'>
      {/* hier eventuell globale styles anwenden */}
      <div className={styles.info_container}>
        <div className={styles.img_container}>
          <h3 className={styles.cardTitle}>
            {listing.accommodation.title} ({listing.accommodation.city})
          </h3>
          <img
            src={listing.accommodation.titleImage.secure_url}
            alt={listing.accommodation.title}
            className={styles.cardImage}
          />
        </div>
      </div>
      <div className={styles.info_container}>
        <p className={styles.cardRating}>
          Rating: {listing.accommodation.rating.toFixed(1)}
        </p>
        <p className={styles.cardBedrooms}>
          Bedrooms: {listing.accommodation.bedrooms}
        </p>
        <p className={styles.cardPricePerNight}>
          Price per Night: {listing.accommodation.pricePerNight}€
        </p>
      </div>
      <div className={styles.info_container}>
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
        {listing.isCancelled && (
          <div className={styles.info_container}>
            <span
              className={styles.cancelledSpan}
              title='Your booking has been cancelled'
            >
              Booking cancelled by guest
            </span>
          </div>
        )}
        <a
          href={`mailto:${listing.guest.email}`}
          className={styles.contactLink}
          title='Contact Host'
        >
          Contact Guest
        </a>
      </div>
    </div>
  );
}
