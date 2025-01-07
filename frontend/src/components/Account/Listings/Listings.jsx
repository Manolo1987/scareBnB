import React from 'react';
import styles from './Listings.module.css';
import ListingsCard from '../ListingsCard/ListingsCard.jsx';
import ListingsNav from '../ListingsNav/ListingsNav.jsx';

export default function Listings() {
  return (
    <div>
      <ListingsNav />
      My Listings
      <ListingsCard />
    </div>
  );
}
