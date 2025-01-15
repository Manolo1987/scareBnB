import React, { useState } from 'react';
import styles from './Header.module.css';
import Login from '../Login/Login';
import Register from '../Register/Register';
import AccountDropdownMenu from '../../Account/AccountDropdownMenu/AccountDropdownMenu';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/images/LOGO_scarebnb_V1_160px.png';

export default function Header() {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <header className={isHomepage ? styles.bigHeader : styles.smallHeader}>
      <section className={styles.top_banner}>
        <div className={styles.icon_container_wrapper}>
          <div className={styles.icon_container}>
            <Link to='/'>
              <img src={logo} alt='website_icon' />
            </Link>
          </div>
          {!isHomepage && (
            <Link to='/'>
              <h1 className={styles.h1}>Scarebnb</h1>
            </Link>
          )}
        </div>
        <div>
          <AccountDropdownMenu />
          <Login />
          <Register />
        </div>
      </section>
      {isHomepage && (
        <div className={styles.title}>
          <Link to='/'>
            <h1 className={styles.h1}>Scarebnb</h1>
          </Link>
          <p>Ready getting spooked!?</p>
        </div>
      )}
      <div className={styles.headerBorder}></div>
    </header>
  );
}
