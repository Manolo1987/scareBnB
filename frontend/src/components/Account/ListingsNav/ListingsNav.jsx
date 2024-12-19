import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './ListingsNav.module.css';

export default function ListingsNav() {
  return (
    <div className={styles.listingsNav}>
      <ul className={listingsNavList}>
        <li>
          <NavLink to='/account/listings' className={styles.listingsNavLink}>
            My Listings
          </NavLink>
        </li>
        <li>
          <NavLink to='/account/listings' className={styles.listingsNavLink}>
            Booked Listings
          </NavLink>
        </li>
        <li>
          <NavLink to='/account/listings' className={styles.listingsNavLink}>
            Create Listings
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
