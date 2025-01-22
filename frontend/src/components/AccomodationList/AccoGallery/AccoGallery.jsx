import React, { useEffect, useState } from 'react';
import styles from './AccoGallery.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAcco } from '../../../context/AccommodationContext';
import AccoCard from '../../Shared/AccoCard/AccoCard';
import PaginationPage from '../PaginationPage/PaginationPage';
import { Spinner } from '@phosphor-icons/react';

export default function AccoGallery() {
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
  } = useAcco();

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 21;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page'), 10) || 1;
    setCurrentPage(page);
  }, [location.search, setCurrentPage]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null); // error reset vor neuer anfrage
      try {
        await getAllAccommodations(limit);
      } catch (error) {
        console.error('Error loading accommodations:', error);
        setError('Failed to load accommodations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // 100ms timeout um sicher zu gehen, dass alle states geupdatet sind
    const timeoutId = setTimeout(() => {
      loadData();
    }, 100);

    // cleanup fürs timeout
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
    navigate(`?page=${page}`);
  };

  const totalPages = allAccos.pagination?.totalCount
    ? Math.ceil(allAccos.pagination.totalCount / limit)
    : 1;

  return (
    <div className={styles.accoGallery}>
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
          <div className={styles.accoList}>
            {allAccos?.accommodations?.length > 0 ? (
              allAccos.accommodations.map((acco, index) => (
                <div key={acco.id || index} className={styles.accoCard}>
                  <AccoCard acco={acco} />
                </div>
              ))
            ) : (
              <p>No accommodations found</p>
            )}
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
