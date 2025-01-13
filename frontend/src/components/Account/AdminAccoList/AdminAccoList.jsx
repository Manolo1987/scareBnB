import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Für Routing
import styles from './AdminAccoList.module.css';
import { useAcco } from '../../../context/AccommodationContext';
import { useAuth } from '../../../context/UserAuthContext';
import PaginationPage from '../../AccomodationList/PaginationPage/PaginationPage';
import { Spinner } from '@phosphor-icons/react';

export default function AdminAccoList() {
  const { user } = useAuth();
  const {
    allAccos,
    getAllAccommodations,
    currentPage,
    setCurrentPage,
    stateFilter,
    maxPrice,
    minPrice,
    bedrooms,
    minRating,
    sortBy,
    sortOrder,
    deleteListing,
  } = useAcco();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 21;

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await getAllAccommodations(limit);
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
  }, [
    stateFilter,
    maxPrice,
    minPrice,
    bedrooms,
    minRating,
    sortBy,
    sortOrder,
    currentPage,
  ]);

  const handlePageChange = (page) => {
    console.log('Switching to page:', page);
    setCurrentPage(page);
  };

  const totalPages = allAccos.pagination?.totalCount
    ? Math.ceil(allAccos.pagination.totalCount / limit)
    : 1;

  return (
    <div>
      {loading ? (
        <div className={styles.loadingContainer}>
          <Spinner size={32} className={styles.spinner} />
          <p>Loading accommodations...</p>
        </div>
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
                            className={styles.deleteButton}
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
          <PaginationPage
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
