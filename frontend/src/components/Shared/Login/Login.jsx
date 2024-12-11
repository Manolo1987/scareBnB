import React, { useState } from 'react';
import styles from './Login.module.css';

export default function Login() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <button
        className={styles.login_button}
        onClick={() => setShowLogin(true)}
      >
        Login
      </button>

      {/* Login Overlay */}
      {showLogin && (
        <div className={styles.overlay}>
          <div className={styles.overlay_content}>
            <h2>Login</h2>
            <form>
              <label>
                Email:
                <input type='email' name='email' />
              </label>
              <label>
                Password:
                <input type='password' name='password' />
              </label>
              <button type='submit'>Submit</button>
              <button type='button' onClick={() => setShowLogin(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
