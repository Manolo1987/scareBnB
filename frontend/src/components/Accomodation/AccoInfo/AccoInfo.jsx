import React from 'react';
import styles from './AccoInfo.module.css';
import { Desk } from '@phosphor-icons/react';
import AccoMap from '../AccoMap/AccoMap';
import FavouriteIcon from '../../Shared/FavouriteIcon/FavouriteIcon';

export default function AccoInfo({ currentAcco }) {
  return (
    <section className={styles.accoInfo_container}>
      <div className={styles.titleAndFavIcon}>
        <h2 className={styles.title}>Accommodation Details</h2>
        <FavouriteIcon />
      </div>
      <div className={styles.section}>
        <h4>Story</h4>
        <p className={styles.description}>
          {currentAcco?.description || 'There is no Story available right now.'}
        </p>
      </div>

      <div className={styles.info_box}>
        <div>
          <div className={styles.section}>
            <h4>Location</h4>
            <p>
              <strong>State:</strong> {currentAcco?.state || 'N/A'}
            </p>
            <p>
              <strong>City:</strong> {currentAcco?.city || 'N/A'}
            </p>
          </div>

          <div className={styles.section}>
            <h4>Property Details</h4>
            <p>
              <strong>Bedrooms:</strong> {currentAcco?.bedrooms || 'N/A'}
            </p>
            <div className={styles.features}>
              <p>
                <strong>Features:</strong>
              </p>
              {currentAcco?.features?.length > 0 ? (
                <ul>
                  {currentAcco.features.map((feature, index) => (
                    <li key={index}>
                      <Desk size={20} /> {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No features available.</p>
              )}
            </div>
            <p>
              <strong>Price per Night:</strong>{' '}
              {currentAcco?.pricePerNight?.toFixed(2) || 'N/A'}€
            </p>
            <p>
              <strong>Status:</strong>{' '}
              {currentAcco?.isBooked ? 'Booked' : 'Available'}
            </p>
            <p>
              <strong>Rating:</strong>{' '}
              {currentAcco?.rating?.toFixed(1) || 'No rating'}
            </p>
          </div>
        </div>
        <div>
          <AccoMap
            lat={currentAcco?.latitude}
            lon={currentAcco?.longitude}
            title={currentAcco?.title}
          />
        </div>
      </div>
    </section>
  );
}
