import React, { useState } from 'react';
import styles from './FavouriteIcon.module.css';
import { HeartStraight } from '@phosphor-icons/react';
import { useAuth } from '../../../context/UserAuthContext';

export default function FavouriteIcon({ accoId }) {
  const [isFavourite, setIsFavourite] = useState(false);
  const { addFavourite, removeFavourite } = useAuth();

  const handleAddFavourite = (e) => {
    e.stopPropagation();
    setIsFavourite(true);
    addFavourite(accoId);
  };

  const handleRemoveFavourite = (e) => {
    e.stopPropagation();
    setIsFavourite(false);
    removeFavourite(accoId);
  };
  return (
    <>
      {!isFavourite ? (
        <div>
          <HeartStraight
            size={32}
            color='#f70202'
            onClick={handleAddFavourite}
          />
        </div>
      ) : (
        <div>
          <HeartStraight
            size={32}
            color='#f70202'
            weight='fill'
            onClick={handleRemoveFavourite}
          />
        </div>
      )}
    </>
  );
}
