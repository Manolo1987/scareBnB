import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AccountDropdownMenu.module.css';
import { useAuth } from '../../../context/UserAuthContext.jsx';

export default function AccountDropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.roles === 'admin';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.dropdown}>
      <button className={styles.dropdownButton} onClick={toggleMenu}>
        menu {/* TODO Muss noch geändert werden */}
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          <li>
            <NavLink to='/account/profile' className={styles.dropdownLink}>
              profile
            </NavLink>
          </li>
          <li>
            <NavLink to='/account/favourites' className={styles.dropdownLink}>
              favourites
            </NavLink>
          </li>
          <li>
            <NavLink to='/account/bookings' className={styles.dropdownLink}>
              bookings
            </NavLink>
          </li>
          <li>
            <NavLink to='/account/listings' className={styles.dropdownLink}>
              listings
            </NavLink>
          </li>
          {isAdmin && (
            <>
              <li>
                <NavLink
                  to='/account/adminUserList'
                  className={styles.dropdownLink}
                >
                  UserList
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/account/adminAccoList'
                  className={styles.dropdownLink}
                >
                  AccoList
                </NavLink>
              </li>
            </>
          )}
          <li>
            <button
              onClick={handleLogout}
              className={`${styles.dropdownLink} ${styles.logout}`}
            >
              logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
