import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AccountNav.module.css';

export default function AccountNav() {
  const isAdmin = true; // user?.roles === 'admin'; TODO muss noch geändert werden
  return (
    <div className={styles.accountNav}>
      <ul className={styles.accountNavList}>
        <li>
          <NavLink to='/account/profile' className={styles.accountNavLink}>
            profile
          </NavLink>
        </li>
        <li>
          <NavLink to='/account/favourites' className={styles.accountNavLink}>
            favourites
          </NavLink>
        </li>
        <li>
          <NavLink to='/account/bookings' className={styles.accountNavLink}>
            bookings
          </NavLink>
        </li>
        <li>
          <NavLink to='/account/listings' className={styles.accountNavLink}>
            listings
          </NavLink>
        </li>
        {isAdmin && (
          <>
            <li>
              <NavLink
                to='/account/adminUserList'
                className={styles.accountNavLink}
              >
                UserList
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/account/adminAccoList'
                className={styles.accountNavLink}
              >
                AccoList
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
