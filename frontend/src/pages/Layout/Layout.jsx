import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Shared/Header/Header.jsx';
import Footer from '../../components/Shared/Footer/Footer.jsx';
import Booking from '../../components/Shared/Footer/Footer.jsx';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
