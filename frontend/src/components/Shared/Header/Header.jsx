import React, { useState } from 'react';
import styles from './Header.module.css';
import Login from '../Login/Login';
import Register from '../Register/Register';
import AccountDropdownMenu from '../../Account/AccountDropdownMenu/AccountDropdownMenu';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <header className={isHomepage ? styles.bigHeader : styles.smallHeader}>
      <section className={styles.top_banner}>
        <div className={styles.title_wrapper}>
          {!isHomepage && (
            <Link to='/' title='Home'>
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
          <Link to='/' title='Home'>
            <h1 className={styles.h1}>Scarebnb</h1>
          </Link>
          <p>Ready to get spooked!?</p>
        </div>
      )}
      <div className={styles.headerBorder}></div>
    </header>
  );
}
