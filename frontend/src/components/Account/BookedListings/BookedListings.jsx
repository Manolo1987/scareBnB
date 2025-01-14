import React, { useEffect } from 'react';
import globalStyles from '../../../pages/Account/Account.module.css';
import styles from './BookedListings.module.css';
import ListingsNav from '../ListingsNav/ListingsNav.jsx';
import BookedListingsCard from '../BookedListingsCard/BookedListingsCard.jsx';
import { useBooking } from '../../../context/bookingContext.jsx';

export default function BookedListings() {
  const { myBookedListings, getMyBookedListings } = useBooking();
  useEffect(() => {
    getMyBookedListings();
  }, [myBookedListings]);
  return (
    <>
      <ListingsNav />
      <div className={globalStyles.listingsWrapper}>
        <div className={globalStyles.headingEffectContainer}>
          <h1 className={globalStyles.headingEffect}>My Booked Listings</h1>
        </div>
        {myBookedListings?.length < 1 && (
          <div className={globalStyles.messageContainer}>
            <p className={styles.message}>
              You don't have any booked listings at the moment.
            </p>
          </div>
        )}
        {myBookedListings?.length > 0 && (
          <div className={styles.myBookedlistings_list}>
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
    </>
  );
}
