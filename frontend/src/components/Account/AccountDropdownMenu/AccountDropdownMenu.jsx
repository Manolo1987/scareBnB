import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AccountDropdownMenu.module.css';
import { useAuth } from '../../../context/UserAuthContext.jsx';
import Login from '../../Shared/Login/Login.jsx';
import Register from '../../Shared/Register/Register.jsx';
import menu from '../../../assets/images/avatar.png';

export default function AccountDropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const isAdmin = user?.roles === 'admin';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdown_icon} onClick={toggleMenu}>
        <img src={menu} alt='avatar_icon' />
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
                      className={styles.dropdown_link}
                    >
                      User List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/account/adminAccoList'
                      className={styles.dropdown_link}
                    >
                      Accommodations List
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className={`${styles.dropdown_link} ${styles.logout}`}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Login />
              </li>
              <li>
                <Register />
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}
