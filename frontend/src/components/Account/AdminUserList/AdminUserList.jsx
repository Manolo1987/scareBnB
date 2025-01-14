import React, { useEffect } from 'react';
import styles from './AdminUserList.module.css';
import { useAuth } from '../../../context/UserAuthContext';
import { Link } from 'react-router-dom';

export default function AdminUserList() {
  const { deleteUserAsAdmin, user, allUsers } = useAuth();

  return (
    <section className={styles.userListContainer}>
      <h2>All ScareBnB Users</h2>

      <p>Here you can view and delete users</p>
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
                  <td>{listedUser.bookings.length}</td>
                  <td>
                    <details>
                      <summary>Listings ({listedUser.listings.length})</summary>
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
    </section>
  );
}
