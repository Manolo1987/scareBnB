import React, { useEffect, useState } from 'react';
import '../../../App.css';
import styles from './Listings.module.css';
import ListingsCard from '../ListingsCard/ListingsCard.jsx';
import ListingsNav from '../ListingsNav/ListingsNav.jsx';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../Shared/LoadingSpinner/LoadingSpinner.jsx';

export default function Listings() {
  const { myListings, getMyListings } = useAcco();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getMyListings();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      <ListingsNav />
      <div className='accountWrapper'>
        <div className='headingEffectContainer'>
          <h2 className='headingEffect'>My Listings</h2>
        </div>
        {isLoading && <LoadingSpinner />}
        {!isLoading && myListings?.length < 1 && (
          <div className='messageContainer'>
            <p className='message'>You don't have any listings yet.</p>
            <Link to='/account/add-new-listing' className='messageLink'>
              Create your first Listing here.
            </Link>
          </div>
        )}
        {!isLoading && myListings?.length > 0 && (
          <ul className='cardList'>
            {myListings?.map((listing, index) => {
              return (
                <li key={index}>
                  <ListingsCard listing={listing} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
