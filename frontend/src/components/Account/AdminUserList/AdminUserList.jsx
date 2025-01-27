import React, { useEffect, useState } from 'react';
import styles from './AdminUserList.module.css';
import { useAuth } from '../../../context/UserAuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../Shared/LoadingSpinner/LoadingSpinner.jsx';

export default function AdminUserList() {
  const { deleteUserAsAdmin, user, allUsers, getAllUsers } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getAllUsers();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <section className={styles.userListContainer}>
      <h2>All ScareBnB Users</h2>
      <p>Here you can view and delete users</p>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Role(s)</th>
                <th>Created At</th>
                <th>Bookings</th>
                <th>Listings</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {user?.roles === 'admin' &&
                allUsers?.map((listedUser) => (
                  <tr key={listedUser._id}>
                    <td>
                      {listedUser.firstName} {listedUser.lastName}
                    </td>
                    <td>{listedUser.email}</td>
                    <td>{listedUser.phone}</td>
                    <td>
                      {new Date(listedUser?.dateOfBirth).toLocaleDateString(
                        'de-DE'
                      )}
                    </td>
                    <td>{listedUser.roles}</td>
                    <td>
                      {new Date(listedUser?.createdAt).toLocaleDateString(
                        'de-DE'
                      )}
                    </td>
                    <td>
                      <details>
                        <summary>
                          Bookings ({listedUser.bookings.length})
                        </summary>
                        <ul>
                          {listedUser.bookings.map((booking) => (
                            <div
                              key={booking._id}
                              className={styles.userComment}
                            >
                              <p>
                                Accommodation:{' '}
                                <Link
                                  to={`/accommodationList/${booking.accommodation.title
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}?id=${
                                    booking.accommodation._id
                                  }`}
                                  state={{ id: booking.accommodation._id }}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  title='View Accommodation in a new tab'
                                >
                                  {booking.accommodation.title}
                                </Link>
                              </p>
                              <p>
                                Check-In:{' '}
                                {new Date(booking.checkIn).toLocaleDateString(
                                  'de-DE'
                                )}
                              </p>
                              <p>
                                Check-Out:{' '}
                                {new Date(booking.checkOut).toLocaleDateString(
                                  'de-DE'
                                )}
                              </p>
                              {booking.isCancelled && (
                                <span className={styles.cancelled}>
                                  Cancelled
                                </span>
                              )}
                            </div>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td>
                      <details>
                        <summary>
                          Listings ({listedUser.listings.length})
                        </summary>
                        <ul>
                          {listedUser.listings.map((listing) => (
                            <li key={listing._id}>
                              <Link
                                to={`/accommodationList/${listing.title
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')}?id=${listing._id}`}
                                state={{ id: listing._id }}
                                target='_blank'
                                rel='noopener noreferrer'
                                title='View Accommodation in a new tab'
                              >
                                {listing.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td>
                      <details>
                        <summary>
                          Comments ({listedUser.comments?.length})
                        </summary>
                        {listedUser.comments?.map((comment) => (
                          <div key={comment._id} className={styles.userComment}>
                            <p>
                              Accommodation:{' '}
                              <Link
                                to={`/accommodationList/${comment.location.title
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')}?id=${
                                  comment.location._id
                                }`}
                                state={{ id: comment.location._id }}
                                target='_blank'
                                rel='noopener noreferrer'
                                title='View Comment in a new tab'
                              >
                                {comment.location.title}
                              </Link>
                            </p>
                            <p>Title: {comment?.title}</p>
                            <p>Content: {comment?.content}</p>
                          </div>
                        ))}
                      </details>
                    </td>
                    <td>
                      {user._id !== listedUser._id && (
                        <button
                          onClick={() => {
                            const confirmDelete = window.confirm(
                              `Are you sure you want to delete the user "${listedUser.firstName} ${listedUser.lastName}""?`
                            );
                            if (confirmDelete) {
                              deleteUserAsAdmin(listedUser._id);
                            }
                          }}
                          className={styles.deleteButton}
                          title='Delete User'
                        >
                          Delete User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
