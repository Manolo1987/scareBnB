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
        <div onClick={handleAddFavourite}>
          <HeartStraight size={32} color='#f70202' />
        </div>
      ) : (
        <div onClick={handleRemoveFavourite}>
          <HeartStraight size={32} color='#f70202' weight='fill' />
        </div>
      )}
    </>
  );
}
