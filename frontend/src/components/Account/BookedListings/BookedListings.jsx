import React from 'react';
import styles from './BookedListings.module.css';
import ListingsNav from '../ListingsNav/ListingsNav.jsx';
import BookedListingsCard from '../BookedListingsCard/BookedListingsCard.jsx';

export default function BookedListings() {
  return (
    <div>
      <ListingsNav />
      BookedListings
      <BookedListingsCard />
    </div>
  );
}
