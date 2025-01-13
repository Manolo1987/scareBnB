import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Shared/Header/Header.jsx';
import Footer from '../../components/Shared/Footer/Footer.jsx';
import styles from './Layout.module.css';
import BackToTop from '../../components/Shared/BackToTop/BackToTop.jsx';

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
        <BackToTop/>
      </main>
      <Footer />
    </>
  );
}
