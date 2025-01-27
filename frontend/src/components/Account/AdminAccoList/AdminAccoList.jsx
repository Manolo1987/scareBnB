import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Für Routing
import styles from './AdminAccoList.module.css';
import { useAcco } from '../../../context/AccommodationContext';
import { useAuth } from '../../../context/UserAuthContext';
import LoadingSpinner from '../../Shared/LoadingSpinner/LoadingSpinner.jsx';

export default function AdminAccoList() {
  const { user } = useAuth();
  const {
    allAccos,
    getAllAccommodations,
    stateFilter,
    setStateFilter,
    maxPrice,
    setMaxPrice,
    minPrice,
    setMinPrice,
    bedrooms,
    setBedrooms,
    minRating,
    setMinRating,
    deleteListing,
  } = useAcco();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setStateFilter('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setMinRating('');
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await getAllAccommodations();
      } catch (error) {
        console.error('Error loading accommodations:', error);
        setError('Failed to load accommodations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      loadData();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [stateFilter, maxPrice, minPrice, bedrooms, minRating]);

  return (
    <section className={styles.accoListContainer}>
      <h2>User Accommodations</h2>

      <p>Here you can view and delete accommodations from our users</p>
      {loading ? (
        <LoadingSpinner>
          <p>Loading accommodations...</p>
        </LoadingSpinner>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Title</th>
                  <th>City</th>
                  <th>Rating</th>
                  <th>Price/Night</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allAccos.accommodations
                  ?.filter((acco) => acco.owner._id !== user._id)
                  .sort((a, b) =>
                    a.owner.firstName.localeCompare(b.owner.firstName)
                  )
                  .map((acco) => (
                    <tr key={acco._id}>
                      <td>
                        {acco.owner.firstName} {acco.owner.lastName}
                      </td>
                      <td>{acco.title}</td>
                      <td>{acco.city}</td>
                      <td>{acco.rating}</td>
                      <td>{acco.pricePerNight}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <Link
                            to={`/accommodationList/${acco.title
                              .toLowerCase()
                              .replace(/\s+/g, '-')}?id=${acco._id}`}
                            state={{ id: acco._id }}
                            target='_blank'
                            rel='noopener noreferrer'
                            className={styles.viewButton}
                            title='View in a new tab'
                          >
                            View
                          </Link>
                          <button
                            onClick={() => {
                              const confirmDelete = window.confirm(
                                `Are you sure you want to delete the accommodation "${acco.title}"?`
                              );
                              if (confirmDelete) {
                                deleteListing(acco._id);
                              }
                            }}
                            className={`buttonEffect ${styles.deleteButton}`}
                            title='Delete'
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
