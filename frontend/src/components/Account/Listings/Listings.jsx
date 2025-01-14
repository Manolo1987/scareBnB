import React, { useEffect } from 'react';
import '../../../App.css';
import styles from './Listings.module.css';
import ListingsCard from '../ListingsCard/ListingsCard.jsx';
import ListingsNav from '../ListingsNav/ListingsNav.jsx';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import { Link } from 'react-router-dom';

export default function Listings() {
  const { myListings, getMyListings } = useAcco();
  useEffect(() => {
    getMyListings();
  }, [myListings]);

  return (
    <>
      <ListingsNav />
      <div className='listingsWrapper'>
        <div className='headingEffectContainer'>
          <h1 className='headingEffect'>My Listings</h1>
        </div>
        {myListings?.length < 1 && (
          <div className='messageContainer'>
            <p className='message'>You don't have any listings yet.</p>
            <Link to='/account/add-new-listing' className='messageLink'>
              Create your first Listing here.
            </Link>
          </div>
        )}
        {myListings?.length > 0 && (
          <div className={styles.mylistings_list}>
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
    </>
  );
}
