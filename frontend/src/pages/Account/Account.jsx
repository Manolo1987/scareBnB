import React from 'react';
import styles from './Account.module.css';
import AccountNav from '../../components/Account/AccountNav/AccountNav.jsx';
import { Outlet } from 'react-router-dom';

export default function Account() {
  return (
    <>
      <AccountNav />
      <div className={styles.accountContainer}>
        <Outlet />
      </div>
    </>
  );
}
