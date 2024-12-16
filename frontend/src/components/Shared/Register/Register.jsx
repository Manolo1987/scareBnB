import React, { useState } from 'react';
import styles from './Register.module.css';
import { useAuth } from '../../../context/UserAuthContext';

export default function Register({
  showRegister,
  setShowRegister,
  showPassword,
  togglePasswordVisibility,
}) {
  const { registration } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    dataConsent: false,
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    dataConsent: '',
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const closeAndReset = () => {
    setShowRegister(false);
    setFormData({
      email: '',
      password: '',
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
      return;
    }
    try {
      await registration(formData);
      setShowRegister(false);
    } catch (error) {
      console.error('Registration error:', error || error.message);
    }
  };

  return (
    <>
      <button
        className={styles.register_button}
        onClick={() => setShowRegister(true)}
      >
        Register
      </button>

      {/* Register Overlay */}
      {showRegister && (
        <div className={styles.overlay}>
          <div className={styles.overlay_content}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <label>
                First Name:
                <input
                  type='text'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && (
                  <p className={styles.error}>{errors.firstName}</p>
                )}
              </label>

              <label>
                Last Name:
                <input
                  type='text'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && (
                  <p className={styles.error}>{errors.lastName}</p>
                )}
              </label>

              <label>
                Email:
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className={styles.error}>{errors.email}</p>}
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
                {errors.password && (
                  <p className={styles.error}>{errors.password}</p>
                )}
              </label>

              <label>
                Confirm Password:
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className={styles.icon}
                  onClick={toggleConfirmPasswordVisibility}
                  role='button'
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? '👻' : '👁️'}
                </span>
                {errors.confirmPassword && (
                  <p className={styles.error}>{errors.confirmPassword}</p>
                )}
              </label>

              <label>
                Phone:
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {errors.phone && <p className={styles.error}>{errors.phone}</p>}
              </label>

              <label>
                Birthday:
                <input
                  type='date'
                  name='dateOfBirth'
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
                {errors.dateOfBirth && (
                  <p className={styles.error}>{errors.dateOfBirth}</p>
                )}
              </label>

              <label className={styles.checkbox}>
                <input
                  type='checkbox'
                  name='dataConsent'
                  checked={formData.dataConsent}
                  onChange={handleChange}
                  required
                />
                I agree to the terms and conditions
              </label>

              <button type='submit'>Submit</button>
              <button type='button' onClick={closeAndReset}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
