import React from 'react';
import styles from './Favourites.module.css';
import { useAuth } from '../../../context/UserAuthContext.jsx';
import AccoCard from '../../Shared/AccoCard/AccoCard.jsx';

export default function Favourites() {
  const { favourites } = useAuth();

  return (
    <>
        <div className='headingEffectContainer'>
          <h1 className='headingEffect'>Favourites</h1>
        </div>
    <div className={styles.favouritesContainer}>
      <div className={styles.accoGallery}>

        {favourites.length > 0 ? (
          <div className={styles.accoList}>
            {favourites.map((fav) => (
              <div className={styles.accoCard} key={fav._id}>
                <AccoCard acco={fav} />
              </div>
            ))}
          </div>
        ) : (
          <p>No favourites yet!</p>
        )}
      </div>
    </div>
        </>
  );
}
