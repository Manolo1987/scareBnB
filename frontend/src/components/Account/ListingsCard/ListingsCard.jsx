import React from 'react';
import styles from './ListingsCard.module.css';
import { Link } from 'react-router-dom';
import { Trash, Pencil } from '@phosphor-icons/react';

export default function ListingsCard({ listing }) {
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
        <button className={styles.listingsButton}>
          <Trash size={32} />
        </button>
      </div>
    </Link>
  );
}
