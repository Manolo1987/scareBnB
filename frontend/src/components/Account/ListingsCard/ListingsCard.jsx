import React from 'react';
import styles from './ListingsCard.module.css';
import { Link } from 'react-router-dom';
import { Trash, Pencil } from '@phosphor-icons/react';
import { useAcco } from '../../../context/AccommodationContext.jsx';

export default function ListingsCard({ listing }) {
  const { deleteListing } = useAcco();
  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    deleteListing(listing._id);
  };
  return (
    <Link
      to={`/accommodationList/${listing.title
        .toLowerCase()
        .replace(/\s+/g, '-')}?id=${listing._id}`}
      state={{ id: listing._id }}
      className={styles.listingCardLink}
    >
      <div className={styles.listingCard}>
        {/* add listing infos and styling here */}
        {listing.title}
        {listing.city}
        {listing.rating.toFixed(1)}
        {listing.bedroms}
        {listing.pricePerNight}

        <button className={styles.listingsButton}>
          <Pencil size={32} />
        </button>
        <button className={styles.listingsButton} onClick={handleDelete}>
          <Trash size={32} />
        </button>
      </div>
    </Link>
  );
}
