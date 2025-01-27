import styles from './FavouriteIcon.module.css';
import { HeartStraight } from '@phosphor-icons/react';
import { useAuth } from '../../../context/UserAuthContext';

export default function FavouriteIcon({ accoId }) {
  const { favourites, addFavourite, removeFavourite } = useAuth();

  const isFavourite = (favourites || []).some((fav) => fav._id === accoId);

  const handleAddFavourite = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await addFavourite(accoId);
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };

  const handleRemoveFavourite = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Removing from favourites...');
    try {
      await removeFavourite(accoId);
    } catch (error) {
      console.error('Error removing from favourites:', error);
    }
  };

  return (
    <>
      {!isFavourite ? (
        <div
          onClick={handleAddFavourite}
          className={styles.fav}
          title='Add to favourites'
          aria-label='Add to favourites'
        >
          <HeartStraight size={30} color='crimson' />
        </div>
      ) : (
        <div
          onClick={handleRemoveFavourite}
          className={styles.fav}
          title='Remove from favourites'
          aria-label='Remove from favourites'
        >
          <HeartStraight size={30} color='crimson' weight='fill' />
        </div>
      )}
    </>
  );
}
