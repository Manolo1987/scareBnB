import React, { useEffect, useState } from 'react';
import styles from './Favourites.module.css';
import { useAuth } from '../../../context/UserAuthContext.jsx';
import AccoCard from '../../Shared/AccoCard/AccoCard.jsx';
import LoadingSpinner from '../../Shared/LoadingSpinner/LoadingSpinner.jsx';

export default function Favourites() {
  const { favourites, fetchUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className='headingEffectContainer'>
        <h2 className='headingEffect'>Favourites</h2>
      </div>
      <div className={styles.favouritesContainer}>
        <div className={styles.accoGallery}>
          {isLoading && <LoadingSpinner />}
          {!isLoading && favourites.length > 0 ? (
            <div className={styles.accoList}>
              {favourites.map((fav) => (
                <div className={styles.accoCard} key={fav._id}>
                  <div className={styles.accoCardWidth}>
                    <AccoCard acco={fav} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && <p>No favourites yet!</p>
          )}
        </div>
      </div>
    </>
  );
}
