import React, { useState, useEffect } from 'react';
import styles from './Login.module.css';
import { useAuth } from '../../../context/UserAuthContext';
import { Eye, EyeSlash } from '@phosphor-icons/react';

export default function Login() {
  const {
    login,
    showPassword,
    setShowPassword,
    togglePasswordVisibility,
    showLogin,
    setShowLogin,
    setShowRegister,
  } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (showLogin) {
      setFormData({
        email: '',
        password: '',
      });
    }
  }, [showLogin]);

  const closeAndReset = () => {
    setShowLogin(false);
    setShowPassword(false);
    setFormData({
      email: '',
      password: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      setShowLogin(false);
    } catch (err) {
      setError('Error during login. Please check your login credentials.');
      toast.error('Error during login. Please check your login credentials.');
    }
  };

  return (
    <>
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
                  {showPassword ? (
                    <EyeSlash size={22} weight='duotone' />
                  ) : (
                    <Eye size={22} weight='duotone' />
                  )}
                </span>
              </label>
              <button className='buttonEffect' type='submit'>
                Login
              </button>
              <button
                className='buttonEffect'
                type='button'
                onClick={closeAndReset}
              >
                Close
              </button>
              <p>
                No Account?{' '}
                <span
                  onClick={() => {
                    closeAndReset();
                    setShowRegister(true);
                  }}
                  role='button'
                  tabIndex='0'
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
