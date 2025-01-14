import React, { useEffect, useState } from 'react';
import globalStyles from '../../../pages/Account/Account.module.css';
import styles from './ListingsCard.module.css';
import { Link } from 'react-router-dom';
import { Trash, Pencil, Ghost } from '@phosphor-icons/react';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import UpdateListing from '../UpdateListing/UpdateListing.jsx';

export default function ListingsCard({ listing }) {
  const { deleteListing, setImagesToDelete } = useAcco();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    deleteListing(listing._id);
  };
  const handleShowForm = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowUpdateForm(true);
  };
  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
    setImagesToDelete([]);
  };

  return (
    <>
      <Link
        to={`/accommodationList/${listing.title
          .toLowerCase()
          .replace(/\s+/g, '-')}?id=${listing._id}`}
        state={{ id: listing._id }}
        className={globalStyles.cardLink}
      >
        <div className={globalStyles.cardContainer}>
          <div className={globalStyles.imgContainer}>
            <img
              src={listing.titleImage.secure_url}
              alt={listing.title}
              className={globalStyles.cardImage}
            />
          </div>
          <div className={globalStyles.infoContainer}>
            <div className={globalStyles.infoHeader}>
              <span className={globalStyles.cardTitle}>{listing.title}</span>
              <span className={globalStyles.cardCity}>{listing.city}</span>
            </div>
            <div className={globalStyles.infoBody}>
              <span
                className={globalStyles.cardRating}
                title={`Rating: ${listing.rating.toFixed(1)} spooks`}
              >
                <Ghost
                  className={globalStyles.ghost}
                  weight='fill'
                  size={24}
                  color='white'
                />
                {listing.rating.toFixed(1)}
              </span>
              <span className={styles.cardBedrooms}>
                Bedrooms: {listing.bedrooms}
              </span>
              <span className={styles.cardPricePerNight}>
                Price per Night: {listing.pricePerNight} €
              </span>
            </div>
          </div>
          <div className={styles.cardButtonContainer}>
            <button className={styles.listingsButton} onClick={handleShowForm}>
              <Pencil size={32} className={styles.buttonIcon} />
            </button>
            <button className={styles.listingsButton} onClick={handleDelete}>
              <Trash size={32} className={styles.buttonIcon} />
            </button>
          </div>
        </div>
      </Link>
      {showUpdateForm && (
        <UpdateListing
          listing={listing}
          setShowUpdateForm={handleCloseUpdateForm}
        />
      )}
    </>
  );
}
