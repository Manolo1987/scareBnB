import React, { useState } from 'react';
import styles from './Register.module.css';
import { useAuth } from '../../../context/UserAuthContext';
import { Eye, EyeSlash } from '@phosphor-icons/react';

export default function Register() {
  const {
    registration,
    showPassword,
    setShowPassword,
    togglePasswordVisibility,
    showRegister,
    setShowRegister,
  } = useAuth();
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

  const validateField = (name, value) => {
    let error = '';
    if (name === 'firstName' || name === 'lastName') {
      if (!/^[a-zA-Z\s.,;:'"_\-\u00C0-\u00FFäöüÄÖÜß]+$/.test(value)) {
        error = `${name} contains invalid characters!`;
      } else if (value.length < 3 || value.length > 30) {
        error = `${name} must be between 3 and 30 characters long.`;
      }
    }
    if (name === 'email') {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        error = 'Invalid email!';
      }
    }
    if (name === 'phone') {
      if (!/^[0-9]+$/.test(value)) {
        error = 'Phone number must only contain numbers!';
      }
    }
    if (name === 'password') {
      if (
        !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/.test(
          value
        )
      ) {
        error =
          'Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character!';
      }
    }
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        error = 'Passwords do not match!';
      }
    }
    if (name === 'dateOfBirth') {
      const today = new Date();
      const maxPastDate = new Date(
        today.getFullYear() - 101,
        today.getMonth(),
        today.getDate()
      );

      if (new Date(value) > today) {
        error = 'The date of birth cannot be in the future!';
      } else if (new Date(value) < maxPastDate) {
        error =
          'The date of birth cannot be more than 101 years in the past! (You are not a ghost)';
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (value.trim() === '') {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
      return;
    }

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formIsValid = true;

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        formIsValid = false;
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (!formIsValid) return;

    try {
      await registration(formData);
      setShowRegister(false);
    } catch (error) {
      console.error('Registration error:', error || error.message);
    }
  };

  const closeAndReset = () => {
    setShowRegister(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      dataConsent: false,
    });
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      dataConsent: '',
    });
  };

  return (
    <>
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
                  {showPassword ? (
                    <EyeSlash size={22} weight='duotone' />
                  ) : (
                    <Eye size={22} weight='duotone' />
                  )}
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
                  {showConfirmPassword ? (
                    <EyeSlash size={22} weight='duotone' />
                  ) : (
                    <Eye size={22} weight='duotone' />
                  )}
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

              <button className='buttonEffect' type='submit'>
                Submit
              </button>
              <button
                className='buttonEffect'
                type='button'
                onClick={closeAndReset}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
