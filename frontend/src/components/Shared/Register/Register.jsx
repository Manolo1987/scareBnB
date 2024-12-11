import React, { useState } from 'react';
import styles from './Register.module.css';

export default function Register() {
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    dataConsent: false,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthDate: "",
    dataConsent: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData);
    
  }

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
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <p className={styles.error}>{errors.password}</p>
                )}
              </label>

              <label>
                Confirm Password:
                <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
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
                  name='birthDate'
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
                {errors.birthDate && (
                  <p className={styles.error}>{errors.birthDate}</p>
                )}
              </label>

              <label>
                <input
                  type='checkbox'
                  name='dataConsent'
                  checked={formData.dataConsent}
                  onChange={handleChange}
                />
                I agree to the terms and conditions
              </label>

              <button type='submit'>Submit</button>
              <button type='button' onClick={() => setShowRegister(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
