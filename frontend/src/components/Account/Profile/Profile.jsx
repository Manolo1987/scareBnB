import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/UserAuthContext.jsx';

export default function Profile() {
  const {
    user,
    updateProfile,
    deleteMyProfile,
    showPassword,
    togglePasswordVisibility,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split('T')[0]
      : '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
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

  const getChangedValues = () => {
    const changedValues = {};
    for (const key in formData) {
      if (formData[key] !== user[key] && formData[key] !== '') {
        changedValues[key] = formData[key];
      }
    }
    return changedValues;
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
      const changedData = getChangedValues();
      console.log('changedData:', changedData);

      if (Object.keys(changedData).length > 0) {
        await updateProfile(changedData);
        setIsEditing(false);
      } else {
        alert('no changes found');
      }
    } catch (error) {
      console.error('Profile update error:', error || error.message);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.myProfile}>
        <h2>My Profile</h2>
        <div className={styles.profileInfo}>
          <table>
            <tbody>
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
                <td>
                  {new Date(user?.dateOfBirth).toLocaleDateString('de-DE')}
                </td>
              </tr>
            </tbody>
          </table>
          {!isEditing && (
            <>
              <button
                className={styles.editProfileButton}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button
                className={styles.deleteProfileButton}
                onClick={() => setIsDeleting(true)}
              >
                Delete Profile
              </button>
            </>
          )}
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
                  Phone:
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
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

                <label>
                  Email:
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
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
                    value={formData.password}
                    onChange={handleChange}
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
                    value={formData.confirmPassword}
                    onChange={handleChange}
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

                <button className={styles.saveButton} type='submit'>
                  Save
                </button>
                <button
                  className={styles.cancelButton}
                  type='button'
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>

        <div className={styles.deleteProfile}>
          {isDeleting && (
            <div className={styles.deleteOverlay}>
              <div className={styles.deleteContent}>
                <p>Are you sure you want to delete your profile?</p>
                <div className={styles.buttonsContainer}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteMyProfile()}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setIsDeleting(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
