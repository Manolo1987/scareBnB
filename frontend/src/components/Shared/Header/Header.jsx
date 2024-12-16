import React, { useState } from 'react';
import styles from './Header.module.css';
import Login from '../Login/Login';
import Register from '../Register/Register';
import AccountDropdownMenu from '../../Account/AccountDropdownMenu/AccountDropdownMenu';
import { useAuth } from '../../../context/UserAuthContext';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <header>
      <section className={styles.top_banner}>
        <div className={styles.icon_container}>
          <img
            src='https://st4.depositphotos.com/14009552/23169/i/450/depositphotos_231693396-stock-photo-paint-home-vector-logo.jpg'
            alt='website-icon'
          />
        </div>
        <div className={styles.account}>
          {isAuthenticated ? (
            <AccountDropdownMenu />
          ) : (
            <>
              <Login
                showLogin={showLogin}
                setShowLogin={setShowLogin}
                setShowRegister={setShowRegister}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />
              <Register
                showRegister={showRegister}
                setShowRegister={setShowRegister}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            </>
          )}
        </div>
      </section>
      <div className={styles.title}>
        <h1>Scarebnb</h1>
        <p>Ready getting spooked!?</p>
      </div>
    </header>
  );
}
