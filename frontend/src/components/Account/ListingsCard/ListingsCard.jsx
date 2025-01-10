import React, { useEffect, useState } from 'react';
import styles from './ListingsCard.module.css';
import { Link } from 'react-router-dom';
import { Trash, Pencil } from '@phosphor-icons/react';
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
        className={styles.listingCardLink}
      >
        <div className={styles.listingCard}>
          <div className={styles.imgContainer}>
            <img
              src={listing.titleImage.secure_url}
              alt={listing.title}
              className={styles.cardImage}
            />
          </div>
          <div className={styles.infoContainer}>
            <span className={styles.cardTitle}>{listing.title}</span>
            <span className={styles.cardCity}>{listing.city}</span>
            <span className={styles.cardRating}>
              {listing.rating.toFixed(1)}
            </span>
            <span className={styles.cardBedrooms}>
              Bedrooms: {listing.bedrooms}
            </span>
            <span className={styles.cardPricePerNight}>
              Price per Night: {listing.pricePerNight}
            </span>
          </div>
          <div className={styles.cardButtonContainer}>
            <button className={styles.listingsButton} onClick={handleShowForm}>
              <Pencil size={32} />
            </button>
            <button className={styles.listingsButton} onClick={handleDelete}>
              <Trash size={32} />
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
