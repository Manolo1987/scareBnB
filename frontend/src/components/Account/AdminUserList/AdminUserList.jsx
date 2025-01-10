import React, { useEffect } from 'react';
import styles from './AdminUserList.module.css';
import { useAuth } from '../../../context/UserAuthContext';

export default function AdminUserList() {
  const { deleteUserAsAdmin, user, allUsers } = useAuth();
  console.log(allUsers);

  return (
    <section className={styles.userListContainer}>
      <h2>All ScareBnB Users</h2>
      <p>Here you can view and delete users</p>
      <div className={styles.userList}>
        {user?.roles === 'admin' &&
          allUsers.map((listedUser) => (
            <div key={listedUser._id} className={styles.listedUser}>
              <p>
                Full Name: {listedUser.firstName} {listedUser.lastName}
              </p>
              <p>Email: {listedUser.email}</p>
              <p>Phone: {listedUser.phone}</p>
              <p>
                Date of Birth:{' '}
                {new Date(listedUser?.dateOfBirth).toLocaleDateString('de-DE')}
              </p>
              <p>Role(s): {listedUser.roles}</p>
              <p>
                user created at:{' '}
                {new Date(listedUser?.createdAt).toLocaleDateString('de-DE')}
              </p>
              <p>Number of bookings: {listedUser.bookings.length}</p>
              <details>
                <summary>Bookings ({listedUser.bookings.length})</summary>
                {listedUser.bookings.map((booking) => (
                  <div key={booking._id} className={styles.userBooking}>
                    <p>{booking.accommodation.title}</p>
                    <p>
                      Check In:{' '}
                      {new Date(booking.checkIn).toLocaleDateString('de-DE')}
                    </p>
                    <p>
                      Check Out:{' '}
                      {new Date(booking.checkOut).toLocaleDateString('de-DE')}
                    </p>
                    <p>cancelled: {booking.isCancelled ? 'yes' : 'no'}</p>
                  </div>
                ))}
              </details>
              <details>
                <summary>Listings ({listedUser.listings.length})</summary>
                {listedUser.listings.map((listing) => (
                  <ul>
                    <li key={listing._id}>{listing.title}</li>
                  </ul>
                ))}
              </details>
              <details>
                <summary>Comments ({listedUser.comments?.length})</summary>
                {listedUser.comments?.map((comment) => (
                  <div key={comment._id} className={styles.userComment}>
                    <p>Accommodation: {comment?.location?.title}</p>
                    <p>Title: {comment?.title}</p>
                    <p>Content: {comment?.content}</p>
                  </div>
                ))}
              </details>
              {user._id !== listedUser._id && (
                <button onClick={() => deleteUserAsAdmin(listedUser._id)}>
                  Delete User
                </button>
              )}
            </div>
          ))}
      </div>
    </section>
  );
}
