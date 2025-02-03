import React, { useEffect, useState } from 'react';
import '../../../App.css';
import styles from './BookedListings.module.css';
import ListingsNav from '../ListingsNav/ListingsNav.jsx';
import BookedListingsCard from '../BookedListingsCard/BookedListingsCard.jsx';
import { useBooking } from '../../../context/bookingContext.jsx';
import LoadingSpinner from '../../Shared/LoadingSpinner/LoadingSpinner.jsx';

export default function BookedListings() {
  const { myBookedListings, getMyBookedListings } = useBooking();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getMyBookedListings();
      setIsLoading(false);
    };

    fetchData();
  }, []);
  return (
    <>
      <ListingsNav />
      <div className='accountWrapper'>
        <div className='headingEffectContainer'>
          <h2 className='headingEffect'>My Booked Listings</h2>
        </div>
        {isLoading && <LoadingSpinner />}
        {!isLoading && myBookedListings?.length < 1 && (
          <div className='messageContainer'>
            <p className='message'>
              You don't have any booked listings at the moment.
            </p>
          </div>
        )}
        {!isLoading && myBookedListings?.length > 0 && (
          <ul className='cardList'>
            {myBookedListings?.map((listing, index) => {
              return (
                <li key={index}>
                  <BookedListingsCard listing={listing} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
