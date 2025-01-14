import React, { useState, useEffect } from 'react';
import '../../../App.css';
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
    <>
      <div className='listingsWrapper'>
        <div className='headingEffectContainer'>
          <h1 className='headingEffect'>My Profile</h1>
        </div>
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

        {isEditing && (
          <div className='formWrapper'>
            <form onSubmit={handleSubmit} className='accountForm'>
              <div className='inputContainer'>
                <label>First Name:</label>
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
              </div>
              <div className='inputContainer'>
                <label>Last Name:</label>
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
              </div>
              <div className='inputContainer'>
                <label>Birthday:</label>
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
              </div>
              <div className='inputContainer'>
                <label>Phone:</label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {errors.phone && <p className={styles.error}>{errors.phone}</p>}
              </div>

              <div className='inputContainer'>
                <label>Email:</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className={styles.error}>{errors.email}</p>}
              </div>

              <div className='inputContainer'>
                <label>Password:</label>
                <div className={styles.passwordWrapper}>
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
                </div>
                {errors.password && (
                  <p className={styles.error}>{errors.password}</p>
                )}
              </div>

              <div className='inputContainer'>
                <label>Confirm Password:</label>
                <div className={styles.passwordWrapper}>
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
                </div>
                {errors.confirmPassword && (
                  <p className={styles.error}>{errors.confirmPassword}</p>
                )}
              </div>

              <div className='formFooter'>
                <button
                  className='cancelButton'
                  type='button'
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button className='saveButton' type='submit'>
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {isDeleting && (
        <div className={styles.deleteOverlay}>
          <div className={styles.deleteContent}>
            <p className={styles.deleteMessage}>
              Are you sure you want to delete your profile?
            </p>
            <div className='formFooter'>
              <button
                className='cancelButton'
                onClick={() => setIsDeleting(false)}
              >
                Cancel
              </button>
              <button className='saveButton' onClick={() => deleteMyProfile()}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
