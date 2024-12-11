import React from 'react';
import styles from './Header.module.css';
import Login from "../Login/Login";
import Register from "../Register/Register";

export default function Header() {
  return (
    <header>
      <section className={styles.top_banner}>
        <div className={styles.icon_container}>
          <img src="https://st4.depositphotos.com/14009552/23169/i/450/depositphotos_231693396-stock-photo-paint-home-vector-logo.jpg" alt="website-icon" />
          <p>Scarebnb</p>
        </div>
        <div className={styles.account}>
          <Login />
          <Register />
        </div>
      </section>
      <div className={styles.title}>
        <h1>Scarebnb</h1>
        <p>Ready getting spooked!?</p>
      </div>
    </header>
  );
}
