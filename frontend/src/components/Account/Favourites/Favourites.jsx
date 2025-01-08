import React, { useContext } from 'react';
import styles from './Favourites.module.css';
import FavouriteIcon from '../../Shared/FavouriteIcon/FavouriteIcon.jsx';
import FavouriteCard from '../FavouriteCard/FavouriteCard.jsx';
import { useAuth } from '../../../context/UserAuthContext.jsx';

export default function Favourites() {
  const { favourites } = useAuth();
  console.log('favourites', favourites);

  return (
    <div>
      <h1 className={styles.title}>Favourites</h1>
      {/* <FavouriteIcon /> */}
      {favourites.length > 0 ? (
        <div className={styles.favouritesList}>
          {favourites.map((fav) => (
            <FavouriteCard key={fav._id} favourite={fav} />
          ))}
        </div>
      ) : (
        <p>No favourites yet!</p>
      )}
    </div>
  );
}
