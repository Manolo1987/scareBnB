import React, { useEffect } from 'react';
import styles from './Listings.module.css';
import ListingsCard from '../ListingsCard/ListingsCard.jsx';
import ListingsNav from '../ListingsNav/ListingsNav.jsx';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import { Link } from 'react-router-dom';

export default function Listings() {
  const { myListings, getMyListings } = useAcco();
  useEffect(() => {
    getMyListings();
  }, []);

  return (
    <div>
      <ListingsNav />
      {myListings?.length < 1 && (
        <p>
          You don't have any listings yet.{' '}
          <Link to='/account/handleListings'>
            Create your first Listing here.
          </Link>
        </p>
      )}
      {myListings?.length > 0 && (
        <div className={styles.mylistings_list}>
          <h1>My Listings</h1>
          <ul>
            {myListings?.map((listing, index) => {
              return (
                <li key={index}>
                  <ListingsCard listing={listing} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
