import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AccountDropdownMenu.module.css';
import { useAuth } from '../../../context/UserAuthContext.jsx';
import { UserCircleCheck, UserCircle } from '@phosphor-icons/react';

export default function AccountDropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, setShowLogin, setShowRegister } =
    useAuth();
  const isAdmin = user?.roles === 'admin';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.dropdown}>
      <div
        className={
          isAuthenticated ? styles.dropdown_icon_red : styles.dropdown_icon
        }
        onClick={toggleMenu}
        title='Account'
        aria-label='Account'
      >
        {isAuthenticated ? (
          <UserCircleCheck size={50} color='white' weight='fill' />
        ) : (
          <UserCircle size={50} color='grey' />
        )}
      </div>
      {isOpen && (
        <ul className={styles.dropdown_menu}>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to='/account/profile' className={styles.dropdown_link}>
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/account/favourites'
                  className={styles.dropdown_link}
                >
                  Favourites
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/account/bookings'
                  className={styles.dropdown_link}
                >
                  Bookings
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/account/listings'
                  className={styles.dropdown_link}
                >
                  Listings
                </NavLink>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <NavLink
                      to='/account/adminUserList'
                      className={`${styles.admin_link} ${styles.dropdown_link}`}
                    >
                      User List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/account/adminAccoList'
                      className={`${styles.admin_link} ${styles.dropdown_link}`}
                    >
                      Acco List
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <button onClick={handleLogout} className={styles.logout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li
                className={styles.dropdown_link}
                onClick={() => setShowLogin(true)}
              >
                Login
              </li>
              <li
                className={styles.dropdown_link}
                onClick={() => setShowRegister(true)}
              >
                Register
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}
