import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AccountNav.module.css';
import { useAuth } from '../../../context/UserAuthContext.jsx';

export default function AccountNav() {
  const { user, logout } = useAuth();
  const isAdmin = user?.roles === 'admin';
  return (
    <div className={styles.accountNav}>
      <ul className={styles.accountNavList}>
        <li>
          <NavLink
            to='/account/profile'
            className={({ isActive }) =>
              isActive
                ? `${styles.accountNavLink} ${styles.activeLink}`
                : styles.accountNavLink
            }
          >
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/account/favourites'
            className={({ isActive }) =>
              isActive
                ? `${styles.accountNavLink} ${styles.activeLink}`
                : styles.accountNavLink
            }
          >
            Favourites
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/account/bookings'
            className={({ isActive }) =>
              isActive
                ? `${styles.accountNavLink} ${styles.activeLink}`
                : styles.accountNavLink
            }
          >
            Bookings
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/account/listings'
            className={({ isActive }) =>
              isActive
                ? `${styles.accountNavLink} ${styles.activeLink}`
                : styles.accountNavLink
            }
          >
            Listings
          </NavLink>
        </li>
        {isAdmin && (
          <>
            <li>
              <NavLink
                to='/account/adminUserList'
                className={({ isActive }) =>
                  isActive
                    ? `${styles.admin_link} ${styles.accountNavLink} ${styles.activeLink}`
                    : `${styles.admin_link} ${styles.accountNavLink}`
                }
              >
                UserList
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/account/adminAccoList'
                className={({ isActive }) =>
                  isActive
                    ? `${styles.admin_link} ${styles.accountNavLink} ${styles.activeLink}`
                    : `${styles.admin_link} ${styles.accountNavLink}`
                }
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
