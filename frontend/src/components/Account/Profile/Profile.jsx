import React, { useState } from 'react';
import styles from './Profile.module.css';
import { useAuth } from '../../../context/UserAuthContext.jsx';

export default function Profile({ showPassword, togglePasswordVisibility }) {
  const { user } = useAuth();

  console.log(user);

  const [isEditing, setIsEditing] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      const response = await api.put('/user/updateProfile', formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        alert('profile updated!');
        setUser(response.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('profile update error:', error || error.message);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.myProfile}>
        <h2>Mein Profil</h2>
        <div className={styles.profileInfo}>
          <table>
            <tr>
              <td>
                <span>Name: </span>
              </td>
              <td>
                {user?.firstName} {user?.lastName}
              </td>
            </tr>
            <tr>
              <td>
                <span>Email: </span>
              </td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td>
                <span>Phone: </span>
              </td>
              <td>{user?.phone}</td>
            </tr>
            <tr>
              <td>
                <span>Date of Birth: </span>
              </td>
              <td>{new Date(user?.dateOfBirth).toLocaleDateString('de-DE')}</td>
            </tr>
          </table>
        </div>

        <div className={styles.editProfile}>
          {isEditing && (
            <div className={styles.editForm}>
              <form onSubmit={handleSubmit}>
                <label>
                  First Name:
                  <input
                    type='text'
                    name='firstName'
                    value={user?.firstName}
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
                    value={user?.lastName}
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
                    value={user?.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <p className={styles.error}>{errors.email}</p>
                  )}
                </label>

                <label>
                  Password:
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={user?.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className={styles.icon}
                    onClick={togglePasswordVisibility}
                    role='button'
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
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
                    value={user?.confirmPassword}
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
                    value={user?.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && (
                    <p className={styles.error}>{errors.phone}</p>
                  )}
                </label>

                <label>
                  Birthday:
                  <input
                    type='text'
                    name='dateOfBirth'
                    value={new Date(user?.dateOfBirth).toLocaleDateString(
                      'de-DE'
                    )}
                    onChange={handleChange}
                    required
                  />
                  {errors.dateOfBirth && (
                    <p className={styles.error}>{errors.dateOfBirth}</p>
                  )}
                </label>

                {/* <label className={styles.checkbox}>
                  <input
                    type='checkbox'
                    name='dataConsent'
                    checked={user?.dataConsent}
                    onChange={handleChange}
                    required
                  />
                  I agree to the terms and conditions
                </label> */}
              </form>
            </div>
          )}
        </div>

        {!isEditing ? (
          <button
            className={styles.editProfileButton}
            onClick={() => setIsEditing(true)}
          >
            edit profile
          </button>
        ) : (
          <>
            <button className={styles.saveButton}>save</button>
            <button
              className={styles.cancelButton}
              onClick={() => setIsEditing(false)}
            >
              cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
