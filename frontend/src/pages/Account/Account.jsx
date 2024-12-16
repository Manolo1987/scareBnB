import React from 'react';
import styles from './Account.module.css';
import Header from '../../components/Shared/Header/Header.jsx';
import AccountNav from '../../components/Account/AccountNav/AccountNav.jsx';
import { Outlet } from 'react-router-dom';
import Footer from '../../components/Shared/Footer/Footer.jsx';

export default function Account() {
  return (
    <>
      <AccountNav />
      <Outlet />
    </>
  );
}
