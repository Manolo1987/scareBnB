import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './ListingsNav.module.css';

export default function ListingsNav() {
  return (
    <div className={styles.listingsNav}>
      <ul className={styles.listingsNavList}>
        <li>
          <NavLink
            to='/account/listings'
            className={({ isActive }) =>
              isActive
                ? `${styles.listingsNavLink} ${styles.activeLink}`
                : styles.listingsNavLink
            }
          >
            My Listings
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/account/bookedListings'
            className={({ isActive }) =>
              isActive
                ? `${styles.listingsNavLink} ${styles.activeLink}`
                : styles.listingsNavLink
            }
          >
            Booked Listings
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/account/add-new-listing'
            className={({ isActive }) =>
              isActive
                ? `${styles.listingsNavLink} ${styles.activeLink}`
                : styles.listingsNavLink
            }
          >
            Create Listing
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
