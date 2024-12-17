import React, { useState } from 'react';
import styles from './Profile.module.css';
import { useAuth } from '../../../context/UserAuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
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
  );
}
