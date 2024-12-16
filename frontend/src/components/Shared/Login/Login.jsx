import React, { useState } from 'react';
import styles from './Login.module.css';
import Register from '../Register/Register';
import { useAuth } from '../../../context/UserAuthContext';

export default function Login({ showLogin, setShowLogin, setShowRegister }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // if (errors[name]) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     [name]: '',
    //   }));
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (err) {
      setError('Fehler beim Login. Überprüfe deine Anmeldedaten.');
      toast.error('Fehler beim Login. Überprüfe deine Anmeldedaten.');
    }
  };

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
            <form onSubmit={handleSubmit}>
              <label>
                Email:
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type='submit'>Submit</button>
              <button type='button' onClick={() => setShowLogin(false)}>
                Close
              </button>
              <p>
                No Account?{' '}
                <span
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                >
                  Register now!
                </span>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
