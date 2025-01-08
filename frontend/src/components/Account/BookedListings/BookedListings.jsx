import React, { useEffect } from 'react';
import styles from './BookedListings.module.css';
import ListingsNav from '../ListingsNav/ListingsNav.jsx';
import BookedListingsCard from '../BookedListingsCard/BookedListingsCard.jsx';
import { useBooking } from '../../../context/bookingContext.jsx';

export default function BookedListings() {
  const { myBookedListings, getMyBookedListings } = useBooking();
  useEffect(() => {
    getMyBookedListings();
  }, []);
  return (
    <div>
      <ListingsNav />
      {myBookedListings?.length < 1 && (
        <div className={styles.messageContainer}>
          <p className={styles.message}>
            You don't have any booked listings at the moment.
          </p>
        </div>
      )}
      {myBookedListings?.length > 0 && (
        <div className={styles.myBookedlistings_list}>
          <h1>My Booked Listings</h1>
          <ul>
            {myBookedListings?.map((listing, index) => {
              return (
                <li key={index}>
                  <BookedListingsCard listing={listing} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
