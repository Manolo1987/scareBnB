import React, { useEffect } from 'react';
import styles from './AccoCard.module.css';
import { useAcco } from '../../../context/AccommodationContext';
import { Link } from 'react-router-dom';

export default function AccoCard(acco) {
  return (
    <Link to={`/accommodation`} className={styles.cardLink}> {/* /${acco.id} */}
      <div className={styles.accoCardContainer}>
        <div className={styles.info_container}>
          <h4>{acco.acco.title}</h4>
          <span>{acco.acco.city}</span>
        </div>
        <div className={styles.img_container}>
          <img src={acco?.acco.titleImage.secure_url} alt='location-preview' />
        </div>
        <div className={styles.info_container}>
          <p className={styles.rating}>🕸️ {acco.acco.rating}</p>
          <p>Bedrooms: {acco.acco.bedrooms} </p>
          <p>Price per Night: {acco.acco.pricePerNight}€</p>
          <p>Availability: {acco.acco.isBooked ? 'Close 🔒' : 'Open 🚪'}</p>
        </div>
      </div>
    </Link>
  );
}
