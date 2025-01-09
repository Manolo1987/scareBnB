import React, { useEffect } from 'react';
import styles from './AdminUserList.module.css';
import { useAuth } from '../../../context/UserAuthContext';

export default function AdminUserList() {
  const { getAllUsers, deleteUserAsAdmin, user, allUsers } = useAuth();
  console.log(allUsers);

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <section>
      <h2>All ScareBnB Users</h2>
      <p>Here you can view and delete users</p>
      <div className={styles.userList}>
        {user?.roles === 'admin' &&
          allUsers.map((listedUser) => (
            <div key={listedUser._id}>
              <p>
                Full Name: {listedUser.firstName} {listedUser.lastName}
              </p>
              <p>Email: {listedUser.email}</p>
              <p>
                Date of Birth:{' '}
                {new Date(listedUser?.dateOfBirth).toLocaleDateString('de-DE')}
              </p>
              <p>Role(s): {listedUser.roles}</p>
              <p>Number of bookings: {listedUser.bookings.length}</p>
              <details>
                <summary>Listings ({listedUser.listings.length})</summary>
                {listedUser.listings.map((listing) => (
                  <p key={listing._id}>{listing.title}</p>
                ))}
              </details>
              {user._id !== listedUser._id && (
                <button onClick={() => deleteUserAsAdmin(listedUser._id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
      </div>
    </section>
  );
}
