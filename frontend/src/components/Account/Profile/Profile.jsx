import React, { useState, useEffect } from 'react';
import '../../../App.css';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/UserAuthContext.jsx';
import { Eye, EyeSlash } from '@phosphor-icons/react';

export default function Profile() {
  const {
    user,
    updateProfile,
    deleteMyProfile,
    //showPassword,
    //togglePasswordVisibility,
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
  const [showPassword, setShowPassword] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
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
        confirmPassword: 'Passwords do not match.',
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
        alert('No changes found.');
      }
    } catch (error) {
      console.error('Profile update error:', error || error.message);
    }
  };

  const resetForm = () => {
    setFormData({
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
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
    });
  };

  return (
    <>
      <div className='accountWrapper'>
        <div className='headingEffectContainer'>
          <h2 className='headingEffect'>My Profile</h2>
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
            <div className={styles.button_container}>
              <button
                className={styles.buttons}
                onClick={() => setIsEditing(true)}
                title='Edit Profile'
              >
                Edit Profile
              </button>
              <button
                className={styles.buttons}
                onClick={() => setIsDeleting(true)}
                title='Delete Profile'
              >
                Delete Profile
              </button>
            </div>
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
                  <p className='inputError'>{errors.firstName}</p>
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
                  <p className='inputError'>{errors.lastName}</p>
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
                  <p className='inputError'>{errors.dateOfBirth}</p>
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
                {errors.phone && <p className='inputError'>{errors.phone}</p>}
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
                {errors.email && <p className='inputError'>{errors.email}</p>}
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
                    {showPassword ? (
                      <EyeSlash size={22} weight='duotone' />
                    ) : (
                      <Eye size={22} weight='duotone' />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className='inputError'>{errors.password}</p>
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
                    {showConfirmPassword ? (
                      <EyeSlash size={22} weight='duotone' />
                    ) : (
                      <Eye size={22} weight='duotone' />
                    )}
                  </span>
                </div>
                {errors.confirmPassword && (
                  <p className='inputError'>{errors.confirmPassword}</p>
                )}
              </div>

              <div className='formFooter'>
                <button
                  className='cancelButton'
                  type='button'
                  title='Cancel'
                  onClick={() => {
                    setIsEditing(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button className='saveButton' type='submit' title='Save'>
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
                title='Cancel'
                onClick={() => {
                  setIsDeleting(false);
                }}
              >
                Cancel
              </button>
              <button
                className='saveButton'
                onClick={() => deleteMyProfile()}
                title='Delete'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
