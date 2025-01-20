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
        <li className={styles.buttonEffe}>
          <NavLink
            to='/account/profile'
            className={({ isActive }) =>
              isActive
                ? `${styles.accountNavLink} ${styles.activeLink}`
                : styles.accountNavLink
            }
          >
            profile
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
            favourites
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
            bookings
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
            listings
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
