import React, { useState } from 'react';
import styles from './Login.module.css';
import { useAuth } from '../../../context/UserAuthContext';

export default function Login({
  showLogin,
  setShowLogin,
  setShowRegister,
  showPassword,
  togglePasswordVisibility,
}) {
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
      setShowLogin(false)
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
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className={styles.icon}
                  onClick={togglePasswordVisibility}
                  role='button'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👻' : '👁️'}
                </span>
              </label>
              <button type='submit'>Login</button>
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
