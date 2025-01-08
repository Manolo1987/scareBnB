import React from 'react';
import styles from './FavouriteCard.module.css';
import FavouriteIcon from '../../Shared/FavouriteIcon/FavouriteIcon.jsx';

export default function FavouriteCard({ favourite }) {
  return (
    <div className={styles.favouriteCard}>
      <img
        src={favourite.titleImage.secure_url}
        alt={favourite.title}
        className={styles.image}
      />
      <FavouriteIcon />
      <h3>{favourite.title}</h3>
      <p>
        {favourite.city}, {favourite.state}
      </p>
      <p>{favourite.description}</p>
      <p>{favourite.pricePerNight} €/night</p>
    </div>
  );
}
