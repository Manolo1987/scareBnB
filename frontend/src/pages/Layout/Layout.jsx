import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Shared/Header/Header.jsx';
import Footer from '../../components/Shared/Footer/Footer.jsx';
import styles from './Layout.module.css';
import BackToTop from '../../components/Shared/BackToTop/BackToTop.jsx';
import CookieBanner from '../../components/Shared/CookieBanner/Cookiebanner.jsx';
import SoundAndFog from '../../components/Shared/SoundAndFog/SoundAndFog.jsx';

export default function Layout() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <CookieBanner />
        <Outlet />
        <BackToTop />
      </main>
      <Footer />
      <SoundAndFog />
    </>
  );
}
